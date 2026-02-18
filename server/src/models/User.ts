import mongoose, { Document } from 'mongoose';
import { UserRoleEnum } from '@shared/types';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
    email: string;
    password?: string;
    role: UserRoleEnum;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: Object.values(UserRoleEnum),
        default: UserRoleEnum.ADMIN
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password!, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password!);
};

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
