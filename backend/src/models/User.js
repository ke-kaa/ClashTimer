import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

export default mongoose.model('User', UserSchema);