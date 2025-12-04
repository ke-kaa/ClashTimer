import React, { useState } from "react";
import { startWallUpgrade } from "../../../services/wallService";

export default function WallUpgradeCard({
    accountId,
    fromLevel,
    toLevel,
    count,
    fromImage,
    toImage,
    onUpgrade,
    onCancel,
}) {
    const [wallCount, setWallCount] = useState("");

    const handleChange = (event) => {
        const raw = event.target.value;
        if (raw === "" || /^[0-9]*$/.test(raw)) {
            const clamped =
                raw === "" ? "" : Math.min(Number(raw), count).toString();
            setWallCount(clamped);
        }
    };

    const amount = Number(wallCount);
    const isValid = amount > 0 && amount <= count;
    const helper =
        wallCount === ""
            ? `Max pieces: ${count}`
            : !isValid
            ? `Enter 1–${count}`
            : "";

    return (
        <div className="w-[500px] rounded-2xl border-white/40 bg-[#0c1420] px-8 py-8 shadow-lg shadow-black/50 text-white">
            <div>
                <p className="text-center text-[19px] ">
                    Upgrade multiple wall pieces{" "}
                </p>
                <div className="flex justify-center my-4 gap-12">
                    <img
                        className="w-[45px] h-[45px]"
                        src={fromImage}
                        alt={fromLevel}
                    />
                    <img
                        className="w-[45px] h-[45px]"
                        src={toImage}
                        alt={toLevel}
                    />
                </div>
                <p className="text-center">
                    Enter the number of walls you want to upgrade from
                    {fromLevel} to {toLevel}
                </p>
                <div className="flex justify-center my-4">
                    <input
                        type="number"
                        min="1"
                        max={count}
                        value={wallCount}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-[74px] h-[30px] bg-white text-black rounded rounded-[10px] px-3 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#a0e1fd]"
                    />
                </div>
                <p className="text-s text-gray-400 my-2">{helper}</p>
                <div className="flex my-auto justify-center gap-6">
                    <button
                        onClick={onCancel}
                        className="rounded-full w-[81px] bg-[#b91c1c] items-center py-2 text-sm font-semibold text-white hover:bg-[#dc2626] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!isValid}
                        onClick={() =>
                            isValid && onUpgrade?.({ count: amount })
                        }
                        className={`rounded-full w-[81px] py-2 text-sm font-semibold transition-colors ${
                            isValid
                                ? "bg-[#a0e1fd] text-[#0f172a] hover:bg-[#97d2f4]"
                                : "bg-[#64748b] text-white/60 cursor-not-allowed"
                        }`}
                    >
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
}
