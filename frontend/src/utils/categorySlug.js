export const CATEGORY_SLUGS = {
    Defenses: "defenses",
    Traps: "traps",
    Army: "army",
    Resource: "resource",

    Troops: "troops",
    "Dark Troops": "troops",
    Spells: "spells",
    Sieges: "sieges",
    Heroes: "heroes",
    Equipment: "equipment",
    Pets: "pets",
    Walls: "walls",
};

export function getCategorySlug(category) {
    return (
        CATEGORY_SLUGS[category] || category.toLowerCase().replace(/\s+/g, "")
    );
}
