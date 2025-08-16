"use client";
import React from "react";

type CloneControlsProps = {
    loading: boolean;
    cloneAccounts: object[]; // adjust type if you have a specific type
    rememberDetails: boolean;
    setRememberDetails: (value: boolean) => void;
    handleSubmit: () => void;
};

export default function CloneControls({
    loading,
    cloneAccounts,
    rememberDetails,
    setRememberDetails,
    handleSubmit,
}: CloneControlsProps) {
    return (
        <div>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !cloneAccounts.length}
                className="w-full 
                            bg-green-500 hover:bg-green-600 
                            disabled:bg-gray-500 disabled:hover:bg-gray-500 
                            text-white py-2 rounded-lg
                            disabled:cursor-not-allowed"
            >
                {loading ? "Cloning..." : "Clone Addon"}
            </button>

            <label className="flex items-center space-x-2 text-gray-300 mt-2">
                <input
                    type="checkbox"
                    checked={rememberDetails}
                    onChange={(e) => setRememberDetails(e.target.checked)}
                />
                <span>Remember my details</span>
            </label>
        </div>
    );
}
