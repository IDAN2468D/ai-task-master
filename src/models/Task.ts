import mongoose, { Schema, Document, Model } from 'mongoose';

// Define Subtask Interface
export interface ISubtask {
    _id?: string;
    title: string;
    isCompleted: boolean;
}

// Define Task Interface
export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    dueDate?: Date;
    subtasks: ISubtask[];
    createdAt: Date;
}

// Subtask Schema
const SubtaskSchema = new Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
});

// Task Schema
const TaskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this task.'],
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Todo', 'InProgress', 'Done'],
        default: 'Todo',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    category: {
        type: String,
        default: 'Personal',
    },
    dueDate: {
        type: Date,
        required: false,
    },
    subtasks: [SubtaskSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
