'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Task, { ITask } from '@/models/Task';
import { model } from '@/lib/gemini';
import { getCurrentUser } from '@/actions/authActions';
import { sendTaskCreatedEmail } from '@/lib/email';

export async function getTasks(searchQuery?: string, filterPriority?: string) {
  try {
    await connectDB();
    const query: any = {};
    if (searchQuery) query.title = { $regex: searchQuery, $options: 'i' };
    if (filterPriority && filterPriority !== 'All') query.priority = filterPriority;

    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

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
    let category = 'Personal';

    if (useAI) {
      const prompt = `Analyze this task title: "${title}". 
            Guess the best priority (High, Medium, Low) and category (Work, Personal, Urgent, Health, Finance).
            Return ONLY a valid JSON object like this: {"priority": "High", "category": "Work"}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      try {
        const aiData = JSON.parse(response.text().replace(/```json|```/g, '').trim());
        priority = aiData.priority || 'Medium';
        category = aiData.category || 'Personal';
      } catch (e) {
        console.warn("AI Smart classification failed, using defaults");
      }
    } else {
      priority = (formData.get('priority') as string) || 'Medium';
      category = (formData.get('category') as string) || 'Personal';
    }

    const taskData = {
      title: title.trim(),
      category,
      priority,
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
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating task status:', error);
    throw new Error('Failed to update task status');
  }
}

export async function generateSubtasksWithAI(taskId: string, taskTitle: string) {
  try {
    await connectDB();
    const prompt = `Generate 3 to 5 short, actionable subtasks for: "${taskTitle}". Return ONLY a JSON array of strings.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();

    let subtaskTitles = JSON.parse(text);
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
        Limit to 3 sentences total.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "AI is busy at the moment, but you've got this!";
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
    const prompt = `Task: "${currentTitle}". Rewrite this task title to be more professional, concise, and clear (maximum 5 words). Return ONLY the new title string.`;
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
