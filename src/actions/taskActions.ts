'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

/**
 * Fetch all tasks from the MongoDB database.
 * Returns them sorted by creation date (newest first).
 */
export async function getTasks() {
  try {
    await connectDB();
    const tasks = await Task.find({}).sort({ createdAt: -1 }).lean();

    // We must serialize the Mongoose Documents (which have ObjectIds and Dates) 
    // to plain JSON objects before passing them to Client Components.
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.error('Error fetching tasks from DB:', error);
    throw new Error('Failed to fetch tasks');
  }
}

/**
 * Creates a new task in the database based on form data,
 * including category and dueDate.
 */
export async function createTask(formData: FormData) {
  try {
    await connectDB();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const dueDateStr = formData.get('dueDate') as string;

    if (!title || title.trim() === '') {
      throw new Error('Task title cannot be empty.');
    }

    const taskData: any = {
      title: title.trim(),
      category: category || 'Personal',
    };

    if (dueDateStr) {
      taskData.dueDate = new Date(dueDateStr);
    }

    // Create a new task.
    await Task.create(taskData);

    // Instantly invalidate the home page cache
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
}

/**
 * Toggles the completion status of a specific task.
 */
export async function toggleTaskStatus(taskId: string, currentStatus: boolean) {
  try {
    await connectDB();
    await Task.findByIdAndUpdate(taskId, { isCompleted: !currentStatus });
    revalidatePath('/');
  } catch (error) {
    console.error('Error toggling task status:', error);
    throw new Error('Failed to update task status');
  }
}

/**
 * Deletes a task from the database.
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
