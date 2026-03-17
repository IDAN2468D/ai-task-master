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
    const session = await getCurrentUser();
    if (!session) return [];

    const query: any = { userId: session.userId };
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

    const session = await getCurrentUser();
    if (!session) throw new Error('Not authenticated');

    const taskData = {
      title: title.trim(),
      category,
      priority,
      energyLevel,
      status: 'Todo',
      subtasks: [],
      userId: session.userId,
    };

    const dueDateStr = formData.get('dueDate') as string;
    if (dueDateStr) (taskData as any).dueDate = new Date(dueDateStr);

    await Task.create(taskData);

    // Send email notification (non-blocking)
    sendTaskCreatedEmail(session.name, session.email, title.trim(), priority, category);

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

export async function completeTaskWithBonus(taskId: string, multiplier: number) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, { status: 'Done' });

    // Gamification Hook: Award XP if task is marked as Done with multiplier
    const result = await awardTaskCompletion(taskId, multiplier);
    console.log(`Gamification Result (x${multiplier} multiplier):`, result);

    revalidatePath('/');
    return result;
  } catch (error) {
    console.error('Error completing task with bonus:', error);
    throw new Error('Failed to complete task with bonus');
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
/**
 * AI Voice Assistant 2.0: Parse voice input for creating, moving, or deleting tasks.
 */
export async function handleVoiceCommand(transcript: string) {
  try {
    await connectDB();
    const tasks = await Task.find({ status: { $ne: 'Done' } }).select('title status').lean();
    const taskContext = tasks.map((t: any) => ({ id: t._id, title: t.title, status: t.status }));

    const prompt = `The user dictated this command via voice (in Hebrew): "${transcript}"
    Existing tasks: ${JSON.stringify(taskContext)}
    
    Determine the user's intent: "CREATE", "MOVE", "DELETE", or "UNKNOWN".
    - "CREATE": user wants to add a new task.
    - "MOVE": user wants to change a task status (e.g., move "Project X" to "InProgress").
    - "DELETE": user wants to remove a task.
    
    Return ONLY a valid JSON object:
    {
      "intent": "CREATE" | "MOVE" | "DELETE" | "UNKNOWN",
      "data": {
        "title": "task title in Hebrew (for CREATE or identifying for MOVE/DELETE)",
        "priority": "High/Medium/Low (for CREATE)",
        "category": "category in Hebrew (for CREATE)",
        "status": "Todo/InProgress/Done (for MOVE)",
        "taskId": "id from existing tasks (for MOVE/DELETE if identified)"
      }
    }
    
    Clean up titles and be smart about matching. If intent is MOVE, try to find the taskId in the context.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    if (parsed.intent === 'CREATE') {
      const taskData = {
        title: parsed.data.title || transcript,
        category: parsed.data.category || 'אישי',
        priority: parsed.data.priority || 'Medium',
        status: 'Todo',
        subtasks: [],
      };
      const nt = await Task.create(taskData);
      revalidatePath('/');
      return { success: true, action: 'CREATE', title: nt.title };
    }

    if (parsed.intent === 'MOVE' && parsed.data.taskId) {
      await Task.findByIdAndUpdate(parsed.data.taskId, { status: parsed.data.status });
      revalidatePath('/');
      return { success: true, action: 'MOVE', title: parsed.data.title, status: parsed.data.status };
    }

    if (parsed.intent === 'DELETE' && parsed.data.taskId) {
      await Task.findByIdAndDelete(parsed.data.taskId);
      revalidatePath('/');
      return { success: true, action: 'DELETE', title: parsed.data.title };
    }

    return { success: false, message: 'לא הצלחתי להבין את הפקודה. נסה שוב - למשל "צור משימה חדשה" או "העבר את משימת X לבוצע"' };
  } catch (error) {
    console.error('Error in Voice 2.0:', error);
    return { success: false, message: 'משהו השתבש בעיבוד הפקודה הקולית.' };
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

/**
 * Smart Link Summary: Fetches link content (meta tags) and summarizes using Gemini.
 */
export async function addSmartLink(taskId: string, url: string) {
  try {
    await connectDB();
    const res = await fetch(url).then(r => r.text());
    const titleMatch = res.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : url;

    const prompt = `Summarize this website title and URL into a 5-word Hebrew description: Title: "${title}", URL: "${url}". Return ONLY the description.`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    await Task.findByIdAndUpdate(taskId, {
      $push: { links: { url, summary } }
    });

    revalidatePath('/');
    return { success: true, summary };
  } catch (error) {
    console.error('Error in link summary:', error);
    // Generic fallback if fetch fails
    await Task.findByIdAndUpdate(taskId, {
      $push: { links: { url, summary: 'קישור נוסף' } }
    });
    revalidatePath('/');
    return { success: false };
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

export async function addCommentToTask(taskId: string, text: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    await connectDB();
    await Task.findByIdAndUpdate(taskId, {
      $push: {
        comments: {
          userId: user.userId,
          userName: user.name,
          text,
          createdAt: new Date()
        }
      }
    });

    revalidatePath('/');
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
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

/**
 * Eisenhower Matrix Distribution (AI)
 * Categorizes active tasks into Q1, Q2, Q3, Q4
 */
export async function distributeTasksMatrix(tasks: { id: string, title: string, desc: string }[]) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        const prompt = `You are a productivity expert using the Eisenhower Matrix.
        I will provide a JSON array of tasks exactly like this:
        [ {"id": "taskId1", "title": "Buy milk", "desc": ""} ]
        
        You must analyze each task and assign it to a quadrant:
        'Q1' = Urgent & Important (Do first)
        'Q2' = Important, Not Urgent (Schedule)
        'Q3' = Urgent, Not Important (Delegate)
        'Q4' = Not Urgent & Not Important (Eliminate)

        Tasks:
        ${JSON.stringify(tasks)}

        Respond ONLY with a valid JSON object mapping task IDs to quadrants.
        Example response format:
        {
            "taskId1": "Q1",
            "taskId2": "Q4"
        }`;
        
        const result = await model.generateContent(prompt);
        let resultText = result.response.text().trim();
        
        // Clean JSON formatting if necessary
        if (resultText.startsWith('```json')) {
            resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const mapping = JSON.parse(resultText);
        
        return { success: true, mapping };
    } catch (error) {
        console.error('Matrix Sorting Error', error);
        return { success: false, mapping: {} };
    }
}

/**
 * AI Auto-Scheduler
 * Given a list of tasks, assigns them to time blocks for the current day
 */
export async function autoScheduleDay(tasks: { id: string, title: string, durationEstimate: number }[]) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        const prompt = `You are an AI calendar assistant.
        I will give you a list of tasks for today:
        ${JSON.stringify(tasks)}
        
        Schedule them between 09:00 and 18:00 today.
        Prioritize larger tasks earlier in the day. Leave small 15m gaps between tasks.
        
        Respond ONLY with a JSON array of objects, like this:
        [
          { "taskId": "id1", "startTime": "09:00", "endTime": "10:30" }
        ]`;
        
        const result = await model.generateContent(prompt);
        let resultText = result.response.text().trim();
        if (resultText.startsWith('```json')) {
            resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const schedule = JSON.parse(resultText);
        return { success: true, schedule };
    } catch (error) {
        console.error('Auto Schedule Error', error);
        return { success: false, schedule: [] };
    }
}

