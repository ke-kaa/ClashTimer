import React from "react";
import { CgDanger } from "react-icons/cg";

export default function FinishUpgradeConfirm({ onFinish, onClose }) {
    const handleFinish = () => {
        onFinish?.();
    };

    return (
        <div className="w-[470px] rounded-2xl border border-white/40 bg-[#0c1420] px-8 py-8 shadow-lg shadow-black/40 text-white">
            <p className="text-[18px] font-bold text-center mb-4">
                Finish Upgrade
            </p>
            <p className="text-center mb-8">
                Are you sure you want to finish this ugprade?
            </p>

            <div className="flex my-auto justify-center items-end gap-3">
                <button
                    onClick={onClose}
                    className="rounded-full w-[81px] bg-[#B2A9A9]/80 items-center py-2 text-sm font-semibold text-black hover:bg-[#b2a9a9] transition-colors"
                >
                    No
                </button>
                <button
                    type="button"
                    onClick={handleFinish}
                    className="rounded-full w-[81px] items-center bg-[#a0e1fd]/60 py-2 text-sm font-semibold text-white hover:bg-[#a0e1fd]/80 transition-colors"
                >
                    Yes
                </button>
            </div>
        </div>
    );
}
