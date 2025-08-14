import { Account } from "../types/accounts";
import CloneAccountForm from "./CloneAccountForm";

type CloneAccountListProps = {
    accounts: Account[];
    onAdd: () => void;
    onChange: (index: number, field: keyof Account, value: string) => void;
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
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                + Add Account
            </button>
        </section>
    );
}
