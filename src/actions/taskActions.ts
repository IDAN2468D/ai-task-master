'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Task, { ITask } from '@/models/Task';
import { model } from '@/lib/gemini';
import { getCurrentUser } from '@/actions/authActions';
import { sendTaskCreatedEmail } from '@/lib/email';
import { awardTaskCompletion } from '@/actions/gamificationActions';

export async function getTasks(searchQuery?: string, filterPriority?: string) {
  try {
    await connectDB();
    const query: any = {};
    if (searchQuery) query.title = { $regex: searchQuery, $options: 'i' };
    if (filterPriority && filterPriority !== 'All') query.priority = filterPriority;

    // Only select fields needed by the UI for faster query + smaller payload
    const tasks = await Task.find(query)
      .select('title description status priority category dueDate subtasks tags recurring createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const normalizedTasks = tasks.map((task: any) => ({
      ...task,
      status: task.status || (task.isCompleted ? 'Done' : 'Todo'),
      subtasks: task.subtasks || [],
    }));

    return JSON.parse(JSON.stringify(normalizedTasks));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

/**
 * AI Smart Task Creation: Automatically guesses priority and category using Gemini
 */
export async function createSmartTask(formData: FormData) {
  try {
    await connectDB();
    const title = formData.get('title') as string;
    const useAI = formData.get('useAI') === 'true';

    if (!title || title.trim() === '') throw new Error('Task title cannot be empty.');

    let priority = 'Medium';
    let category = 'אישי';

    let energyLevel = 'Medium';

    if (useAI) {
      const prompt = `Analyze this task title: "${title}". 
            Guess the best priority (High, Medium, Low), category (עבודה, אישי, דחוף, בריאות, פיננסים), and required energy level (Low, Medium, High).
            Return ONLY a valid JSON object like this: {"priority": "High", "category": "עבודה", "energyLevel": "High"}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      try {
        const aiData = JSON.parse(response.text().replace(/```json|```/g, '').trim());
        priority = aiData.priority || 'Medium';
        category = aiData.category || 'אישי';
        energyLevel = aiData.energyLevel || 'Medium';
      } catch (e) {
        console.warn("AI Smart classification failed, using defaults");
      }
    } else {
      priority = (formData.get('priority') as string) || 'Medium';
      category = (formData.get('category') as string) || 'אישי';
    }

    const taskData = {
      title: title.trim(),
      category,
      priority,
      energyLevel,
      status: 'Todo',
      subtasks: [],
    };

    const dueDateStr = formData.get('dueDate') as string;
    if (dueDateStr) (taskData as any).dueDate = new Date(dueDateStr);

    await Task.create(taskData);

    // Send email notification (non-blocking)
    const user = await getCurrentUser();
    if (user) {
      sendTaskCreatedEmail(user.name, user.email, title.trim(), priority, category);
    }

    revalidatePath('/');
  } catch (error) {
    console.error('Error creating smart task:', error);
    throw new Error('Failed to create task');
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, { status: newStatus });

    // Gamification Hook: Award XP if task is marked as Done
    if (newStatus === 'Done') {
      const result = await awardTaskCompletion(taskId);
      // We don't necessarily need to slow down the UI for this, 
      // as the UserStats will re-fetch on pathname change/revalidation.
      console.log('Gamification Result:', result);
    }

    revalidatePath('/');
  } catch (error) {
    console.error('Error updating task status:', error);
    throw new Error('Failed to update task status');
  }
}

export async function generateSubtasksWithAI(taskId: string, taskTitle: string) {
  try {
    await connectDB();
    const prompt = `Generate 3 to 5 short, actionable subtasks for: "${taskTitle}". Return ONLY a JSON array of strings. Write subtasks in Hebrew.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();

    const subtaskTitles = JSON.parse(text);
    if (Array.isArray(subtaskTitles)) {
      const newSubtasks = subtaskTitles.map(title => ({ title: title.trim(), isCompleted: false }));
      await Task.findByIdAndUpdate(taskId, { $push: { subtasks: { $each: newSubtasks } } });
      revalidatePath('/');
    }
  } catch (error) {
    console.error('Error generating AI subtasks:', error);
    throw new Error('AI generation failed');
  }
}

/**
 * AI Smart Breakdown: Deep analysis of a task and its subtasks
 */
export async function smartBreakdown(taskId: string) {
  try {
    await connectDB();
    const task = await Task.findById(taskId);
    if (!task) return;

    const prompt = `Task: "${task.title}". Current Subtasks: ${task.subtasks.map((s: any) => s.title).join(', ')}. 
        Act as a project manager. Provide a concise, motivating summary of what needs to be done and give 2 extra advanced tips for success. 
        Limit to 3 sentences total. Reply in Hebrew.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "ה-AI עסוק ברגע זה, אבל אתה תצליח!";
  }
}

export async function addSubtask(taskId: string, title: string) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, { $push: { subtasks: { title, isCompleted: false } } });
    revalidatePath('/');
  } catch (error) { throw new Error('Failed to add subtask'); }
}

export async function toggleSubtask(taskId: string, subtaskId: string, currentStatus: boolean) {
  try {
    await connectDB();
    await Task.updateOne({ _id: taskId, "subtasks._id": subtaskId }, { $set: { "subtasks.$.isCompleted": !currentStatus } });
    revalidatePath('/');
  } catch (error) { throw new Error('Failed to toggle subtask'); }
}

/**
 * AI Task Optimizer: Rewrites a task title to be more professional or concise.
 */
export async function optimizeTaskTitle(taskId: string, currentTitle: string) {
  try {
    await connectDB();
    const prompt = `Task: "${currentTitle}". Rewrite this task title to be more professional, concise, and clear (maximum 5 words). Write in Hebrew. Return ONLY the new title string.`;
    const result = await model.generateContent(prompt);
    const newTitle = result.response.text().trim().replace(/^"|"$/g, '');

    await Task.findByIdAndUpdate(taskId, { title: newTitle });
    revalidatePath('/');
  } catch (error) {
    console.error('Error optimizing task title:', error);
    throw new Error('AI optimization failed');
  }
}

export async function deleteTask(taskId: string) {
  try {
    await connectDB();
    await Task.findByIdAndDelete(taskId);
    revalidatePath('/');
  } catch (error) { throw new Error('Failed to delete task'); }
}

/**
 * AI Weekly Intelligence: Analyzes all tasks and returns a strategic summary.
 */
export async function generateWeeklyInsight() {
  try {
    await connectDB();
    const tasks = await Task.find({}).lean();

    if (tasks.length === 0) return "הוסף משימות כדי לקבל דוחות מודיעין מבוססי AI!";

    const taskSummary = tasks.map((t: any) => `- ${t.title} (${t.status}, ${t.priority})`).join('\n');

    const prompt = `As an elite productivity coach, analyze this user's current task list:
    ${taskSummary}
    
    Provide a 2-3 sentence strategic high-level insight about their current workload.
    Be precise, slightly provocative, and extremely motivating. Reply in Hebrew. Return ONLY the insight text.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating AI weekly insight:', error);
    return "העומס שלך גבוה, אבל הפוטנציאל שלך גבוה יותר. תמשיך לדחוף!";
  }
}

/**
 * AI Chat Companion: Interact with AI about your tasks
 */
export async function chatWithAI(userMessage: string) {
  try {
    await connectDB();
    const tasks = await Task.find({}).lean();

    const taskContext = tasks.map((t: any) =>
      `- "${t.title}" [סטטוס: ${t.status}, עדיפות: ${t.priority}, קטגוריה: ${t.category || 'לא מוגדר'}]`
    ).join('\n');

    const prompt = `You are an AI productivity assistant for a task management app called TaskFlow.
    The user is speaking Hebrew. Always reply in Hebrew.
    
    Here are the user's current tasks:
    ${taskContext || 'אין משימות כרגע'}
    
    The user says: "${userMessage}"
    
    Respond helpfully and concisely (max 3 sentences). Be motivating and insightful.
    If the user asks about their tasks, provide specific advice based on the data above.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in AI chat:', error);
    return "מצטער, נתקלתי בבעיה. נסה שוב בעוד רגע! 🤖";
  }
}

/**
 * AI Voice Command: Parse voice input and create a task from it
 */
export async function createTaskFromVoice(transcript: string) {
  try {
    await connectDB();

    const prompt = `The user dictated this task via voice (in Hebrew): "${transcript}"
    Parse it and extract the task details.
    Return ONLY a valid JSON object like this:
    {"title": "cleaned task title in Hebrew", "priority": "High/Medium/Low", "category": "עבודה/אישי/דחוף/בריאות/פיננסים", "dueDate": "YYYY-MM-DD or null"}
    
    If no due date is mentioned, set dueDate to null.
    Clean up the title to be professional and concise.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    const taskData: any = {
      title: parsed.title || transcript,
      category: parsed.category || 'אישי',
      priority: parsed.priority || 'Medium',
      status: 'Todo',
      subtasks: [],
    };

    if (parsed.dueDate) {
      taskData.dueDate = new Date(parsed.dueDate);
    }

    await Task.create(taskData);
    revalidatePath('/');

    return { success: true, title: taskData.title, priority: taskData.priority, category: taskData.category };
  } catch (error) {
    console.error('Error creating task from voice:', error);
    return { success: false, title: transcript, priority: 'Medium', category: 'אישי' };
  }
}

// ─── Tag & Description Actions ───

export async function updateTaskDescription(taskId: string, description: string) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, { description });
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating description:', error);
    throw new Error('Failed to update description');
  }
}

