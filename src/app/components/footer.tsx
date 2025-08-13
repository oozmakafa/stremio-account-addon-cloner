
import packageJson from "@/../package.json";

const Footer = () => {
    return (
        <footer className="mt-10 py-6 text-center text-gray-400 text-sm">
            Built with ☕, 💻, a dash of 🍯 and help of ChatGPT — v{packageJson.version}
            <span className="block">
                Created by <span className="text-white font-semibold">Oozmakafa</span>
            </span>
            <a
                href="https://github.com/oozmakafa/stremio-account-addon-cloner"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
            >
                View Source
            </a>
        </footer>
    )
}

export default Footer;