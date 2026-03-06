import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the clear, strictly typed interface for our Task Model
export interface ITask extends Document {
    title: string;
    description?: string;
    isCompleted: boolean;
    category: string;
    dueDate?: Date;
    createdAt: Date;
}

// Create the Mongoose Schema reflecting the interface
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
    isCompleted: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        default: 'Personal',
        enum: ['Work', 'Personal', 'Urgent', 'Health', 'Finance'],
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

// Use existing model if it exists to avoid overwrite errors during hot reloading in Next.js
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
