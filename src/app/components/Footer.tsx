import packageJson from "@/../package.json";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="mt-12 py-6 text-center text-gray-400 text-sm border-t border-gray-700">
            <div className="space-y-2">
                <p className="font-medium">
                    ☕ Buy me a coffee?{" "}
                    <Link
                        href="https://ko-fi.com/oozmakafa"
                        target="_blank"
                        className="text-blue-400 hover:underline"
                    >
                        ko-fi.com/oozmakafa
                    </Link>
                </p>
                <p>
                    Developed by{" "}
                    <span className="text-white font-semibold">Oozmakafa</span> with the help of ChatGPT
                </p>

                <p>
                    <a
                        href="https://github.com/oozmakafa/stremio-account-addon-cloner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        📂 View Source on GitHub
                    </a>
                    <br />
                    <span className="font-mono">v{packageJson.version}</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
