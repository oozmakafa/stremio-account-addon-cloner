"use client";
import React, { useState } from "react";
import { Addon, AddonData } from "../types/addon";
import { Loader2, Cog } from "lucide-react";
import { fetchAddons, updateAddons } from "../services/api";
import { validateAccount } from "../utils/validation";
import { useAccounts } from "../hooks/useAccounts";
import AddonsDragAndDropNoCheck from "./PrimaryAddons";

export default function ConfigurePrimary() {
    const { primaryAccount, setAlert } = useAccounts();
    const [localAddons, setLocalAddons] = useState<Addon[]>([]);
    const [loadingAddon, setLoadingAddon] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showAddons, setShowAddons] = useState(false);

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            await updateAddons(
                primaryAccount,
                localAddons.map((addon) => addon.addon)
            );
            setShowAddons(false);
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to update addons: ${err.message}` });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancelConfig = () => {
        if (saving) return; // prevent cancel during save
        setLocalAddons([]);
        setShowAddons(false);
    };

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

            setLocalAddons(formatted);
            setShowAddons(true);
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to load addons: ${err.message}` });
            }
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
                <Cog className="w-5 h-5" />
                <span>
                    {loadingAddon ? "Loading Addons..." : "Configure (Optional)"}
                </span>
            </button>

            {showAddons && (
                <div className="mt-4 space-y-4">
                    <AddonsDragAndDropNoCheck
                        addons={localAddons}
                        onChange={(updatedAddons) => setLocalAddons(updatedAddons)}
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancelConfig}
                            disabled={saving}
                            className={`flex items-center justify-center gap-2 min-w-[120px] px-6 py-2 rounded-lg border border-gray-600 transition-colors
                                ${saving
                                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white"
                                }`}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveConfig}
                            disabled={saving}
                            className={`flex items-center justify-center gap-2 min-w-[120px] px-6 py-2 rounded-lg border border-blue-600 shadow transition-colors
                                ${saving
                                    ? "bg-blue-600 text-gray-300 cursor-not-allowed"
                                    : "bg-blue-600/80 hover:bg-blue-600 text-white"
                                }`}
                        >
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