export async function addTagToTask(taskId: string, tagName: string, tagColor: string) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, {
      $addToSet: { tags: { name: tagName, color: tagColor } }
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error adding tag:', error);
    throw new Error('Failed to add tag');
  }
}

export async function removeTagFromTask(taskId: string, tagName: string) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, {
      $pull: { tags: { name: tagName } }
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error removing tag:', error);
    throw new Error('Failed to remove tag');
  }
}

export async function createRecurringFromTask(taskId: string) {
  try {
    await connectDB();
    const task = await Task.findById(taskId);
    if (!task || task.status !== 'Done') return;

    // Clone the task as a new Todo if it's recurring
    if (task.recurring?.enabled) {
      const freq = task.recurring.frequency;
      const now = new Date();
      const nextDue = new Date(now);

      if (freq === 'daily') nextDue.setDate(now.getDate() + 1);
      else if (freq === 'weekly') nextDue.setDate(now.getDate() + 7);
      else if (freq === 'monthly') nextDue.setMonth(now.getMonth() + 1);

      await Task.create({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: 'Todo',
        tags: task.tags,
        subtasks: task.subtasks.map((s: any) => ({ title: s.title, isCompleted: false })),
        recurring: { enabled: true, frequency: freq, nextDue },
        dueDate: nextDue,
      });
      revalidatePath('/');
    }
  } catch (error) {
    console.error('Error creating recurring task:', error);
  }
}

