"use client";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import PrimaryAccountForm from "./components/PrimaryAccountForm";
import CloneAccountList from "./components/CloneAccountList";
import AddonSelector from "./components/AddonSelector";
import CloneControls from "./components/CloneControls";
import { useAccounts } from "./hooks/useAccounts";
import { validateAccount, validateCloneAccounts } from "./utils/validation";
import { fetchAddons, cloneAddons } from "./services/api";
import { Addon, AddonData } from "./types/addon";

export default function Home() {
  const {
    primaryAccount,
    cloneAccounts,
    rememberDetails,
    setRememberDetails,
    addAccount,
    removeAccount,
    handleCloneChange,
    handlePrimaryChange,
    saveToLocalStorage,
  } = useAccounts();

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAddon, setLoadingAddon] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [showAddons, setShowAddons] = useState(false);

  const handleSelectAddonsClick = async () => {
    setLoadingAddon(true);
    setAlert(null);
    try {
      const { valid, error } = validateAccount(primaryAccount, "Primary");
      if (!valid) {
        setAlert({ type: "error", message: error! });
        return;
      }

      const addonsResult = await fetchAddons(primaryAccount);
      const formatted = addonsResult.map((addon: AddonData) => ({
        addon,
        id: addon.transportUrl,
        name: addon.manifest.name,
        is_protected: addon.flags.protected,
        is_configurable: addon.manifest.behaviorHints.configurable,
        checked: true,
      }));

      setAddons(formatted);
      setShowAddons(true);
    } catch (err) {
      if (err instanceof Error)
        setAlert({ type: "error", message: `Failed to load addons: ${err.message}` });
    } finally {
      setLoadingAddon(false);
    }
  };

  const handleSubmit = async () => {
    const { valid, error } = validateAccount(primaryAccount, "Primary");
    if (!valid) {
      setAlert({ type: "error", message: error! });
      return;
    }

    const cloneValidation = validateCloneAccounts(cloneAccounts);
    if (!cloneValidation.valid) {
      setAlert({ type: "error", message: cloneValidation.error! });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      saveToLocalStorage();
      const addonsToClone = addons.filter((addon) => addon.checked).map((addon) => addon.addon);
      await cloneAddons(primaryAccount, cloneAccounts, addonsToClone);
      setAlert({ type: "success", message: "Addons cloned successfully!" });
    } catch (err) {
      if (err instanceof Error)
        setAlert({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center">
      <Header />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow p-6 space-y-6 mt-6">
        <PrimaryAccountForm
          account={primaryAccount}
          onChange={handlePrimaryChange}
          showTooltip={showTooltip}
          toggleTooltip={() => setShowTooltip(!showTooltip)}
        />

        <AddonSelector
          loadingAddon={loadingAddon}
          showAddons={showAddons}
          addons={addons}
          setAddons={setAddons}
          handleSelectAddonsClick={handleSelectAddonsClick}
        />

        <CloneAccountList
          accounts={cloneAccounts}
          onAdd={addAccount}
          onChange={handleCloneChange}
          onRemove={removeAccount}
        />

        <CloneControls
          loading={loading}
          cloneAccounts={cloneAccounts}
          rememberDetails={rememberDetails}
          setRememberDetails={setRememberDetails}
          handleSubmit={handleSubmit}
        />
      </div>

      <Footer />
    </main>
  );
}
