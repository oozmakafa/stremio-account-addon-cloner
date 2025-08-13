const Header = () => {
    return (
        <header className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 py-8 shadow-lg">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Stremio Account Addon Cloner
                </h1>
                <p className="mt-2 text-gray-200 text-sm md:text-base">
                    Clone your Stremio addons from your primary account to multiple accounts easily
                </p>

                {/* Blended Soft Warning */}
                <div className="mt-4 inline-block bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm md:text-base shadow-sm text-left">
                    ⚠️ <b>Please note:</b> This tool interacts directly with your Stremio account.
                    <br />
                    🔑 Addon credentials, such as your Debrid account details, will also be cloned to the target account.
                    <br />
                    <br />
                    Use responsibly to avoid potential account issues.
                </div>
            </div>
        </header>
    )
}

export default Header;