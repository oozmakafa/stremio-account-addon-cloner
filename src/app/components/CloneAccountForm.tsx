import { useState } from "react";
import { Account } from "../types/accounts";
import { Copy, ExternalLink, HelpCircle, Key, Loader2, Puzzle, ToggleLeft, ToggleRight, Wrench, X } from "lucide-react";
import { fetchAddons } from "../services/api";
import { AddonData } from "../types/addon";
import { DEBRID_OPTIONS, SUPPORTED_ADDONS_DEBRID_OVERRIDE } from "../utils/debridOptions";
import Alert from "./Alert";
import { validateAccount } from "../utils/validation";



type CloneAccountFormProps = {
    index: number;
    account: Account;
    onChange: (index: number, field: keyof Account, value: string | boolean) => void;
    onRemove: (index: number) => void;
};

export default function CloneAccountForm({
    index,
    account,
    onChange,
    onRemove,
}: CloneAccountFormProps) {
    const [showModal, setShowModal] = useState(false);
    const [addons, setAddons] = useState<AddonData[]>([]);
    const [showSupportedModal, setShowSupportedModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const fetchCloneAddons = async () => {
        try {
            const { valid, error } = validateAccount(account, "Clone");
            if (!valid) {
                setAlert({ type: "error", message: error! });
                return;
            }
            setLoading(true);
            const res = await fetchAddons(account);
            setAddons(res);
            setShowModal(true);
        } catch (err) {
            if (err instanceof Error)
                setAlert({ type: "error", message: `Failed to load addons: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="mb-4 border border-gray-600 p-4 rounded-lg bg-gray-700">
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Account #{index + 1}</span>
                <div className="flex space-x-2">

                    {/* Addons button */}
                    <button
                        type="button"
                        title="View Addons"
                        onClick={fetchCloneAddons}
                        disabled={loading}
                        className={`p-2 rounded-lg flex items-center justify-center 
                            ${loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Puzzle className="w-5 h-5" />
                        )}
                    </button>

                    {/* Override Debrid button */}
                    <button
                        type="button"
                        title="Toggle Debrid Override"
                        onClick={() => onChange(index, "is_debrid_override", !account.is_debrid_override)}
                        className={`flex items-center justify-center p-2 rounded-lg transition-colors ${account.is_debrid_override
                            ? "bg-green-500 hover:bg-green-600 text-gray-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        <Wrench className="w-5 h-5" />
                    </button>

                    {/* Remove button */}
                    <button
                        type="button"
                        title="Remove Account"
                        onClick={() => onRemove(index)}
                        className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-red-400"
                    >
                        <X className="w-5 h-5" strokeWidth={4} />
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
            {account.is_debrid_override && (
                <div className="mt-4 space-y-3">
                    {/* Warning text */}
                    <p className="text-yellow-400 text-sm">
                        <strong>⚠️ Warning!</strong> This will <strong>replace the debrid key</strong> used by these{" "}
                        <button
                            type="button"
                            onClick={() => setShowSupportedModal(true)}
                            className="underline text-blue-400 hover:text-blue-300"
                        >
                            addons
                        </button>. This may affect how they work.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Debrid Select */}
                        <select
                            value={account.debrid_type || ""}
                            onChange={(e) => onChange(index, "debrid_type", e.target.value)}
                            className="border border-gray-600 bg-gray-800 p-2 rounded-lg text-white w-40"
                        >
                            {DEBRID_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Input + Key Button */}
                        {account.debrid_type && (
                            <div className="flex items-center flex-1 gap-2 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Enter key"
                                    className="flex-1 border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                                    value={account.debrid_key || ""}
                                    onChange={(e) => onChange(index, "debrid_key", e.target.value)}
                                />
                                <a
                                    href={
                                        DEBRID_OPTIONS.find(
                                            (o) => o.value === account.debrid_type
                                        )?.url || "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-blue-400"
                                    title="Get API Key"
                                >
                                    <Key className="w-5 h-5" />
                                </a>
                            </div>
                        )}
                    </div>


                    {/* Supported Override Modal */}
                    {showSupportedModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            onClick={() => setShowSupportedModal(false)}
                        >
                            <div
                                className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-gray-600"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close button */}
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                                    onClick={() => setShowSupportedModal(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <h2 className="text-lg font-semibold mb-4">
                                    Addons Compatible with Debrid Override
                                </h2>

                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {SUPPORTED_ADDONS_DEBRID_OVERRIDE.map((addon) => (
                                        <li key={addon}>{addon}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center space-x-2 mt-2">
                <span className="font-medium text-white">Clone Mode:</span>

                <button
                    type="button"
                    title={`Clone Mode: ${account.clone_mode === "sync" ? "Sync" : "Append"}`}
                    onClick={() =>
                        onChange(
                            index,
                            "clone_mode",
                            account.clone_mode === "sync" ? "append" : "sync"
                        )
                    }
                    className="flex items-center justify-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                    {account.clone_mode === "sync" ? (
                        <ToggleLeft className="w-6 h-6 text-white" />
                    ) : (
                        <ToggleRight className="w-6 h-6 text-blue-400" />
                    )}
                </button>

                <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-gray-200">
                        {account.clone_mode === "sync" ? "Sync" : "Append"}
                    </span>

                    {account.clone_mode === "append" && (
                        <div className="relative group">
                            <HelpCircle className="w-4 h-4 text-blue-400 cursor-pointer" />
                            <div
                                className="absolute left-0 mt-1 w-72 p-3 rounded-md 
                       bg-gray-800 border border-gray-600 
                       text-gray-200 text-xs shadow-lg z-10 space-y-2
                       opacity-0 translate-y-1 
                       group-hover:opacity-100 group-hover:translate-y-0 
                       transition-all duration-300"
                            >
                                <p>Add addons on top of existing ones.</p>
                                <p className="text-red-400 font-semibold">
                                    ⚠ If the same addons already exist, duplicates will be created. Proceed with caution.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>


            {/* Custom Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-gray-600"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                            onClick={() => setShowModal(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Available Addons</h2>

                        {loading ? (
                            <div className="flex justify-center items-center py-6">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : addons.length > 0 ? (
                            <ul className="space-y-2">
                                {addons.map((addon, index) => {
                                    const isConfigurable = addon.manifest.behaviorHints?.configurable;

                                    return (
                                        <li
                                            key={`${index}-${addon.transportUrl}`}
                                            className="flex items-center justify-between p-2 border border-gray-600 rounded-md bg-gray-700"
                                        >
                                            <span>{addon.manifest.name}</span>
                                            <div className="flex space-x-2">
                                                {/* External link */}
                                                <a
                                                    href={
                                                        isConfigurable
                                                            ? addon.transportUrl.replace("/manifest.json", "/configure")
                                                            : undefined
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`p-1 rounded ${!isConfigurable
                                                        ? "bg-gray-500 cursor-not-allowed opacity-50"
                                                        : "bg-blue-500 hover:bg-blue-600"
                                                        }`}
                                                    onClick={(e) => {
                                                        if (!isConfigurable) e.preventDefault();
                                                    }}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>

                                                {/* Copy button */}
                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(addon.transportUrl)
                                                    }
                                                    className="p-1 bg-gray-600 hover:bg-gray-500 rounded"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-sm">No addons found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
