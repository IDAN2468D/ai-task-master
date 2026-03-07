import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    googleTokens?: {
        accessToken: string;
        refreshToken: string;
        expiryDate: number;
    };
    image?: string;
    createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name.'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 6,
    },
    image: {
        type: String,
        required: false,
    },
    googleTokens: {
        accessToken: String,
        refreshToken: String,
        expiryDate: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
