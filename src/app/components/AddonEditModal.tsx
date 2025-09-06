"use client";

import React, { useState } from "react";
import { Addon } from "../types/addon";

interface AddonEditModalProps {
    addonToEdit: Addon | null;
    addons: Addon[];
    onChange: (updated: Addon[]) => void;
    onClose: () => void;
}

export default function AddonEditModal({
    addonToEdit,
    addons,
    onChange,
    onClose,
}: AddonEditModalProps) {
    const [loading, setLoading] = useState(false);

    if (!addonToEdit) return null;

    const isDisabled =
        addonToEdit.name.startsWith("[DISABLED]") ||
        addonToEdit.addon.manifest?.name?.startsWith("[DISABLED]");

    // Disable: clear manifest fields + prefix name
    const handleDisable = () => {
        const updated = addons.map((a) =>
            a.uuid === addonToEdit.uuid
                ? {
                    ...a,
                    name: a.name.startsWith("[DISABLED]") ? a.name : `[DISABLED] ${a.name}`,
                    addon: {
                        ...a.addon,
                        manifest: {
                            ...a.addon.manifest,
                            name: a.addon.manifest.name.startsWith("[DISABLED]")
                                ? a.addon.manifest.name
                                : `[DISABLED] ${a.addon.manifest.name}`,
                            types: [],
                            catalogs: [],
                            resources: [],
                        },
                    },
                }
                : a
        );
        onChange(updated);
        onClose();
    };

    // Enable: fetch fresh manifest from the same transportUrl
    const handleEnable = async () => {
        const transportUrl = addonToEdit.addon.transportUrl;
        setLoading(true);

        try {
            const response = await fetch(transportUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch manifest");
            }
            const freshManifest = await response.json();

            const updated = addons.map((a) =>
                a.uuid === addonToEdit.uuid
                    ? {
                        ...a,
                        name: freshManifest.name || a.name.replace(/^\[DISABLED\]\s*/, ""),
                        addon: {
                            ...a.addon,
                            manifest: freshManifest,
                        },
                    }
                    : a
            );

            onChange(updated);
        } catch (err) {
            console.error("Error enabling addon:", err);
            // optional: toast/alert
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-96 text-gray-200 border border-gray-700">
                <h2 className="text-xl font-semibold mb-2 text-white">
                    {addonToEdit.name}
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                    Toggle this addon’s status:
                </p>

                <div className="flex gap-3">
                    {!isDisabled && (
                        <button
                            onClick={handleDisable}
                            disabled={loading || addonToEdit.is_protected}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-yellow-400 border border-gray-600 transition-colors disabled:opacity-50"
                        >
                            Disable
                        </button>
                    )}

                    {isDisabled && (
                        <button
                            onClick={handleEnable}
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-green-400 border border-gray-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Enabling..." : "Enable"}
                        </button>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 transition-colors disabled:opacity-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
