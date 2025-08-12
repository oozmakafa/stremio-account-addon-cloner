"use client";

import { useState } from "react";

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

  const handleSubmit = async () => {
    try {
      const data = JSON.stringify({ primary: primaryAccount, clones: cloneAccounts })

      const res = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      alert("✅ Addons cloned successfully!");
    } catch (err: any) {
      alert(`❌ Failed: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center">
      {/* Jumbotron */}
      <header className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 py-8 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Stremio Account Addon Cloner
          </h1>
          <p className="mt-2 text-gray-200 text-sm md:text-base">
            Clone your Stremio addons from your primary account to multiple accounts easily
          </p>
        </div>
      </header>

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
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="primaryMode"
                value="authkey"
                checked={primaryAccount.mode === "authkey"}
                onChange={() =>
                  handlePrimaryChange("mode", "authkey")
                }
              />
              <span>AuthKey</span>
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
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Clone Addon
          </button>
        </div>
      </div>
    </main>
  );
}
