import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        username: { type: String, required: true },
        playerTag: {
            type: String,
            unique: true,
            required: true,
            // validate: {
            //     validator: function(v) {
            //         // Player tag must start with # followed by 9-10 uppercase letters or digits
            //         return !v || /^#[A-Z0-9]{7, 9}$/.test(v);
            //     },
            //     message: 'Player tag must start with # and include 9-10 characters after it (e.g., #ABC12DEF3)'
            // }
        },
        townHallLevel: {
            type: Number,
            required: true,
            min: 2,
            max: 17,
        },
        expLevel: { type: Number, default: 0 },
        warStars: { type: Number, default: 0 },
        clanTag: { type: String, default: null },
        lastActive: { type: Date, default: Date.now },
        totalUpgrades: { type: Number, default: 0 },
        preferences: {
            notifications: { type: Boolean, default: true },
            theme: { type: String, enum: ["light", "dark"], default: "light" },
            language: { type: String, default: "en" },
        },
        buildings: [{ type: Schema.Types.ObjectId, ref: "Building" }],
        heroes: [{ type: Schema.Types.ObjectId, ref: "Hero" }],
        troops: [{ type: Schema.Types.ObjectId, ref: "Troop" }],
        pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
        siege: [{ type: Schema.Types.ObjectId, ref: "Siege" }],
        spells: [{ type: Schema.Types.ObjectId, ref: "Spell" }],
        research: [{ type: Schema.Types.ObjectId, ref: "Research" }],
        upgrades: [{ type: Schema.Types.ObjectId, ref: "Upgrade" }],
        walls: { type: Schema.Types.ObjectId, ref: "WallGroup", default: null },
    },
    { timestamps: true }
);

export default mongoose.model("Account", AccountSchema);
