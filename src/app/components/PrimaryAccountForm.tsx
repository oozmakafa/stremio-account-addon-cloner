import { Account } from "../types/accounts";

type PrimaryAccountFormProps = {
    account: Account;
    onChange: (field: keyof Account, value: string) => void;
    showTooltip: boolean;
    toggleTooltip: () => void;
};

export default function PrimaryAccountForm({
    account,
    onChange,
    showTooltip,
    toggleTooltip,
}: PrimaryAccountFormProps) {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Primary Account</h2>
            <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="primaryMode"
                        value="credentials"
                        checked={account.mode === "credentials"}
                        onChange={() => onChange("mode", "credentials")}
                    />
                    <span>Email/Password</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="primaryMode"
                        value="authkey"
                        checked={account.mode === "authkey"}
                        onChange={() => onChange("mode", "authkey")}
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
            {account.mode === "credentials" ? (
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-600 bg-gray-700 p-2 rounded-lg text-white placeholder-gray-400"
                        value={account.email}
                        onChange={(e) => onChange("email", e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-600 bg-gray-700 p-2 rounded-lg text-white placeholder-gray-400"
                        value={account.password}
                        onChange={(e) => onChange("password", e.target.value)}
                    />
                </div>
            ) : (
                <input
                    type="text"
                    placeholder="AuthKey"
                    className="w-full border border-gray-600 bg-gray-700 p-2 rounded-lg text-white placeholder-gray-400"
                    value={account.authkey}
                    onChange={(e) => onChange("authkey", e.target.value)}
                />
            )}
        </section>
    );
}
