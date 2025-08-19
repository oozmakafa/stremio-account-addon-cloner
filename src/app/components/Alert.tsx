import { useEffect } from "react";

type AlertProps = {
    type: "success" | "error";
    message: string;
    onClose: () => void;
};

export default function Alert({ type, message, onClose }: AlertProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // auto-close after 5 seconds

        return () => clearTimeout(timer); // cleanup
    }, [onClose]);
    return (
        <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ${type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
        >
            <div className="flex justify-between items-center space-x-4">
                <span>{message}</span>
                <button className="text-white font-bold" onClick={onClose}>
                    ×
                </button>
            </div>
        </div>
    );
}
