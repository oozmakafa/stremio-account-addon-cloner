"use client";
import React from "react"; // adjust path if needed
import AddonsDragAndDrop from "./Addons";
import { Addon } from "../types/addon";


type AddonSelectorProps = {
    loadingAddon: boolean;
    showAddons: boolean;
    addons: Addon[];
    setAddons: (addons: Addon[]) => void;
    handleSelectAddonsClick: () => void;
};

export default function AddonSelector({
    loadingAddon,
    showAddons,
    addons,
    setAddons,
    handleSelectAddonsClick,
}: AddonSelectorProps) {
    return (
        <div>
            <button
                type="button"
                onClick={handleSelectAddonsClick}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
                {loadingAddon ? "Loading Addons..." : "Select Addons to Clone (Optional)"}
            </button>

            {showAddons && (
                <AddonsDragAndDrop
                    addons={addons}
                    onChange={(updatedAddons) => setAddons(updatedAddons)}
                />
            )}
        </div>
    );
}
