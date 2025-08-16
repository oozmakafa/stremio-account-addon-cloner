"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import PrimaryAccountForm from "./components/PrimaryAccountForm";
import CloneAccountList from "./components/CloneAccountList";
import { Account } from "./types/accounts";
import AddonsDragAndDrop from "./components/Addons";
import { Addon } from "./types/addon";

export default function Home() {

  const [primaryAccount, setPrimaryAccount] = useState<Account>({
    mode: "credentials",
    email: "",
    password: "",
    authkey: "",
  });

  const [cloneAccounts, setCloneAccounts] = useState<Account[]>([
    { mode: "credentials", email: "", password: "", authkey: "" },
  ]);

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAddon, setLoadingAddon] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [rememberDetails, setRememberDetails] = useState(false);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [showAddons, setShowAddons] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("stremio_clone_accounts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPrimaryAccount({
          ...parsed.primary,
          password:
            parsed.primary.mode === "credentials"
              ? atob(parsed.primary.password || "")
              : "",
        });
        setCloneAccounts(
          parsed.clones.map((acc: Account) => ({
            ...acc,
            password: acc.mode === "credentials" ? atob(acc.password || "") : "",
          }))
        );
        setRememberDetails(true);
      } catch (err) {
        console.error("Failed to load saved accounts:", err);
      }
    }
  }, []);

  // Save to localStorage if rememberDetails is true
  const saveToLocalStorage = () => {
    if (!rememberDetails) {
      localStorage.removeItem("stremio_clone_accounts");
      return;
    }
    const encodedPrimary = {
      ...primaryAccount,
      password:
        primaryAccount.mode === "credentials"
          ? btoa(primaryAccount.password || "")
          : "",
    };
    const encodedClones = cloneAccounts.map((acc) => ({
      ...acc,
      password: acc.mode === "credentials" ? btoa(acc.password || "") : "",
    }));
    localStorage.setItem(
      "stremio_clone_accounts",
      JSON.stringify({ primary: encodedPrimary, clones: encodedClones })
    );
  };

  const addAccount = () => setCloneAccounts([...cloneAccounts, { mode: "credentials", email: "", password: "", authkey: "" }]);
  const removeAccount = (index: number) => setCloneAccounts(cloneAccounts.filter((_, i) => i !== index));
  const handleCloneChange = (index: number, field: keyof Account, value: string) => {
    const updated = [...cloneAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setCloneAccounts(updated);
  };

  const handlePrimaryChange = (field: keyof Account, value: string) => {
    setPrimaryAccount({ ...primaryAccount, [field]: value });
  };


  // Check primary account
  const isMissingPrimaryDetails = () => {
    if (primaryAccount.mode === "credentials") {
      if (!primaryAccount.email || !primaryAccount.password) {
        setAlert({ type: "error", message: "Primary account email and password are required." });
        return true;
      }
    } else if (primaryAccount.mode === "authkey") {
      if (!primaryAccount.authkey) {
        setAlert({ type: "error", message: "Primary account auth key is required." });
        return true;
      }
    }
    return false;
  }

  const handleSelectAddonsClick = async () => {
    setLoadingAddon(true);
    setAlert(null);
    try {

      if (isMissingPrimaryDetails()) {
        return;
      }

      const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(primaryAccount),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.details || "Unknown error");

      const formatted = result.addons.map((addon: { transportUrl: string; manifest: { name: string; behaviorHints: { configurable: boolean; } }; flags: { protected: boolean; }; }) => ({
        addon: addon,
        id: addon.transportUrl,
        name: addon.manifest.name,
        is_protected: addon.flags.protected,
        is_configurable: addon.manifest.behaviorHints.configurable,
        checked: true // default to checked
      }));

      setAddons(formatted);
      setShowAddons(true);
    } catch (err) {
      if (err instanceof Error)
        setAlert({ type: "error", message: `Failed to load addons: ${err.message || err}` });
    } finally {
      setLoadingAddon(false);
    }
  };

  const handleSubmit = async () => {

    if (isMissingPrimaryDetails()) {
      return;
    }

    // Check clone accounts
    for (let i = 0; i < cloneAccounts.length; i++) {
      const acc = cloneAccounts[i];
      if (acc.mode === "credentials") {
        if (!acc.email || !acc.password) {
          setAlert({ type: "error", message: `Clone account #${i + 1}: Email and password are required.` });
          return;
        }
      } else if (acc.mode === "authkey") {
        if (!acc.authkey) {
          setAlert({ type: "error", message: `Clone account #${i + 1}: Auth key is required.` });
          return;
        }
      }
    }

    // Start loading
    setLoading(true);
    setAlert(null);

    try {
      saveToLocalStorage(); // Save before sending request
      const addons_to_clone = addons.filter((addon) => addon.checked).map((addon) => addon.addon);

      const data = JSON.stringify({ primary: primaryAccount, clones: cloneAccounts, addons: addons_to_clone })

      const res = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.details || "Unknown error");

      setAlert({ type: "success", message: "Addons cloned successfully!" });
    } catch (err) {
      if (err instanceof Error)
        setAlert({ type: "error", message: `${err.message || err}` });
    }
    finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center">
      <Header />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow p-6 space-y-6 mt-6">
        <PrimaryAccountForm
          account={primaryAccount}
          onChange={handlePrimaryChange}
          showTooltip={showTooltip}
          toggleTooltip={() => setShowTooltip(!showTooltip)}
        />

        {/* New button for selecting addons */}
        <div>
          <button
            type="button"
            onClick={handleSelectAddonsClick}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {loadingAddon ? "Loading Addons..." : "Select Addons to Clone (Optional)"}
          </button>

          {showAddons && (
            <AddonsDragAndDrop
              addons={addons}
              onChange={(updatedAddons) => setAddons(updatedAddons)}
            />
          )}


        </div>
        {/* <DragAndDropList /> */}

        <CloneAccountList
          accounts={cloneAccounts}
          onAdd={addAccount}
          onChange={handleCloneChange}
          onRemove={removeAccount}
        />

        <div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            {loading ? "Cloning..." : "Clone Addon"}
          </button>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={rememberDetails}
              onChange={(e) => setRememberDetails(e.target.checked)}
            />
            <span>Remember my details</span>
          </label>
        </div>
      </div>

      <Footer />
    </main>
  );
}
