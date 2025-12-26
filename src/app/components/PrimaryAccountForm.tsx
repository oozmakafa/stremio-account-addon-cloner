"use client";

import { useState } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { Account } from "../types/accounts";
import ConfigurePrimary from "./ConfigurePrimary";
import { Eye, EyeOff } from "lucide-react";

export default function PrimaryAccountForm() {
    const { primaryAccount, setPrimaryAccount } = useAccounts();

    const handlePrimaryChange = (field: keyof Account, value: string) => {
        setPrimaryAccount({ ...primaryAccount, [field]: value });
    };

    const [showTooltip, setShowTooltip] = useState(false);
    const toggleTooltip = () => setShowTooltip((prev) => !prev);
    const [showPassword, setShowPassword] = useState(false);


    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Primary Account</h2>
            <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="primaryMode"
                        value="credentials"
                        checked={primaryAccount.mode === "credentials"}
                        onChange={() => handlePrimaryChange("mode", "credentials")}
                    />
                    <span>Email/Password</span>
                </label>
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
                                onClick={toggleTooltip}
                            >
                                ?
                            </button>
                            {showTooltip && (
                                <div
                                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 
                    bg-gray-900/95 text-white text-sm rounded-lg p-3 w-72 
                    shadow-xl z-10 border border-gray-700 backdrop-blur-sm"
                                >
                                    <strong className="text-blue-300">How to get your AuthKey:</strong>
                                    <ol className="list-decimal list-inside mt-1 space-y-1 text-gray-200">
                                        <li>
                                            Log in to{" "}
                                            <a
                                                href="https://web.stremio.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline text-blue-400 hover:text-blue-300"
                                            >
                                                web.stremio.com
                                            </a>
                                        </li>
                                        <li>Open the browser console (F12 or Ctrl+Shift+I)</li>
                                        <li>
                                            Run:{" "}
                                            <code className="bg-gray-800 border border-gray-700 px-1 py-0.5 rounded break-all text-green-300">
                                                JSON.parse(localStorage.getItem(&quot;profile&quot;)).auth.key
                                            </code>
                                        </li>
                                        <li>Copy the output and paste it here</li>
                                    </ol>

                                    {/* Tooltip arrow */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/95 border-l border-t border-gray-700 rotate-45"></div>
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
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full border border-gray-600 bg-gray-700 p-2 pr-10 rounded-lg text-white placeholder-gray-400"
                            value={primaryAccount.password}
                            onChange={(e) => handlePrimaryChange("password", e.target.value)}
                        />

                        {/* Eye toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

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

            <ConfigurePrimary />

        </section>
    );
}
