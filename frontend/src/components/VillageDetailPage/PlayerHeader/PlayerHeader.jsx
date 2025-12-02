import React from "react";
import ProgressBarGroup from "../ProgressBarGroup/ProgressBarGroup";

export default function PlayerHeader({
    accountName,
    playerTag,
    townHallIcon,
    townHallLevel,
    progress,
}) {
    const hasProgress = progress && typeof progress === "object";

    return (
        <div className="flex justify-between items-center my-10 px-40 max-w-[1900px] mx-auto">
            <div>
                <p className="text-[24px] font-semibold">{accountName}</p>
                <p className="text-lg text-gray-400">{playerTag}</p>
            </div>

            <div className="flex flex-col items-center">
                <img
                    src={townHallIcon}
                    alt="Town hall icon"
                    className="w-[224px] h-[224px"
                />
                <h2 className="text-2xl font-semibold mt-2">
                    Townhall {townHallLevel}
                </h2>
            </div>

            {hasProgress && <ProgressBarGroup progress={progress} />}
        </div>
    );
}
