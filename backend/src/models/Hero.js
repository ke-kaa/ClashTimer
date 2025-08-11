import mongoose, { Schema } from 'mongoose';

const HeroSchema = new Schema({
    name: { type: String, required: true },
    heroType: { 
        type: String, 
        enum: ['Dark Elixir', 'Elixir'],
        required: true 
    },
    currentLevel: { 
        type: Number, 
        required: true, 
        min: 0,
        validate: {
            validator: function(v) {
                return v <= this.maxLevel;
            },
            message: 'Current level cannot exceed max level'
        }
    },
    maxLevel: { type: Number, required: true, min: 1 },
    status: {
        type: String, 
        enum: ['Idle', 'Upgrading'],
        default: 'Idle'
    },
    upgradeStartTime: { type: Date },
    upgradeEndTime: { type: Date },
    upgradeCost: { type: Number, default: 0 },
    upgradeTime: { type: Number, default: 0 }, // in seconds
    // equipments: [{ type: Schema.Types.ObjectId, ref: 'HeroEquipment' }],
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
}, { timestamps: true });

export default mongoose.model("Hero", HeroSchema);
