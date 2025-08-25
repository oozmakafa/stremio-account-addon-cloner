import { UserPlus } from "lucide-react";
import { Account } from "../types/accounts";
import CloneAccountForm from "./CloneAccountForm";

type CloneAccountListProps = {
    accounts: Account[];
    onAdd: () => void;
    onChange: (index: number, field: keyof Account, value: string | boolean) => void;
    onRemove: (index: number) => void;
    onBulkChange: (checked: boolean) => void;
};

export default function CloneAccountList({
    accounts,
    onAdd,
    onChange,
    onRemove,
    onBulkChange
}: CloneAccountListProps) {
    // master checkbox state (checked if all accounts are selected)
    const allSelected = accounts.length > 0 && accounts.every(acc => acc.selected);

    const toggleAll = (checked: boolean) => {
        if (onBulkChange) {
            onBulkChange(checked);
        } else {
            accounts.forEach((_, idx) => {
                onChange(idx, "selected", checked);
            });
        }
    };
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Clone To Accounts</h2>
                <label
                    className="flex items-center space-x-2 cursor-pointer select-none"
                    title="Select or deselect all accounts for bulk operations"
                >
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleAll(e.target.checked)}
                        className="h-5 w-5 border-2 border-gray-400 rounded-sm bg-gray-700 
                                   checked:bg-blue-500 checked:border-blue-500 
                                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                                   cursor-pointer transition-all"
                    />
                    <span className="text-sm font-bold text-gray-300">Select All</span>
                </label>
            </div>
            {accounts.map((acc, index) => (
                <CloneAccountForm
                    key={index}
                    index={index}
                    account={acc}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            ))}

            <button
                type="button"
                onClick={onAdd}
                className="mt-4 flex items-center justify-center w-full gap-2 rounded-lg border border-dashed border-gray-600 bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white py-3 transition-colors"
            >
                <UserPlus className="w-5 h-5" />
                <span>Add Account</span>
            </button>
        </section>
    );
}
