import mongoose, { Schema } from 'mongoose';

const WallLevelSchema = new Schema({
    level: { type: Number, required: true, min: 0 },
    count: { type: Number, required: true, min: 0 },
}, { _id: false });

const WallGroupSchema = new Schema({
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true, unique: true, index: true },
    maxLevel: { type: Number, required: true, min: 1 },
    levels: { type: [WallLevelSchema], default: [] },
}, { timestamps: true });

// helper to get total count
WallGroupSchema.virtual('totalPieces').get(function() {
    return (this.levels || []).reduce((sum, l) => sum + l.count, 0);
});

export default mongoose.model('WallGroup', WallGroupSchema);
