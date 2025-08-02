import mongoose, { Schema } from 'mongoose';

const AccountSchema = new Schema({
    icon: { type: String },
    username: { type: String, required: true },
    playerTag: { 
        type: String, 
        unique: true, 
        sparse: true, // Allows null values but ensures uniqueness when present
        validate: {
            validator: function(v) {
                // Player tag should start with # and be 8-9 characters total
                return !v || /^#[A-Z0-9]{7,8}$/.test(v);
            },
            message: 'Player tag must start with # and be 7-8 characters after the # (e.g., #ABC1234)'
        }
    },
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