/**
 * AI Task Clustering: Group related tasks into projects
 */
export async function autoClusterTasks() {
  try {
    await connectDB();
    const tasks = await Task.find({ status: { $ne: 'Done' } }).lean();
    if (tasks.length < 3) return;

    const taskList = tasks.map((t: any) => ({ id: t._id, title: t.title }));
    const prompt = `Here is a list of tasks: ${JSON.stringify(taskList)}. 
    Group them into logical projects/clusters based on their meaning. 
    Return ONLY a JSON array of objects like this: [{"projectId": "Project Name", "taskIds": ["id1", "id2"]}]
    Limit to 3 clusters max. Use Hebrew for project names.`;

    const result = await model.generateContent(prompt);
    const clusters = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

    if (Array.isArray(clusters)) {
      for (const cluster of clusters) {
        await Task.updateMany(
          { _id: { $in: cluster.taskIds } },
          { projectId: cluster.projectId }
        );
      }
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error in clustering:', error);
    return { success: false };
  }
}

/**
 * AI Energy Analysis: Recommends tasks based on time of day / user energy
 */
export async function getEnergyInsights() {
  try {
    const hour = new Date().getHours();
    const isMorning = hour >= 5 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;

    await connectDB();
    const tasks = await Task.find({ status: { $ne: 'Done' } }).lean();

    let recommendation = "";
    if (isMorning) {
      const deepWorkTasks = tasks.filter((t: any) => t.energyLevel === 'High');
      recommendation = deepWorkTasks.length > 0
        ? `בוקר טוב! זה הזמן ל-Deep Work. המשימות ${deepWorkTasks.slice(0, 2).map((t: any) => t.title).join(', ')} דורשות ריכוז גבוה.`
        : "בוקר טוב! רמת האנרגיה שלך בשיא, אולי כדאי להוסיף משימה מאתגרת?";
    } else if (isAfternoon) {
      recommendation = "צהריים טובים. מומלץ להתמקד במשימות Low Energy כמו אדמיניסטרציה או תכתובות.";
    } else {
      recommendation = "ערב טוב. זמן מצוין לתכנון המשימות של מחר או סגירת קצוות קטנים.";
    }

    return recommendation;
  } catch (error) {
    return "שמור על קצב עבודה קבוע!";
  }
}

/**
 * AI Bottleneck Detector
 */
export async function getBottleneckAlerts() {
  try {
    await connectDB();
    const tasks = await Task.find({ status: { $ne: 'Done' } }).lean();

    const highPriority = tasks.filter((t: any) => t.priority === 'High');
    if (highPriority.length > 5) {
      return `אזהרת עומס: יש לך ${highPriority.length} משימות בעדיפות גבוהה! שקול לדחות חלק מהן כדי למנוע שחיקה.`;
    }

    const overdue = tasks.filter((t: any) => t.dueDate && new Date(t.dueDate) < new Date());
    if (overdue.length > 0) {
      return `שים לב: יש לך ${overdue.length} משימות בפיגור. כדאי לטפל בהן קודם.`;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function updateTaskDate(taskId: string, newDate: string | null) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, { dueDate: newDate ? new Date(newDate) : null });
    revalidatePath('/');
    revalidatePath('/calendar');
  } catch (error) {
    console.error('Error updating task date:', error);
    throw new Error('Failed to update task date');
  }
}
