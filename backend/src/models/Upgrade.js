import mongoose, { Schema } from 'mongoose';

const UpgradeSchema = new Schema({
    name: { type: String, required: true },
    currentLevel: { 
        type: Number, 
        required: true, 
        min: 0
    },
    nextLevel: { 
        type: Number, 
        required: true, 
        min: 1
    },
    status: {
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    upgradeStartTime: { type: Date },
    upgradeEndTime: { type: Date },
    upgradeCost: { type: Number, default: 0 },
    upgradeTime: { type: Number, default: 0 }, // in seconds
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type: String, 
        required: true,
        enum: ['Building', 'Hero', 'Troop', 'Spell', 'Siege', 'Pet']
    }
}, { timestamps: true });

export default mongoose.model("Upgrade", UpgradeSchema);
