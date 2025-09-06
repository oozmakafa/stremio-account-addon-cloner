"use client";
import React, { useState } from "react";
import { Addon, AddonData } from "../types/addon";
import { Loader2, Cog, Plus, X } from "lucide-react";
import { fetchAddons, updateAddons } from "../services/api";
import { validateAccount } from "../utils/validation";
import { useAccounts } from "../hooks/useAccounts";
import AddonsDragAndDropNoCheck from "./PrimaryAddons";
import { v4 as uuidv4 } from "uuid";


export default function ConfigurePrimary() {
    const { primaryAccount, setAlert } = useAccounts();
    const [localAddons, setLocalAddons] = useState<Addon[]>([]);
    const [loadingAddon, setLoadingAddon] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showAddons, setShowAddons] = useState(false);

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [manifestUrl, setManifestUrl] = useState("");
    const [adding, setAdding] = useState(false);

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

    const handleAddAddon = () => {
        setManifestUrl("");
        setShowModal(true);
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
                uuid: uuidv4(),
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

    const handleConfirmAddAddon = async () => {
        if (!manifestUrl.trim()) return;

        setAdding(true);
        try {
            const res = await fetch(manifestUrl);
            if (!res.ok) throw new Error("Failed to fetch manifest");
            const manifest = await res.json();

            const newAddon: Addon = {
                addon: {
                    transportUrl: manifestUrl,
                    manifest,
                    flags: { protected: false },
                } as unknown as AddonData,
                id: manifestUrl,
                name: manifest.name || "Unknown Addon",
                is_protected: false,
                is_configurable: manifest?.behaviorHints?.configurable ?? false,
                checked: true,
                uuid: uuidv4(),
            };

            setLocalAddons((prev) => [...prev, newAddon]);
            setShowModal(false);
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to add addon: ${err.message}` });
            }
        } finally {
            setAdding(false);
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

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full">
                        {/* Add Addon button (left) */}
                        <button
                            type="button"
                            onClick={handleAddAddon}
                            className="flex items-center justify-center gap-2 min-w-[120px] px-6 py-2 rounded-lg border border-green-600 shadow transition-colors
      bg-green-600/80 hover:bg-green-600 text-white w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Add Addon
                        </button>

                        {/* Cancel & Save buttons (right) */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleCancelConfig}
                                disabled={saving}
                                className={`flex items-center justify-center gap-2 min-w-[120px] px-6 py-2 rounded-lg border border-gray-600 transition-colors
                                    ${saving
                                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white"
                                    } w-full sm:w-auto`}
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
                                    } w-full sm:w-auto`}
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* Modal for adding addon */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">Add Addon</h2>
                            <button onClick={() => setShowModal(false)}>
                                <X className="w-5 h-5 text-gray-400 hover:text-white" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={manifestUrl}
                            onChange={(e) => setManifestUrl(e.target.value)}
                            placeholder="Enter manifest URL"
                            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAddAddon}
                                disabled={adding}
                                className="px-4 py-2 rounded-lg border border-green-600 bg-green-600/80 hover:bg-green-600 text-white flex items-center gap-2"
                            >
                                {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
