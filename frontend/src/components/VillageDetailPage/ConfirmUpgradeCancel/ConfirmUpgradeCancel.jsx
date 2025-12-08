import React from "react";
import { CgDanger } from "react-icons/cg";

export default function ConfirmUpgradeCancel({ onCancel, onClose }) {
    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <div className="w-[470px] rounded-2xl border border-white/40 bg-[#0c1420] px-8 py-8 shadow-lg shadow-black/40 text-white">
            <CgDanger color={"red"} size={50} className="mb-4 mx-auto" />
            <p className="text-[18px] font-bold text-center mb-4">
                Cancel Upgrade
            </p>
            <p className="text-center mb-8">
                Are you sure you want to cancel the ugprade?
            </p>

            <div className="flex my-auto justify-center items-end gap-3">
                <button
                    onClick={onClose}
                    className="rounded-full w-[81px] bg-[#a0e1fd]/60 items-center py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#97d2f4] transition-colors"
                >
                    No
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-full w-[81px] items-center bg-[#b91c1c] py-2 text-sm font-semibold text-white hover:bg-[#dc2626] transition-colors"
                >
                    Yes
                </button>
            </div>
        </div>
    );
}
