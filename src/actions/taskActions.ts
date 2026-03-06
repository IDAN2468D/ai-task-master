'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Task, { ITask } from '@/models/Task';
import { model } from '@/lib/gemini';

/**
 * Fetch tasks with server-side searching and filtering.
 */
export async function getTasks(searchQuery?: string, filterPriority?: string) {
  try {
    await connectDB();
    const query: any = {};
    if (searchQuery) query.title = { $regex: searchQuery, $options: 'i' };
    if (filterPriority && filterPriority !== 'All') query.priority = filterPriority;

    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

    // Fallback for legacy tasks missing the 'status' field
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
 * Create a new task.
 */
export async function createTask(formData: FormData) {
  try {
    await connectDB();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const dueDateStr = formData.get('dueDate') as string;

    if (!title || title.trim() === '') throw new Error('Task title cannot be empty.');

    const taskData: any = {
      title: title.trim(),
      category: category || 'Personal',
      priority: priority || 'Medium',
      status: 'Todo',
      subtasks: [],
    };

    if (dueDateStr) taskData.dueDate = new Date(dueDateStr);

    await Task.create(taskData);
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
}

/**
 * Update task status (for Kanban DND).
 */
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

/**
 * Manual subtask addition.
 */
export async function addSubtask(taskId: string, title: string) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, {
      $push: { subtasks: { title, isCompleted: false } }
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error adding subtask:', error);
    throw new Error('Failed to add subtask');
  }
}

/**
 * Toggle subtask completion.
 */
export async function toggleSubtask(taskId: string, subtaskId: string, currentStatus: boolean) {
  try {
    await connectDB();
    await Task.updateOne(
      { _id: taskId, "subtasks._id": subtaskId },
      { $set: { "subtasks.$.isCompleted": !currentStatus } }
    );
    revalidatePath('/');
  } catch (error) {
    console.error('Error toggling subtask:', error);
    throw new Error('Failed to toggle subtask');
  }
}

/**
 * AI Subtask Generation using Google Gemini.
 */
export async function generateSubtasksWithAI(taskId: string, taskTitle: string) {
  try {
    await connectDB();

    const prompt = `Generate 3 to 5 short, actionable, and specific subtasks for the task: "${taskTitle}". 
    Return ONLY a valid JSON array of strings, like this: ["Subtask 1", "Subtask 2"]. 
    Do not include any other text or markdown formatting in your response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse the AI response
    let subtaskTitles: string[] = [];
    try {
      // Clean markdown backticks if AI included them
      const cleanedText = text.replace(/```json|```/g, '').trim();
      subtaskTitles = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("AI response parsing failed:", text);
      throw new Error("AI returned an invalid format. Please try again.");
    }

    if (Array.isArray(subtaskTitles)) {
      const newSubtasks = subtaskTitles.map(title => ({ title: title.trim(), isCompleted: false }));

      await Task.findByIdAndUpdate(taskId, {
        $push: { subtasks: { $each: newSubtasks } }
      });

      revalidatePath('/');
    }

  } catch (error) {
    console.error('Error generating AI subtasks:', error);
    throw new Error('Failed to generate subtasks with AI');
  }
}

/**
 * Delete task.
 */
export async function deleteTask(taskId: string) {
  try {
    await connectDB();
    await Task.findByIdAndDelete(taskId);
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}
