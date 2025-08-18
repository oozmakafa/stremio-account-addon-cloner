import { UserPlus } from "lucide-react";
import { Account } from "../types/accounts";
import CloneAccountForm from "./CloneAccountForm";

type CloneAccountListProps = {
    accounts: Account[];
    onAdd: () => void;
    onChange: (index: number, field: keyof Account, value: string | boolean) => void;
    onRemove: (index: number) => void;
};

export default function CloneAccountList({
    accounts,
    onAdd,
    onChange,
    onRemove,
}: CloneAccountListProps) {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Clone To Accounts</h2>
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
