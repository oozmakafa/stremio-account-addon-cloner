"use client";

import React from "react";
import { Addon } from "../types/addon";

interface ConfirmDeleteModalProps {
    addon: Addon | null;
    onCancel: () => void;
    onConfirm: (addon: Addon) => void;
}

export default function ConfirmDeleteModal({
    addon,
    onCancel,
    onConfirm,
}: ConfirmDeleteModalProps) {
    if (!addon) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-gray-200">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-6 text-sm">
                    Are you sure you want to delete this addon?
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(addon)}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
