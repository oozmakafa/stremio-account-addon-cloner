"use client";
import React from "react";
import { Copy } from "lucide-react";

type CloneControlsProps = {
    loading: boolean;
    cloneAccounts: object[]; // replace with your Account[] if available
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
                className="w-full flex items-center justify-center gap-2 
                           rounded-lg py-3 
                           bg-green-600 hover:bg-green-700 
                           disabled:bg-gray-600 disabled:hover:bg-gray-600 
                           text-white font-medium
                           transition-colors disabled:cursor-not-allowed"
            >
                <Copy className="w-5 h-5" />
                {loading ? "Cloning..." : "Clone Addons"}
            </button>

            <label className="flex items-center gap-2 text-gray-300 mt-4 cursor-pointer select-none">
                {/* custom checkbox */}
                <input
                    type="checkbox"
                    checked={rememberDetails}
                    onChange={(e) => setRememberDetails(e.target.checked)}
                    className="h-5 w-5 border-2 border-gray-400 rounded-sm 
                               bg-gray-700 checked:bg-blue-500 checked:border-blue-500 
                               focus:outline-none focus:ring-2 focus:ring-blue-400 
                               cursor-pointer transition-all"
                />
                <span>Remember my details</span>
            </label>
        </div>
    );
}
