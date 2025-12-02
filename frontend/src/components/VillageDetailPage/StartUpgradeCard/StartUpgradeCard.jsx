import React, { useState } from "react";

export default function StartUpgradeCard({
    defaultDuration = { days: 0, hours: 0, minutes: 0 },
    onUpgrade,
    onCancel,
}) {
    const [duration, setDuration] = useState({
        days: "",
        hours: "",
        minutes: "",
    });

    const limits = { days: 20, hours: 24, minutes: 59 };

    const handleChange = (field) => (event) => {
        const raw = event.target.value;
        if (raw === "" || /^[0-9]*$/.test(raw)) {
            const max = limits[field];
            const clamped =
                raw === "" ? "" : Math.min(Number(raw), max).toString();
            setDuration((prev) => ({ ...prev, [field]: clamped }));
        }
    };

    const handleUpgrade = () => {
        onUpgrade?.({
            days: Number(duration.days || defaultDuration.days) || 0,
            hours: Number(duration.hours || defaultDuration.hours) || 0,
            minutes: Number(duration.minutes || defaultDuration.minutes) || 0,
        });
    };

    return (
        <div className="w-[470px] rounded-2xl border border-white/40 bg-[#0c1420] px-8 py-8 shadow-lg shadow-black/40 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="space-y-3 flex-1">
                    {[
                        { label: "Days", field: "days", max: 20 },
                        { label: "Hours", field: "hours", max: 24 },
                        { label: "Minutes", field: "minutes", max: 59 },
                    ].map(({ label, field, max }) => (
                        <div key={field} className="flex items-center gap-4">
                            <span className="text-sm text-gray-300">
                                {label}:
                            </span>
                            <input
                                type="number"
                                min="0"
                                max={max}
                                value={duration[field]}
                                onChange={handleChange(field)}
                                placeholder={String(
                                    defaultDuration[field] ?? 0
                                )}
                                className="w-28 rounded-full bg-white text-gray-900 px-3 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#a0e1fd]"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col my-auto justify-between items-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-full w-[81px] bg-[#b91c1c] items-center py-2 text-sm font-semibold text-white hover:bg-[#dc2626] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpgrade}
                        className="rounded-full w-[81px] items-center bg-[#a0e1fd] py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#97d2f4] transition-colors"
                    >
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
}
