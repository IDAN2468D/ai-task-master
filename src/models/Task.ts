import mongoose, { Schema, Document, Model } from 'mongoose';

// Define Subtask Interface
export interface ISubtask {
    _id?: string;
    title: string;
    isCompleted: boolean;
}

// Define Tag Interface
export interface ITag {
    name: string;
    color: string;
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
    tags: ITag[];
    energyLevel?: 'Low' | 'Medium' | 'High'; // AI-driven energy requirement
    estimatedHours?: number;
    projectId?: string; // For automated clustering
    recurring?: {
        enabled: boolean;
        frequency: 'daily' | 'weekly' | 'monthly';
        nextDue?: Date;
    };
    googleEventId?: string;
    googleCalendarLink?: string;
    userId?: string;
    links: { url: string, summary?: string }[];
    xpAwarded: boolean;
    createdAt: Date;
}

// Subtask Schema
const SubtaskSchema = new Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
});

// Tag Schema
const TagSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, default: '#4318FF' }
}, { _id: false });

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
        default: '',
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
        default: 'אישי',
    },
    dueDate: {
        type: Date,
        required: false,
    },
    subtasks: [SubtaskSchema],
    tags: { type: [TagSchema], default: [] },
    recurring: {
        enabled: { type: Boolean, default: false },
        frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
        nextDue: { type: Date },
    },
    userId: {
        type: String,
        required: false,
    },
    energyLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    estimatedHours: {
        type: Number,
        default: 1,
    },
    projectId: {
        type: String,
        required: false,
    },
    googleEventId: {
        type: String,
        required: false,
    },
    links: [
        {
            url: { type: String, required: true },
            summary: { type: String, required: false },
        }
    ],
    xpAwarded: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for faster queries
TaskSchema.index({ status: 1, priority: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ 'tags.name': 1 });

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
