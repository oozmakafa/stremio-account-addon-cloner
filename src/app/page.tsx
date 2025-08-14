"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import PrimaryAccountForm from "./components/PrimaryAccountForm";
import CloneAccountList from "./components/CloneAccountList";
import { Account } from "./types/accounts";

export default function Home() {

  const [primaryAccount, setPrimaryAccount] = useState<Account>({
    mode: "credentials",
    email: "",
    password: "",
    authkey: "",
  });

  const [CloneAccounts, setCloneAccounts] = useState<Account[]>([
    { mode: "credentials", email: "", password: "", authkey: "" },
  ]);

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [rememberDetails, setRememberDetails] = useState(false);

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
    const encodedClones = CloneAccounts.map((acc) => ({
      ...acc,
      password: acc.mode === "credentials" ? btoa(acc.password || "") : "",
    }));
    localStorage.setItem(
      "stremio_clone_accounts",
      JSON.stringify({ primary: encodedPrimary, clones: encodedClones })
    );
  };

  const addAccount = () => setCloneAccounts([...CloneAccounts, { mode: "credentials", email: "", password: "", authkey: "" }]);
  const removeAccount = (index: number) => setCloneAccounts(CloneAccounts.filter((_, i) => i !== index));
  const handleCloneChange = (index: number, field: keyof Account, value: string) => {
    const updated = [...CloneAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setCloneAccounts(updated);
  };

  const handlePrimaryChange = (field: keyof Account, value: string) => {
    setPrimaryAccount({ ...primaryAccount, [field]: value });
  };

  const handleSubmit = async () => {
    // Check primary account
    if (primaryAccount.mode === "credentials") {
      if (!primaryAccount.email || !primaryAccount.password) {
        setAlert({ type: "error", message: "Primary account email and password are required." });
        return;
      }
    } else if (primaryAccount.mode === "authkey") {
      if (!primaryAccount.authkey) {
        setAlert({ type: "error", message: "Primary account auth key is required." });
        return;
      }
    }

    // Check clone accounts
    for (let i = 0; i < CloneAccounts.length; i++) {
      const acc = CloneAccounts[i];
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
      const data = JSON.stringify({ primary: primaryAccount, clones: CloneAccounts })

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
        setAlert({ type: "error", message: `Failed to clone addons: ${err.message || err}` });
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

        <CloneAccountList
          accounts={CloneAccounts}
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
