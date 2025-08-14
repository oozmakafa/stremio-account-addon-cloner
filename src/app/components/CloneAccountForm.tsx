import { Account } from "../types/accounts";

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
    return (
        <div className="mb-4 border border-gray-600 p-4 rounded-lg bg-gray-700">
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Account #{index + 1}</span>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
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
        </div>
    );
}
