import React, { useEffect, useMemo, useState } from "react";
import UpgradeRow from "../UpgradeRow/UpgradeRow";

const CATEGORY_ICON_IMPORTS = import.meta.glob(
    "../../../assets/VillageDetail/*/*.png"
);
const BUILDING_ICON_IMPORTS = import.meta.glob(
    "../../../assets/VillageDetail/Buildings/**/*.png"
);
const WALL_ICON_IMPORTS = import.meta.glob(
    "../../../assets/VillageDetail/Walls/*.png"
);

const BUILDING_TABS = new Set([
    "Defenses",
    "Traps",
    "Army",
    "Resource",
    "Walls",
]);

const slugify = (value = "") =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export default function UpgradeTable({ accountId, category, items = [] }) {
    const hasItems = items.length > 0;
    const [iconsMap, setIconsMap] = useState({});
    const [loadingIcons, setLoadingIcons] = useState(false);

    const normalizedItems = useMemo(
        () =>
            items.map((item) => ({
                ...item,
                __slug: slugify(item.name || item.displayName || ""),
                __level:
                    Number(
                        item.currentLevel ?? item.level ?? item.maxLevel ?? 1
                    ) || 1,
            })),
        [items]
    );

    useEffect(() => {
        let mounted = true;

        async function loadIcons() {
            if (!category) {
                setIconsMap({});
                return;
            }

            setLoadingIcons(true);

            try {
                if (category === "Walls") {
                    const keysToLoad = new Set(
                        normalizedItems.map(
                            (item) =>
                                `../../../assets/VillageDetail/Walls/wall-${item.__level}.png`
                        )
                    );
                    const validKeys = [...keysToLoad].filter(
                        (k) => WALL_ICON_IMPORTS[k]
                    );
                    const results = await Promise.all(
                        validKeys.map(async (key) => {
                            const mod = await WALL_ICON_IMPORTS[key]();
                            return { key, url: mod?.default ?? mod };
                        })
                    );

                    if (!mounted) return;
                    const map = {};
                    results.forEach(({ key, url }) => {
                        const base = key
                            .split("/")
                            .pop()
                            .replace(/\.[^/.]+$/, "");
                        map[base] = url; // wall-1
                    });
                    setIconsMap(map);
                    return;
                } else if (BUILDING_TABS.has(category)) {
                    const keysToLoad = new Set();

                    normalizedItems.forEach((item) => {
                        if (!item.__slug) return;
                        keysToLoad.add(
                            `../../../assets/VillageDetail/Buildings/${item.__slug}/${item.__slug}-${item.__level}.png`
                        );
                        keysToLoad.add(
                            `../../../assets/VillageDetail/Buildings/${item.__slug}/${item.__slug}.png`
                        );
                    });

                    const validKeys = [...keysToLoad].filter(
                        (k) => BUILDING_ICON_IMPORTS[k]
                    );
                    const results = await Promise.all(
                        validKeys.map(async (key) => {
                            const mod = await BUILDING_ICON_IMPORTS[key]();
                            return { key, url: mod?.default ?? mod };
                        })
                    );

                    if (!mounted) return;
                    const map = {};
                    results.forEach(({ key, url }) => {
                        const parts = key.split("/");
                        const slugFolderRaw = parts.at(-2);
                        const slugFolder = slugFolderRaw?.toLowerCase();
                        const fileName = parts.at(-1);
                        const baseName = fileName.replace(/\.[^/.]+$/, "");
                        const levelSuffix = baseName.split("-").at(-1);

                        map[key] = url;

                        if (slugFolderRaw && levelSuffix) {
                            map[`${slugFolderRaw}-${levelSuffix}`] = url;
                        }
                        if (slugFolder && levelSuffix) {
                            map[`${slugFolder}-${levelSuffix}`] = url;
                        }

                        if (slugFolderRaw) {
                            map[slugFolderRaw] = map[slugFolderRaw] || url;
                        }
                        if (slugFolder) {
                            map[slugFolder] = map[slugFolder] || url;
                        }
                    });

                    setIconsMap(map);
                    return;
                }

                const keys = Object.keys(CATEGORY_ICON_IMPORTS).filter((k) => {
                    const parts = k.split("/");
                    const catFolder = parts[parts.length - 2] || "";
                    return (
                        catFolder === category ||
                        catFolder.toLowerCase() === category.toLowerCase() ||
                        k.toLowerCase().includes(`/${category.toLowerCase()}/`)
                    );
                });

                if (keys.length === 0) {
                    if (mounted) setIconsMap({});
                    return;
                }

                const results = await Promise.all(
                    keys.map(async (k) => {
                        const mod = await CATEGORY_ICON_IMPORTS[k]();
                        const url = mod?.default ?? mod;
                        const filename = k.split("/").pop();
                        const nameNoExt = filename.replace(/\.[^/.]+$/, "");
                        return { key: k, filename, nameNoExt, url };
                    })
                );

                if (!mounted) return;

                const map = {};
                results.forEach((r) => {
                    map[r.filename] = r.url;
                    map[r.nameNoExt] = r.url;
                    map[r.key] = r.url;
                });

                setIconsMap(map);
            } catch (err) {
                if (mounted) setIconsMap({});
            } finally {
                if (mounted) setLoadingIcons(false);
            }
        }

        loadIcons();
        return () => {
            mounted = false;
        };
    }, [category, normalizedItems]);

    return (
        <div className="w-[90%] max-w-[1900px] mx-auto my-6 bg-[#0d1624]/60 rounded-2xl overflow-hidden">
            {hasItems ? (
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-400 bg-white/5">
                            <th className="p-3 w-48">Item</th>
                            {category === "Walls" && (
                                <th className="p-3 text-center">Quantity</th>
                            )}
                            <th className="p-3 text-center">Current / Max</th>
                            <th className="p-3 text-center">Next Level</th>
                            <th className="p-3 text-center">Next Cost</th>
                            <th className="p-3 text-center">Next Time</th>
                            <th className="p-3 text-center">Total Cost</th>
                            <th className="p-3 text-center">Total Time</th>
                            <th className="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {normalizedItems.map((item) => {
                            let image;
                            let nextImage;

                            if (category === "Walls") {
                                const wallKey = `wall-${item.__level}`;
                                const nextWallKey = `wall-${item.__level + 1}`;
                                image = iconsMap[wallKey];
                                nextImage = iconsMap[nextWallKey];
                            } else if (
                                BUILDING_TABS.has(category) &&
                                item.__slug
                            ) {
                                const levelKey = `${item.__slug}-${item.__level}`;
                                image =
                                    iconsMap[levelKey] || iconsMap[item.__slug];
                            } else {
                                const baseKey =
                                    item.name ||
                                    item.imageName ||
                                    `${item.id}.png`;
                                image = iconsMap[baseKey] ?? item.name;
                            }

                            return (
                                <UpgradeRow
                                    key={item._id || item.id}
                                    accountId={accountId}
                                    itemId={item._id || item.id}
                                    activeTab={category}
                                    image={image}
                                    nextImage={nextImage}
                                    {...item}
                                />
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <div />
            )}
        </div>
    );
}
