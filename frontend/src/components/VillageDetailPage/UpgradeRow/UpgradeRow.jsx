import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaXmark, FaCheck, FaGear } from "react-icons/fa6";
import StartUpgradeCard from "../StartUpgradeCard/StartUpgradeCard";
import upgradeService from "../../../services/upgradeService";

export default function UpgradeRow({
    accountId,
    activeTab,
    itemId,
    image,
    currentLevel,
    maxLevel,
    nextLevel,
    cost,
    time,
    totalCost,
    totalTime,
    status,
    progress,
}) {
    const [showUpgradeCard, setShowUpgradeCard] = useState(false);

    const handleUpgradeConfirm = (accountId, category, upgradeTime) => {
        upgradeService.start(accountId, category, itemId, { upgradeTime });
        setShowUpgradeCard(false);
    };

    const handleCancelUpgradeCard = () => setShowUpgradeCard(false);

    // Case 1: The item is fully upgraded for the current Town Hall level
    if (currentLevel === maxLevel) {
        return (
            <tr className="border-b border-gray-800">
                <td className="p-2 align-middle">
                    <img src={image} alt="" className="w-16 h-16" />
                </td>
                <td className="text-center align-middle">
                    {currentLevel}/{maxLevel}
                </td>
                <td colSpan="6" className="text-center font-semibold py-4">
                    Fully upgraded for this Town Hall Level
                </td>
            </tr>
        );
    }

    // Case 2: The item is currently being upgraded
    if (status === "Upgrading") {
        return (
            <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition ">
                <td className="p-2 align-middle">
                    <img src={image} alt="" className="w-16 h-16" />
                </td>
                <td className="text-center align-middle">
                    {currentLevel}/{maxLevel}
                </td>
                <td className="text-center align-middle">{nextLevel}</td>
                <td className="text-center align-middle">{cost}</td>
                <td className="text-center align-middle">{time}</td>
                <td className="text-center align-middle">{totalCost}</td>
                <td className="text-center align-middle">{totalTime}</td>
                <td className="p-2 align-middle">
                    <div className="flex flex-col items-center gap-1 w-40 mx-auto">
                        {/* Updated Progress Bar */}
                        <div className="relative w-full h-5 bg-gray-700 rounded-full">
                            {/* Filled portion */}
                            <div
                                className="h-full bg-[#a0e1fd] rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                            {/* Percentage text positioned inside */}
                            <span className="absolute inset-0 flex items-center pl-2 text-xs font-bold text-black z-10">
                                {progress}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                            Upgrade completes in: 4d 7h
                        </p>
                        <div className="flex gap-3 text-lg mt-1">
                            <button className="text-red-500 hover:text-red-400 transition-colors">
                                <FaXmark />
                            </button>
                            <button className="text-green-500 hover:text-green-400 transition-colors">
                                <FaCheck />
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <FaGear />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    // Case 3 (Default): The item is ready to be upgraded
    return (
        <>
            <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                <td className="p-2 align-middle">
                    <img src={image} alt="" className="w-16 h-16" />
                </td>
                <td className="text-center align-middle">
                    {currentLevel}/{maxLevel}
                </td>
                <td className="text-center align-middle">{nextLevel}</td>
                <td className="text-center align-middle">{cost}</td>
                <td className="text-center align-middle">{time}</td>
                <td className="text-center align-middle">{totalCost}</td>
                <td className="text-center align-middle">{totalTime}</td>
                <td className="text-center align-middle">
                    <button
                        type="button"
                        onClick={() => setShowUpgradeCard(true)}
                        className="rounded-full p-2 hover:bg-white/10 transition"
                    >
                        <FaArrowUp
                            className="mx-auto"
                            style={{
                                color: "#a0e1fd",
                                fontSize: "1.5rem",
                                stroke: "#0f172a",
                                strokeWidth: 2,
                            }}
                        />
                    </button>
                </td>
            </tr>

            {showUpgradeCard && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 z-40 "
                        onClick={handleCancelUpgradeCard}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <StartUpgradeCard
                            accountId={accountId}
                            activeTab={activeTab}
                            defaultDuration={{ days: 0, hours: 0, minutes: 0 }}
                            onUpgrade={handleUpgradeConfirm}
                            onCancel={handleCancelUpgradeCard}
                        />
                    </div>
                </>
            )}
        </>
    );
}
