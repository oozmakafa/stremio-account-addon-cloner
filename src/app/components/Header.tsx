import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Header = () => {
    const [showFAQ, setShowFAQ] = useState(false);

    return (
        <header className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 py-8 shadow-lg">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Stremio Account Addon Cloner
                </h1>
                <p className="mt-2 text-gray-200 text-sm md:text-base">
                    Clone your Stremio addons from your primary account to multiple accounts easily
                </p>

                {/* Blended Soft Info Box */}
                <div className="mt-4 inline-block bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm md:text-base shadow-sm text-left">
                    ℹ️ <b>Please note:</b> This tool works directly with your Stremio account.
                    Use responsibly to avoid potential account issues.
                    <br />
                    <span className="block mt-2 font-semibold text-purple-200">
                        📘 Check the FAQ below to learn more.
                    </span>

                    {/* Inline FAQ Toggle */}
                    <div className="mt-3 border-t border-white/20 pt-2">
                        <button
                            onClick={() => setShowFAQ(!showFAQ)}
                            className="flex items-center text-xs text-purple-200 hover:text-white transition-colors"
                        >
                            {showFAQ ? "Hide FAQ" : "Show FAQ"}
                            {showFAQ ? (
                                <ChevronUp className="ml-1 w-4 h-4" />
                            ) : (
                                <ChevronDown className="ml-1 w-4 h-4" />
                            )}
                        </button>

                        {/* Animated FAQ */}
                        <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${showFAQ ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="space-y-2 text-xs text-purple-100">
                                <div>
                                    <span className="font-semibold">🔹 What does this tool do?</span>{" "}
                                    It helps you copy addons from your main Stremio account to other accounts.
                                </div>
                                <div>
                                    <span className="font-semibold">🔹 Are addon credentials also cloned?</span>{" "}
                                    Yes — addon credentials (such as Debrid keys) are copied along with the addons.
                                </div>
                                <div>
                                    <span className="font-semibold">🔹 Can you overwrite the Debrid key of addons during cloning?</span>{" "}
                                    Yes — you can choose to replace it, but only for certain supported addons.
                                </div>
                                <div>
                                    <span className="font-semibold">🔹 What are the supported addons for override?</span>{" "}
                                    Only certain addons support Debrid key overrides. You can see the full list when you click enable the override option and click the (?) icon.
                                </div>
                                <div>
                                    <span className="font-semibold">🔹 Can you add addons on top of existing ones?</span>{" "}
                                    Yes. Clone mode can either <b>sync</b> (match exactly) or <b>append</b> (add new addons without removing existing ones).
                                </div>
                                <div>
                                    <span className="font-semibold">🔹 Can you view the addons currently installed for a clone account?</span>{" "}
                                    Yes. You can view installed addons by clicking the <b>puzzle button</b> on the top-right corner of each clone account.
                                </div>
                                <div>
                                    <span className="font-semibold">🔹 Can I undo a clone?</span>{" "}
                                    There’s no automatic undo, but you can easily remove addons from your Stremio account if needed.
                                </div>
                                <div>
                                    <span className="font-semibold">🔹 Is it safe?</span>{" "}
                                    Yes. The tool only works with your accounts and does not save or share any of your data.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
