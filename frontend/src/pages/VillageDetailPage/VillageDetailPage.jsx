import React, { useCallback, useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import PlayerHeader from "../../components/VillageDetailPage/PlayerHeader/PlayerHeader";
import CategoryTabs from "../../components/VillageDetailPage/CategoryTabs/CategoryTabs";
import UpgradeTable from "../../components/VillageDetailPage/UpgradeTable/UpgradeTable";
import { useParams } from "react-router-dom";
import {
    getVillageForDetailPage,
    sendVillagePasteData,
} from "../../services/accountServices";
import paste from "../../assets/ProfilePages/AddNewVillagePage/paste.png";

const TOWN_HALL_ICONS = import.meta.glob("../../assets/TownHallIcons/TH*.png", {
    eager: true,
    import: "default",
});

export default function VillageDetailPage() {
    const { playerTag } = useParams();
    const [villageDetail, setVillageDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Defenses");
    const [showPasteModal, setShowPasteModal] = useState(false);
    const [pasteJson, setPasteJson] = useState("");
    const [needsBuildingData, setNeedsBuildingData] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [accountId, setAccountId] = useState(null);

    const resolveTownHallIcon = (level) => {
        const normalized = Number(level) || 0;
        const key = `../../assets/TownHallIcons/TH${normalized}.png`;
        return TOWN_HALL_ICONS[key];
    };

    const fetchVillageDetail = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getVillageForDetailPage(playerTag);
            setVillageDetail(response);
            setAccountId(response._id);
            const hasBuildings =
                Array.isArray(response?.buildings) &&
                response.buildings.length > 0;
            setNeedsBuildingData(!hasBuildings);
            setShowPasteModal(false);
            setPasteJson("");
            setError(null);
        } catch (err) {
            setError(err?.message || "Failed to load village detail.");
        } finally {
            setLoading(false);
        }
    }, [playerTag]);

    useEffect(() => {
        fetchVillageDetail();
    }, [fetchVillageDetail]);

    useEffect(() => {
        if (!statusMessage) return;
        const timer = setTimeout(() => setStatusMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [statusMessage]);

    const notify = (message, variant = "info") =>
        setStatusMessage({ message, variant });

    const openPasteModalWithClipboard = async () => {
        try {
            if (!navigator?.clipboard?.readText) {
                notify(
                    "Clipboard access is not supported in this browser/context.",
                    "error"
                );
                return;
            }

            const clipboardText = (
                await navigator.clipboard.readText()
            )?.trim();
            if (!clipboardText) {
                notify(
                    "Clipboard is empty. Copy the export data first, then try again.",
                    "error"
                );
                return;
            }

            try {
                JSON.parse(clipboardText); // assert valid JSON before opening modal
            } catch {
                notify(
                    "Clipboard content is not valid JSON. Copy the in-game export and try again.",
                    "error"
                );
                return;
            }

            setPasteJson(clipboardText);
            setShowPasteModal(true);
            notify(
                "Clipboard data captured. Confirm import to continue.",
                "info"
            );
        } catch (err) {
            console.error("Clipboard read failed", err);
            notify(
                "Could not read from clipboard. Please allow clipboard permissions and try again.",
                "error"
            );
        }
    };

    const closePasteModal = () => {
        setShowPasteModal(false);
        setPasteJson("");
    };

    const submitPaste = async () => {
        try {
            const parsed = JSON.parse(pasteJson);
            await sendVillagePasteData(parsed);
            await fetchVillageDetail();
            notify("Village data submitted successfully.", "success");
            closePasteModal();
        } catch (err) {
            console.error("Failed to submit pasted village data", err);
            notify(
                "Invalid JSON or failed to submit. Please copy the export again and try.",
                "error"
            );
        }
    };

    const name = villageDetail.username;
    const tag = villageDetail.playerTag;
    const tHLevel = villageDetail.townHallLevel;
    const progress = villageDetail.progress;
    const townhallImage = resolveTownHallIcon(tHLevel);

    const categoryMap = {
        Defenses: villageDetail.buildings?.filter(
            (b) => b.buildingType === "Defense"
        ),
        Traps: villageDetail.buildings?.filter(
            (b) => b.buildingType === "Trap"
        ),
        Resource: villageDetail.buildings?.filter((b) =>
            ["Resource", "Storage"].includes(b.buildingType)
        ),
        Army: villageDetail.buildings?.filter((b) => b.buildingType === "Army"),
        Troops: villageDetail.troops?.filter(
            (t) => t.troopType !== "Dark Elixir"
        ),
        "Dark Troops": villageDetail.troops?.filter(
            (t) => t.troopType === "Dark Elixir"
        ),
        Spells: villageDetail.spells,
        Sieges: villageDetail.siege,
        Heroes: villageDetail.heroes,
        Equipment: villageDetail.equipments,
        Pets: villageDetail.pets,
        Walls: villageDetail.walls ? [villageDetail.walls] : [],
    };
    const itemsForActiveTab = categoryMap[activeTab] ?? [];

    const buildingTabs = new Set([
        "Defenses",
        "Traps",
        "Resource",
        "Army",
        "Walls",
    ]);

    return (
        <div className="min-h-screen bg-[#0c1220]">
            <NavBar />
            <div>
                <div className="pb-4">
                    <PlayerHeader
                        accountName={name}
                        playerTag={tag}
                        townHallIcon={townhallImage}
                        townHallLevel={tHLevel}
                        progress={progress}
                    />
                    <CategoryTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />

                    {buildingTabs.has(activeTab) && needsBuildingData && (
                        <div className="w-[90%] max-w-[1900px] mx-auto mt-8 text-sm text-gray-400">
                            The API response did not include building data.
                            Paste your in-game export to populate it.
                        </div>
                    )}

                    <UpgradeTable
                        accountId={accountId}
                        category={activeTab}
                        items={itemsForActiveTab}
                    />

                    {statusMessage && (
                        <div
                            className={`w-[90%] max-w-[1900px] mx-auto mb-3 px-4 py-2 text-sm rounded-md ${
                                statusMessage.variant === "error"
                                    ? "bg-red-500/10 text-red-300 border border-red-500/40"
                                    : statusMessage.variant === "success"
                                    ? "bg-green-500/10 text-green-300 border border-green-500/40"
                                    : "bg-blue-500/10 text-blue-200 border border-blue-500/40"
                            }`}
                        >
                            {statusMessage.message}
                        </div>
                    )}

                    {buildingTabs.has(activeTab) && needsBuildingData && (
                        <div className="w-[90%] max-w-[1900px] mx-auto flex justify-start">
                            <button
                                onClick={openPasteModalWithClipboard}
                                className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#a0e1fd]/75 mb-6 text-black font-medium text-[16px] hover:bg-[#a0e1fd]"
                            >
                                <img
                                    src={paste}
                                    alt="Paste icon"
                                    className="w-[24px] h-[24px]"
                                />
                                <span>Paste Village Data</span>
                            </button>
                        </div>
                    )}

                    {showPasteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                            <div className="w-[90%] max-w-2xl bg-[#0b1620] rounded-lg p-6">
                                <h3 className="text-white text-lg mb-2">
                                    Confirm village data import
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Update account with export data?
                                </p>
                                <div className="mt-4 flex justify-end gap-3">
                                    <button
                                        onClick={closePasteModal}
                                        className="px-4 py-2 rounded border border-gray-600 text-gray-200"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        onClick={submitPaste}
                                        className="px-4 py-2 bg-[#16a34a] text-white rounded"
                                    >
                                        Import
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
