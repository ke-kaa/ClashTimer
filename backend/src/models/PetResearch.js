import mongoose, { Schema } from 'mongoose';

const PetResearchSchema = new Schema({
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
        enum: ['Idle', 'Researching'],
        default: 'Idle'
    },
    researchStartTime: { type: Date },
    researchEndTime: { type: Date },
    researchCost: { type: Number, default: 0 },
    researchTime: { type: Number, default: 0 }, // in seconds
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    }
}, { timestamps: true });

export default mongoose.model("PetResearch", PetResearchSchema);