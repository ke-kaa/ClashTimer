import React, { useEffect, useState } from 'react'
import UpgradeRow from '../UpgradeRow/UpgradeRow';
const ICON_IMPORTS = import.meta.glob('../../../assets/VillageDetail/**/*.png');

const ICONS_BY_CATEGORY = Object.entries(ICON_IMPORTS).reduce((acc, [path, src]) => {
  const parts = path.split('/');
  const category = parts[parts.length - 2];
  const name = parts[parts.length - 1].replace('.png', '');

  acc[category] = acc[category] || [];
  acc[category].push({ name, src });

  return acc;
}, {});

export default function UpgradeTable({ category, items = [] }) {
    const hasItems = items.length > 0;
    const [iconsMap, setIconsMap] = useState({});
    const [loadingIcons, setLoadingIcons] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function loadIconsForCategory() {
            if (!category) {
                setIconsMap({});
                return;
            }
            
            setLoadingIcons(true);

           try {
                const keys = Object.keys(ICON_IMPORTS).filter((k) => {
                const parts = k.split('/');
                const catFolder = parts[parts.length - 2] || '';
                return (
                    catFolder === category ||
                    catFolder.toLowerCase() === category.toLowerCase() ||
                    k.toLowerCase().includes(`/${category.toLowerCase()}/`)
                );
                });

                if (keys.length === 0) {
                // no icons for this category
                if (mounted) setIconsMap({});
                return;
                }

                const results = await Promise.all(
                keys.map(async (k) => {
                    const mod = await ICON_IMPORTS[k]();
                    const url = mod?.default ?? mod;
                    const filename = k.split('/').pop(); // "cannon.png"
                    const nameNoExt = filename.replace(/\.[^/.]+$/, ''); // "cannon"
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

        loadIconsForCategory();
        return () => { mounted = false; };
    }, [category])

    return (
        <div className="w-[90%] max-w-[1900px] mx-auto mt-6 bg-[#0d1624]/60 rounded-2xl border border-white/5 overflow-hidden">
                    {hasItems ? (
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-400 bg-white/5">
                            <th className="p-3 w-48">Item</th>
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
                        {items.map((item) => {

                            const iconFile = item.name || item.imageName || `${item.id}.png`;
                            const image = iconsMap[iconFile] ?? item.name;
                            return <UpgradeRow key={item._id || item.id} image={image} {...item} />
                        })}
                    </tbody>
                </table>
            ) : (
                <div className="px-6 py-10 text-center text-gray-400 text-sm">
                    No upgrades found for {category}.
                </div>
            )}
        </div>
    );
}

