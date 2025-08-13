"use client";
import { useState } from "react";
import Footer from "./components/footer";
import Header from "./components/header";

type CloneAccount = {
  mode: "credentials" | "authkey";
  email: string;
  password: string;
  authkey: string;
};

export default function Home() {
  const [primaryAccount, setPrimaryAccount] = useState<CloneAccount>({
    mode: "credentials",
    email: "",
    password: "",
    authkey: "",
  });

  const [cloneAccounts, setCloneAccounts] = useState<CloneAccount[]>([
    { mode: "credentials", email: "", password: "", authkey: "" },
  ]);

  const addCloneAccount = () => {
    setCloneAccounts([
      ...cloneAccounts,
      { mode: "credentials", email: "", password: "", authkey: "" },
    ]);
  };

  const removeCloneAccount = (index: number) => {
    setCloneAccounts(cloneAccounts.filter((_, i) => i !== index));
  };

  const handleCloneChange = (
    index: number,
    field: keyof CloneAccount,
    value: string
  ) => {
    const updated = [...cloneAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setCloneAccounts(updated);
  };

  const handlePrimaryChange = (field: keyof CloneAccount, value: string) => {
    setPrimaryAccount({ ...primaryAccount, [field]: value });
  };

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
      const data = JSON.stringify({ primary: primaryAccount, clones: cloneAccounts })

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
      {/* Jumbotron */}
      <Header />

      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ${alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          <div className="flex justify-between items-center space-x-4">
            <span>{alert.message}</span>
            <button
              className="text-white font-bold"
              onClick={() => setAlert(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow p-6 space-y-6 mt-6">

        {/* Primary Account */}
        <section>
          <h2 className="text-xl font-bold mb-4">Primary Account</h2>

          {/* Mode Toggle */}
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="primaryMode"
                value="credentials"
                checked={primaryAccount.mode === "credentials"}
                onChange={() =>
                  handlePrimaryChange("mode", "credentials")
                }
              />
              <span>Email/Password</span>
            </label>
            {/* AuthKey option */}
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="primaryMode"
                value="authkey"
                checked={primaryAccount.mode === "authkey"}
                onChange={() => handlePrimaryChange("mode", "authkey")}
              />

              <span className="flex items-center">
                AuthKey
                <div className="relative ml-2">
                  <button
                    type="button"
                    className="text-blue-500 font-bold rounded-full w-6 h-6 text-xs flex items-center justify-center border border-blue-500 hover:bg-blue-100"
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    ?
                  </button>

                  {showTooltip && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded p-3 w-72 shadow-lg z-10">
                      <strong>How to get your AuthKey:</strong>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>
                          Log in to{" "}
                          <a
                            href="https://web.stremio.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-300"
                          >
                            web.stremio.com
                          </a>
                        </li>
                        <li>Open the browser console (F12 or Ctrl+Shift+I)</li>
                        <li>
                          Run:{" "}
                          <code className="bg-gray-700 px-1 py-0.5 rounded break-all">
                            JSON.parse(localStorage.getItem(&quot;profile&quot;)).auth.key
                          </code>
                        </li>
                        <li>Copy the output and paste it here</li>
                      </ol>
                    </div>
                  )}
                </div>
              </span>
            </label>
          </div>

          {primaryAccount.mode === "credentials" ? (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-600 bg-gray-700 p-2 rounded-lg text-white placeholder-gray-400"
                value={primaryAccount.email}
                onChange={(e) => handlePrimaryChange("email", e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-600 bg-gray-700 p-2 rounded-lg text-white placeholder-gray-400"
                value={primaryAccount.password}
                onChange={(e) => handlePrimaryChange("password", e.target.value)}
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="AuthKey"
              className="w-full border border-gray-600 bg-gray-700 p-2 rounded-lg text-white placeholder-gray-400"
              value={primaryAccount.authkey}
              onChange={(e) => handlePrimaryChange("authkey", e.target.value)}
            />
          )}
        </section>

        {/* Clone Accounts */}
        <section>
          <h2 className="text-xl font-bold mb-4">Clone To Accounts</h2>
          {cloneAccounts.map((acc, index) => (
            <div
              key={index}
              className="mb-4 border border-gray-600 p-4 rounded-lg bg-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">
                  Account #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCloneAccount(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`mode-${index}`}
                    value="credentials"
                    checked={acc.mode === "credentials"}
                    onChange={() =>
                      handleCloneChange(index, "mode", "credentials")
                    }
                  />
                  <span>Email/Password</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`mode-${index}`}
                    value="authkey"
                    checked={acc.mode === "authkey"}
                    onChange={() =>
                      handleCloneChange(index, "mode", "authkey")
                    }
                  />
                  <span>AuthKey</span>
                </label>
              </div>

              {acc.mode === "credentials" ? (
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder={`Email #${index + 1}`}
                    className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                    value={acc.email}
                    onChange={(e) =>
                      handleCloneChange(index, "email", e.target.value)
                    }
                  />
                  <input
                    type="password"
                    placeholder={`Password #${index + 1}`}
                    className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                    value={acc.password}
                    onChange={(e) =>
                      handleCloneChange(index, "password", e.target.value)
                    }
                  />
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={`AuthKey #${index + 1}`}
                  className="w-full border border-gray-600 bg-gray-800 p-2 rounded-lg text-white placeholder-gray-400"
                  value={acc.authkey}
                  onChange={(e) =>
                    handleCloneChange(index, "authkey", e.target.value)
                  }
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCloneAccount}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + Add Account
          </button>
        </section>

        {/* Submit */}
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            {loading ? "Cloning..." : "Clone Addon"}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
