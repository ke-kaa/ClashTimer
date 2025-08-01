import mongoose, { Schema } from 'mongoose';

const AccountSchema = new Schema({
    icon: { type: String },
    username: { type: String, required: true, unique: true },
    townHallLevel: { 
        type: Number, 
        required: true, 
        min: 2, 
        max: 17 
    },
    clanTag: { type: String, default: null },
    lastActive: { type: Date, default: Date.now },
    totalUpgrades: { type: Number, default: 0 },
    preferences: {
        notifications: { type: Boolean, default: true },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        language: { type: String, default: 'en' }
    },
    buildings: [{ type: Schema.Types.ObjectId, ref: 'Building' }],
    heroes: [{ type: Schema.Types.ObjectId, ref: 'Hero' }],
    troops: [{ type: Schema.Types.ObjectId, ref: 'Troop' }],
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pet' }],
    siege: [{ type: Schema.Types.ObjectId, ref: 'Siege' }],
    spells: [{ type: Schema.Types.ObjectId, ref: 'Spell' }],
    research: [{ type: Schema.Types.ObjectId, ref: 'Research' }],
    upgrades: [{ type: Schema.Types.ObjectId, ref: 'Upgrade' }],
}, { timestamps: true });

export default mongoose.model("Account", AccountSchema);