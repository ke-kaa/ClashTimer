import mongoose, { Schema } from 'mongoose';

const ResearchSchema = new Schema({
    icon: { type: String },
    name: { type: String, required: true },
    researchType: { 
        type: String, 
        enum: ['Troop', 'Spell', 'Siege Machine'],
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
    troop: {
        type: Schema.Types.ObjectId,
        ref: 'Troop'
    }
}, { timestamps: true });

export default mongoose.model("Research", ResearchSchema);
