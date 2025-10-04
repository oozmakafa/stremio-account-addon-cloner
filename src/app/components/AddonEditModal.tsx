"use client";

import React, { useState, useRef, useEffect } from "react";
import { Addon } from "../types/addon";
import { Pencil } from "lucide-react";

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
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(addonToEdit?.name || "");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (addonToEdit) {
            setDisplayName(addonToEdit.name);
        }
    }, [addonToEdit]);

    if (!addonToEdit) return null;

    const isDisabled =
        addonToEdit.name.startsWith("[DISABLED]") ||
        addonToEdit.addon.manifest?.name?.startsWith("[DISABLED]");

    const handleRename = (newName: string) => {
        const updated = addons.map((a) =>
            a.uuid === addonToEdit.uuid
                ? {
                    ...a,
                    name: newName,
                    addon: {
                        ...a.addon,
                        manifest: {
                            ...a.addon.manifest,
                            name: newName,
                        },
                    },
                }
                : a
        );
        onChange(updated);
        setDisplayName(newName); // update locally so modal text refreshes immediately
        setIsEditing(false);
    };

    // Disable
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

    // Enable
    // Enable
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
                        // Keep the original name, just strip [DISABLED]
                        name: a.name.replace(/^\[DISABLED\]\s*/, ""),
                        addon: {
                            ...a.addon,
                            manifest: {
                                ...freshManifest,
                                // Also keep manifest name consistent with original
                                name: a.addon.manifest.name.replace(/^\[DISABLED\]\s*/, ""),
                            },
                        },
                    }
                    : a
            );

            onChange(updated);
            setDisplayName(addonToEdit.name.replace(/^\[DISABLED\]\s*/, "")); // update modal immediately
        } catch (err) {
            console.error("Error enabling addon:", err);
        } finally {
            setLoading(false);
            onClose();
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-96 text-gray-200 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    {isEditing ? (
                        <div className="flex items-center w-full">
                            <input
                                ref={inputRef}
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRename(displayName);
                                    if (e.key === "Escape") setIsEditing(false);
                                }}
                                autoFocus
                                className="bg-gray-800 text-white px-2 py-1 rounded-md flex-1 h-9"
                            />
                            <button
                                onClick={() => handleRename(displayName)}
                                className="ml-2 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm h-9"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-white">{displayName}</h2>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setTimeout(() => inputRef.current?.focus(), 0);
                                }}
                                className="ml-2 p-1 rounded-md hover:bg-gray-800 text-gray-300"
                                aria-label="Edit name"
                            >
                                <Pencil size={16} />
                            </button>
                        </>
                    )}
                </div>


                <p className="text-sm text-gray-400 mb-6">
                    Toggle this addon’s status:
                </p>

                {addonToEdit.name.toLowerCase() === "cinemeta" && (
                    <p className="mb-4 text-xs text-red-400">
                        ⚠️ Disabling <b>cinemeta</b> may break your Stremio account.
                    </p>
                )}

                <div className="flex gap-3">
                    {!isDisabled && (
                        <button
                            onClick={handleDisable}
                            disabled={loading}
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
