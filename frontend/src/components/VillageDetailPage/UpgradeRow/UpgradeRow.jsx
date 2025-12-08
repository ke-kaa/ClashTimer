import React, { useState, useEffect, useMemo } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaXmark, FaCheck, FaGear } from "react-icons/fa6";
import StartUpgradeCard from "../StartUpgradeCard/StartUpgradeCard";
import upgradeService from "../../../services/upgradeService";
import WallUpgradeCard from "../WallUpgradeCard/WallUpgradeCard";
import { startWallUpgrade } from "../../../services/wallService";
import ConfirmUpgradeCancel from "../ConfirmUpgradeCancel/ConfirmUpgradeCancel";
import FinishUpgradeConfirm from "../FinishUpgradeCard/FinishUpgradeConfirm";

export default function UpgradeRow({
    accountId,
    activeTab,
    itemId,
    image,
    nextImage,
    currentLevel,
    maxLevel,
    nextLevel,
    cost,
    time,
    totalCost,
    totalTime,
    status,
    progress,
    count,
    upgradeStartTime,
    upgradeEndTime,
}) {
    const [showUpgradeCard, setShowUpgradeCard] = useState(false);
    const [nowTs, setNowTs] = useState(Date.now());
    const [showUpgraceCancelCard, setShowUpgradeCancelCard] = useState(false);
    const [showFinishCard, setShowFinishCard] = useState(false);

    const isUpgrading = status === "Upgrading";

    useEffect(() => {
        if (!isUpgrading) return;
        const id = setInterval(() => setNowTs(Date.now()), 1000);
        return () => clearInterval(id);
    }, [isUpgrading]);

    const { progressPercent, remainingMs } = useMemo(() => {
        if (!upgradeStartTime || !upgradeEndTime) {
            return { progressPercent: 0, remainingMs: 0 };
        }
        const startMs = new Date(upgradeStartTime).getTime();
        const endMs = new Date(upgradeEndTime).getTime();
        if (
            !Number.isFinite(startMs) ||
            !Number.isFinite(endMs) ||
            endMs <= startMs
        ) {
            return { progressPercent: 0, remainingMs: 0 };
        }
        const elapsed = Math.min(nowTs - startMs, endMs - startMs);
        const percent = Math.round(
            Math.max(0, Math.min(1, elapsed / (endMs - startMs))) * 100
        );
        return {
            progressPercent: percent,
            remainingMs: Math.max(endMs - nowTs, 0),
        };
    }, [upgradeStartTime, upgradeEndTime, nowTs]);

    const computeProgress = () => {
        if (!upgradeStartTime || !upgradeEndTime) return 0;
        const startMs = new Date(upgradeStartTime).getTime();
        const endMs = new Date(upgradeEndTime).getTime();
        const nowMs = Date.now();
        if (
            !Number.isFinite(startMs) ||
            !Number.isFinite(endMs) ||
            endMs <= startMs
        ) {
            return 0;
        }
        const elapsed = Math.min(nowMs - startMs, endMs - startMs);
        return Math.round(
            Math.max(0, Math.min(1, elapsed / (endMs - startMs))) * 100
        );
    };

    const computeRemainingTime = () => {
        if (!upgradeStartTime || !upgradeEndTime) return 0;
        const startMs = new Date(upgradeStartTime).getTime();
        const endMs = new Date(upgradeEndTime).getTime();
        const nowMs = Date.now();
        if (
            !Number.isFinite(startMs) ||
            !Number.isFinite(endMs) ||
            endMs <= startMs
        ) {
            return 0;
        }
        const remainingMs = endMs - nowMs;

        return remainingMs;
    };

    const remainingTime = computeRemainingTime();

    function formatRemaining(ms) {
        if (ms <= 0) return "0h 0m";

        const totalMinutes = Math.floor(ms / 1000 / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);

        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;

        if (days > 0) {
            return ` ${String(days)}d ${String(hours)}h`;
        }

        return ` ${String(hours)}h ${String(minutes)}m`;
    }

    const dynamicProgress = computeProgress();

    const handleUpgradeConfirm = (accountId, category, upgradeTime) => {
        upgradeService.start(accountId, category, itemId, { upgradeTime });
        setShowUpgradeCard(false);
    };

    const handleUpgradeCancel = () => {
        upgradeService.cancel(accountId, activeTab, itemId);
        setShowUpgradeCancelCard(false);
    };

    const handleWallUpgradeConfirm = async ({ count }) => {
        try {
            await startWallUpgrade(accountId, {
                fromLevel: currentLevel,
                toLevel: nextLevel,
                count,
            });
            setShowUpgradeCard(false);
        } catch (error) {
            console.error("Failed to start wall upgrade:", error);
        }
    };

    const handleUpgradeFinish = () => {
        upgradeService.finish(accountId, activeTab, itemId);
        setShowFinishCard(false);
    };

    const handleCancelUpgradeCard = () => setShowUpgradeCard(false);
    const handleCancelConfirmCanceCard = () => setShowUpgradeCancelCard(false);

    // Case 1: The item is fully upgraded for the current Town Hall level
    if (currentLevel === maxLevel) {
        return (
            <tr className="border-b border-gray-800">
                <td className="p-2 align-middle">
                    <img src={image} alt="" className="w-16 h-16" />
                </td>
                {activeTab === "Walls" && (
                    <td className="text-center">{count}</td>
                )}
                <td className="text-center align-middle">
                    {currentLevel}/{maxLevel}
                </td>
                <td
                    colSpan="6"
                    className="text-center text-white/80 font-semibold py-4"
                >
                    Fully upgraded for this Town Hall Level
                </td>
            </tr>
        );
    }

    // Case 2: The item is currently being upgraded
    if (status === "Upgrading") {
        return (
            <>
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
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                                {/* Percentage text positioned inside */}
                                <span className="absolute inset-0 flex items-center pl-2 text-xs font-bold text-black z-10">
                                    {progressPercent}%
                                </span>
                            </div>
                            <p className="text-xs whitespace-nowrap">
                                Upgrade completes in:
                                {formatRemaining(remainingMs)}
                            </p>
                            <div className="flex gap-3 text-lg mt-1">
                                <button
                                    onClick={() =>
                                        setShowUpgradeCancelCard(true)
                                    }
                                    className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                    <FaXmark />
                                </button>
                                <button
                                    onClick={() => setShowFinishCard(true)}
                                    className="text-green-500 hover:text-green-400 transition-colors"
                                >
                                    <FaCheck />
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <FaGear />
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
                {showUpgraceCancelCard && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/60 z-40 "
                            onClick={handleCancelConfirmCanceCard}
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <ConfirmUpgradeCancel
                                onCancel={handleUpgradeCancel}
                                onClose={() => setShowUpgradeCancelCard(false)}
                            />
                        </div>
                    </>
                )}
                {showFinishCard && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/60 z-40 "
                            onClick={() => setShowFinishCard(false)}
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <FinishUpgradeConfirm
                                onFinish={handleUpgradeFinish}
                                onClose={() => setShowFinishCard(false)}
                            />
                        </div>
                    </>
                )}
            </>
        );
    }

    // Case 3 (Default): The item is ready to be upgraded
    return (
        <>
            <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                <td className="p-2 align-middle">
                    <img src={image} alt="" className="w-16 h-16" />
                </td>
                {activeTab === "Walls" && (
                    <td className="text-center align-middle">{count}</td>
                )}
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
                        {activeTab === "Walls" ? (
                            <WallUpgradeCard
                                accountId={accountId}
                                fromLevel={currentLevel}
                                toLevel={nextLevel}
                                count={count}
                                fromImage={image}
                                toImage={nextImage}
                                onUpgrade={handleWallUpgradeConfirm}
                                onCancel={handleCancelUpgradeCard}
                            />
                        ) : (
                            <StartUpgradeCard
                                accountId={accountId}
                                activeTab={activeTab}
                                defaultDuration={{
                                    days: 0,
                                    hours: 0,
                                    minutes: 0,
                                }}
                                onUpgrade={handleUpgradeConfirm}
                                onCancel={handleCancelUpgradeCard}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}
