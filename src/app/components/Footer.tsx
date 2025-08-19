import packageJson from "@/../package.json";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="mt-12 py-6 text-center text-gray-400 text-sm border-t border-gray-700">
            <div className="space-y-2">
                <p className="font-medium flex items-center justify-center gap-1">
                    ☕
                    <Link
                        href="https://ko-fi.com/oozmakafa"
                        target="_blank"
                        className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                        Support my work
                    </Link>
                </p>

                <p>
                    Developed by{" "}
                    <span className="text-gray-200 font-semibold">Oozmakafa</span> with the help of ChatGPT
                </p>

                <p className="space-y-1">
                    <a
                        href="https://github.com/oozmakafa/stremio-account-addon-cloner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
                    >
                        📂 <span>View Source on GitHub</span>
                    </a>
                    <br />
                    <span className="font-mono text-gray-500">v{packageJson.version}</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
