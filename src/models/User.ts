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
    xp: number;
    level: number;
    currency: number;
    unlockedItems: string[];
    avatar?: {
        type: string;
        skin: string;
        clothing: string;
        accessory: string;
    };
    activeBuffs?: {
        name: string;
        expiresAt: Date;
    }[];
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
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    currency: { type: Number, default: 0 },
    unlockedItems: { type: [String], default: [] },
    avatar: {
        type: { type: String, default: 'human_base' },
        skin: { type: String, default: 'default' },
        clothing: { type: String, default: 'default' },
        accessory: { type: String, default: 'none' }
    },
    activeBuffs: [{
        name: String,
        expiresAt: Date
    }],
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
