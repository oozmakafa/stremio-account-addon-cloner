import { useState } from "react";
import { Account } from "../types/accounts";
import { Eye, EyeOff } from "lucide-react";

const DEBRID_OPTIONS = [
    { value: "", label: "Override Debrid", url: "" },
    { value: "torbox", label: "Torbox", url: "https://torbox.app/settings" },
    { value: "realdebrid", label: "RealDebrid", url: "https://real-debrid.com/apitoken" },
    { value: "offcloud", label: "OffCloud", url: "https://offcloud.com/#/account" },
];

type CloneAccountFormProps = {
    index: number;
    account: Account;
    onChange: (index: number, field: keyof Account, value: string) => void;
    onRemove: (index: number) => void;
};

export default function CloneAccountForm({
    index,
    account,
    onChange,
    onRemove,
}: CloneAccountFormProps) {
    const [showDebrid, setShowDebrid] = useState(false);

    return (
        <div className="mb-4 border border-gray-600 p-4 rounded-lg bg-gray-700">
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Account #{index + 1}</span>
                <div className="flex space-x-2">
                    {/* Override Debrid button */}
                    <button
                        type="button"
                        onClick={() => setShowDebrid((prev) => !prev)}
                        className="flex items-center justify-between bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 w-44"
                    >
                        <span className="leading-none">Override Debrid</span>
                        {showDebrid ? (
                            <Eye className="w-4 h-4" />
                        ) : (
                            <EyeOff className="w-4 h-4" />
                        )}
                    </button>

                    {/* Remove button */}
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name={`mode-${index}`}
                        value="credentials"
                        checked={account.mode === "credentials"}
                        onChange={() => onChange(index, "mode", "credentials")}
                    />
                    <span>Email/Password</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name={`mode-${index}`}
                        value="authkey"
                        checked={account.mode === "authkey"}
                        onChange={() => onChange(index, "mode", "authkey")}
                    />
                    <span>AuthKey</span>
                </label>
            </div>

            {account.mode === "credentials" ? (
                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder={`Email #${index + 1}`}
                        className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                        value={account.email}
                        onChange={(e) => onChange(index, "email", e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder={`Password #${index + 1}`}
                        className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                        value={account.password}
                        onChange={(e) => onChange(index, "password", e.target.value)}
                    />
                </div>
            ) : (
                <input
                    type="text"
                    placeholder={`AuthKey #${index + 1}`}
                    className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                    value={account.authkey}
                    onChange={(e) => onChange(index, "authkey", e.target.value)}
                />
            )}

            {/* Debrid Override (only if button clicked) */}
            {showDebrid && (
                <div className="flex items-center space-x-3 mt-4">
                    <select
                        value={account.debrid_type || ""}
                        onChange={(e) => onChange(index, "debrid_type", e.target.value)}
                        className="border border-gray-600 bg-gray-800 p-2 rounded-lg text-white"
                    >
                        {DEBRID_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {account.debrid_type && (
                        <div className="flex items-center space-x-2 flex-1">
                            <input
                                type="text"
                                placeholder="Enter override"
                                className="flex-1 border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                                value={account.debrid_key || ""}
                                onChange={(e) => onChange(index, "debrid_key", e.target.value)}
                            />
                            <a
                                href={
                                    DEBRID_OPTIONS.find((o) => o.value === account.debrid_type)?.url || "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline text-sm"
                            >
                                Get key
                            </a>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
