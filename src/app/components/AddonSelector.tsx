"use client";
import React from "react"; // adjust path if needed
import AddonsDragAndDrop from "./Addons";
import { Addon } from "../types/addon";
import { Puzzle } from "lucide-react";


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
                className="mt-4 flex items-center justify-center w-full gap-2 rounded-lg border border-dashed border-gray-600 bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white py-3 transition-colors"
            >
                <Puzzle className="w-5 h-5" />
                <span>
                    {loadingAddon ? "Loading Addons..." : "Select Addons to Clone (Optional)"}
                </span>
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
