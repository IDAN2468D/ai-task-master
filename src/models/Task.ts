import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the clear, strictly typed interface for our Task Model
export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    dueDate?: Date;
    createdAt: Date;
}

// Create the Mongoose Schema 
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Use existing model if it exists
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
