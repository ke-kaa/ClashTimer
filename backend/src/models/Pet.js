import mongoose, { Schema } from 'mongoose';

const PetSchema = new Schema({
    icon: { type: String },
    name: { type: String, required: true },
    petType: { 
        type: String, 
        enum: ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn', 'Phoenix', 'Poison Lizard', 'Diggy', 'Frosty', 'Spirit Fox', 'Angry Jelly'],
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
    assignedHero: { type: String, default: null }, // which hero this pet is assigned to
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
}, { timestamps: true });

export default mongoose.model("Pet", PetSchema);