/**
 * AI Mind Map Generator
 */
export async function generateMindMap(tasks: { id: string, title: string, subtaskCount: number }[]) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        const prompt = `You are a project manager AI.
        I will give you a list of tasks:
        ${JSON.stringify(tasks)}
        
        Group them into a logical Mind Map structure with high-level projects/nodes, and subnodes.
        Respond ONLY with a valid JSON object representing the structure:
        {
          "nodes": [
            {
              "id": "node1",
              "title": "Main Project Idea",
              "category": "Development",
              "subNodes": [
                 { "id": "sub1", "title": "Sub task title" }
              ]
            }
          ]
        }`;
        
        const result = await model.generateContent(prompt);
        let resultText = result.response.text().trim();
        if (resultText.startsWith('```json')) {
            resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const data = JSON.parse(resultText);
        return { success: true, data };
    } catch (error) {
        console.error('Mind Map Error', error);
        return { success: false, data: null };
    }
}

/**
 * AI Task Prep / Content Generation
 */
export async function generateTaskPrep(taskId: string, title: string, desc?: string) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        const prompt = `You are a professional assistant. Prepare a short, highly practical draft, notes, or agenda for the following task:
        Title: "${title}"
        Description: "${desc || 'None'}"
        
        Provide the response in Markdown format, make it actionable, clean, and in Hebrew.`;
        
        const result = await model.generateContent(prompt);
        let resultText = result.response.text().trim();
        
        // Save it to the task as subtask or description append, or just return it as a new AI note
        await connectDB();
        const Task = (await import('@/models/Task')).default;
        
        const task = await Task.findOne({ _id: taskId, userId: session.userId });
        if (task) {
            // Append to description
            task.description = (task.description ? task.description + '\n\n---\n**🧠 AI Task Prep:**\n' : '**🧠 AI Task Prep:**\n') + resultText;
            await task.save();
        }

        return { success: true, content: resultText };
    } catch (error) {
        console.error('Task Prep Error', error);
        return { success: false, content: '' };
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
