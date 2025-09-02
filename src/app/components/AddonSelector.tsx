"use client";
import React, { useState } from "react";
import AddonsDragAndDrop from "./Addons";
import { AddonData } from "../types/addon";
import { Puzzle } from "lucide-react";
import { fetchAddons } from "../services/api";
import { validateAccount } from "../utils/validation";
import { useAccounts } from "../hooks/useAccounts";

export default function AddonSelector() {
    const { primaryAccount, setAlert, setAddons, addons } = useAccounts();
    const [loadingAddon, setLoadingAddon] = useState(false);
    const [showAddons, setShowAddons] = useState(false);

    const handleSelectAddonsClick = async () => {
        setLoadingAddon(true);
        setAlert(null);
        try {
            const { valid, error } = validateAccount(primaryAccount, "Primary");
            if (!valid) {
                setAlert({ type: "error", message: error! });
                return;
            }

            const addonsResult = await fetchAddons(primaryAccount);
            const formatted = addonsResult.map((addon: AddonData) => ({
                addon,
                id: addon.transportUrl,
                name: addon.manifest.name,
                is_protected: addon.flags.protected,
                is_configurable: addon.manifest?.behaviorHints?.configurable ?? false,
                checked: true,
            }));

            setAddons(formatted);
            setShowAddons(true);
        } catch (err) {
            if (err instanceof Error)
                setAlert({ type: "error", message: `Failed to load addons: ${err.message}` });
        } finally {
            setLoadingAddon(false);
        }
    };

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
