import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true }, // hashed token
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isVerified: { type: Boolean, default: false },

    passwordResetToken: String, // hashed
    passwordResetExpires: Date,

    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: Date,

    refreshTokens: [RefreshTokenSchema],

    passwordChangedAt: Date
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

UserSchema.methods.comparePassword = function(candidate) {
    return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp /* seconds */) {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

export default mongoose.model('User', UserSchema);