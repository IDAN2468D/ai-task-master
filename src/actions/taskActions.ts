'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Task, { ITask } from '@/models/Task';

export async function getTasks(searchQuery?: string, filterPriority?: string) {
  try {
    await connectDB();
    const query: any = {};
    if (searchQuery) query.title = { $regex: searchQuery, $options: 'i' };
    if (filterPriority && filterPriority !== 'All') query.priority = filterPriority;

    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

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
