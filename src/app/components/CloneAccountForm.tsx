import { useEffect, useState } from "react";
import { Account } from "../types/accounts";
import { Copy, ExternalLink, HelpCircle, Key, Loader2, Puzzle, ToggleLeft, ToggleRight, Trash2, Wrench, X } from "lucide-react";
import { fetchAddons, updateAddons } from "../services/api";
import { AddonData } from "../types/addon";
import { DEBRID_OPTIONS, SUPPORTED_ADDONS_DEBRID_OVERRIDE } from "../utils/debridOptions";
import Alert from "./Alert";
import { validateAccount } from "../utils/validation";
import { useAccounts } from "../hooks/useAccounts";



type CloneAccountFormProps = {
    index: number;
    account: Account;
};

export default function CloneAccountForm({
    index,
    account,
}: CloneAccountFormProps) {
    const { cloneAccounts, setCloneAccounts, removeAccount } = useAccounts();
    const [showModal, setShowModal] = useState(false);
    const [addons, setAddons] = useState<AddonData[]>([]);
    const [showSupportedModal, setShowSupportedModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleCloneChange = (index: number, field: keyof Account, value: string | boolean) => {
        const updated = [...cloneAccounts];
        updated[index] = { ...updated[index], [field]: value };
        setCloneAccounts(updated);
    };

    // disable scroll when modal is open
    useEffect(() => {
        if (showModal || showSupportedModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showModal, showSupportedModal]);

    const handleDeleteAddon = async (index: number) => {
        try {
            // Compute remaining addons locally
            const remaining = addons.filter((_, i) => i !== index);

            setLoading(true);
            const updated = await updateAddons(
                account,
                remaining
            );

            setAddons(updated.addons);
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to update addons: ${err.message}` });
            }
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteAllAddon = async () => {
        try {
            // Compute remaining addons locally
            const remaining = addons.filter((addon) => addon.flags.protected);

            setLoading(true);
            const updated = await updateAddons(
                account,
                remaining
            );

            setAddons(updated.addons);
        } catch (err) {
            if (err instanceof Error) {
                setAlert({ type: "error", message: `Failed to update addons: ${err.message}` });
            }
        } finally {
            setLoading(false);
        }
    }

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
                {/* Left side: checkbox + label */}
                <label className="flex items-center space-x-2 cursor-pointer select-none"
                    title="Include this account in bulk operations">
                    <input
                        type="checkbox"
                        checked={account.selected ?? false}
                        onChange={(e) => handleCloneChange(index, "selected", e.target.checked)}
                        className="h-5 w-5 border-2 border-gray-400 rounded-sm bg-gray-700 
                 checked:bg-blue-500 checked:border-blue-500 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 cursor-pointer transition-all"
                    />
                    <span className="font-semibold text-white">
                        Account #{index + 1}
                    </span>
                </label>
                <div className="flex space-x-2">

                    {/* Addons button */}
                    <button
                        type="button"
                        title="View Installed Addons"
                        onClick={fetchCloneAddons}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center 
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
                        <span className="hidden md:inline md:ml-2 text-sm font-medium">Addons</span>
                    </button>

                    {/* Override Debrid button */}
                    <button
                        type="button"
                        title="Toggle Debrid Override"
                        onClick={() =>
                            handleCloneChange(index, "is_debrid_override", !account.is_debrid_override)
                        }
                        className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${account.is_debrid_override
                            ? "bg-green-500 hover:bg-green-600 text-gray-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        <Wrench className="w-5 h-5" />
                        <span className="hidden md:inline md:ml-2 text-sm font-medium">Override</span>
                    </button>

                    {/* Remove button */}
                    <button
                        type="button"
                        title="Remove Account"
                        onClick={() => removeAccount(index)}
                        className="flex items-center px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-red-400"
                    >
                        <X className="w-5 h-5" strokeWidth={4} />
                        <span className="hidden md:inline md:ml-2 text-sm font-medium">Remove</span>
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
                        onChange={() => handleCloneChange(index, "mode", "credentials")}
                    />
                    <span>Email/Password</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name={`mode-${index}`}
                        value="authkey"
                        checked={account.mode === "authkey"}
                        onChange={() => handleCloneChange(index, "mode", "authkey")}
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
                        onChange={(e) => handleCloneChange(index, "email", e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder={`Password #${index + 1}`}
                        className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                        value={account.password}
                        onChange={(e) => handleCloneChange(index, "password", e.target.value)}
                    />
                </div>
            ) : (
                <input
                    type="text"
                    placeholder={`AuthKey #${index + 1}`}
                    className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                    value={account.authkey}
                    onChange={(e) => handleCloneChange(index, "authkey", e.target.value)}
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
                            onChange={(e) => handleCloneChange(index, "debrid_type", e.target.value)}
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
                                    onChange={(e) => handleCloneChange(index, "debrid_key", e.target.value)}
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

                    {/* Referral link if debrid is torbox */}
                    {account.debrid_type === "torbox" && (
                        <a
                            href="https://torbox.app/subscription?referral=916cba88-0186-4577-b449-0a5d7f820185"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Support me by using my Torbox referral link
                        </a>
                    )}


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

            <div className="flex items-center space-x-3 mt-3 bg-gray-800 px-3 py-2 rounded-xl border border-gray-700 shadow-sm">
                <span className="font-medium text-gray-200">Clone Mode</span>

                {/* Toggle Button */}
                <button
                    type="button"
                    title={`Clone Mode: ${account.clone_mode === "sync" ? "Sync" : "Append"}`}
                    onClick={() =>
                        handleCloneChange(
                            index,
                            "clone_mode",
                            account.clone_mode === "sync" ? "append" : "sync"
                        )
                    }
                    className="flex items-center px-3 py-1 rounded-lg transition-colors text-sm font-medium 
                   bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                    {account.clone_mode === "sync" ? (
                        <>
                            <ToggleLeft className="w-5 h-5 mr-1 text-gray-300" />
                            Sync
                        </>
                    ) : (
                        <>
                            <ToggleRight className="w-5 h-5 mr-1 text-blue-400" />
                            Append
                        </>
                    )}
                </button>

                {/* Tooltip for Append mode */}
                {account.clone_mode === "append" && (
                    <div className="relative group">
                        <HelpCircle className="w-4 h-4 text-blue-400 cursor-pointer" />
                        <div
                            className="absolute left-0 mt-2 w-72 p-3 rounded-lg 
                   bg-gray-900 border border-gray-700 
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

                        <h2 className="text-lg font-semibold mb-4">Account #{index + 1} - Installed Addons</h2>

                        {loading ? (
                            <div className="flex justify-center items-center py-6">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : addons.length > 0 ? (
                            <div>
                                {/* Scrollable container */}
                                <div className="max-h-128 overflow-y-auto pr-1">
                                    <ul className="space-y-2">
                                        {addons.map((addon, index) => {
                                            const isConfigurable = addon.manifest.behaviorHints?.configurable ?? false;
                                            const isProtected = addon.flags.protected ?? false;

                                            return (
                                                <li
                                                    key={`${index}-${addon.transportUrl}`}
                                                    className="flex items-center justify-between p-2 border border-gray-600 rounded-md bg-gray-700"
                                                >
                                                    <span>{addon.manifest.name} {addon.flags.protected ? "(Protected)" : ""}</span>
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
                                                            title="Copy Addon URL"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>

                                                        {/* Delete button */}
                                                        <button
                                                            onClick={!isProtected ? () => handleDeleteAddon(index) : undefined}
                                                            disabled={isProtected}
                                                            className={`p-1 rounded ${isProtected
                                                                ? "bg-gray-500 cursor-not-allowed opacity-50"
                                                                : "bg-red-600 hover:bg-red-500"
                                                                }`}
                                                            title={
                                                                isProtected
                                                                    ? "Protected addon cannot be deleted"
                                                                    : "Delete Addon"
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Delete All Button */}
                                {addons.length > 1 && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={handleDeleteAllAddon}
                                            className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-medium flex items-center space-x-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete All (Protected not included)</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No addons found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
