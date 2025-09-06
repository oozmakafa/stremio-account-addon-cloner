"use client";

import { useRef } from "react";
import { Upload, Download } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";

export default function ImportExportControls() {
    const { primaryAccount, cloneAccounts, setPrimaryAccount, setCloneAccounts, setAlert } = useAccounts();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Export accounts as JSON
    const handleExport = () => {

        const dataStr = JSON.stringify({ primary: primaryAccount, clones: cloneAccounts }, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "stremio-account-addon-cloner-export.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import accounts from JSON
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (data.primary && data.clones) {
                    setPrimaryAccount(data.primary);
                    setCloneAccounts(data.clones);
                    setAlert({ type: "success", message: "Account details imported successfully!" });
                } else {
                    setAlert({ type: "error", message: "Invalid file format." });
                }
            } catch {
                setAlert({ type: "error", message: "Failed to import JSON file." });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex justify-end items-center gap-4">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
                <Upload size={18} /> Import
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleImport}
            />

            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            >
                <Download size={18} /> Export
            </button>
        </div>
    );
}
