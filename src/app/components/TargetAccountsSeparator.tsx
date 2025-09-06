export default function TargetAccountsSeparator() {
    return (
        <div className="relative flex items-center my-8">
            <div className="flex-grow h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full"></div>
            <span className="px-4 py-1 text-purple-300 font-bold text-sm tracking-wider uppercase bg-gray-900 rounded-full shadow-lg">
                Target Accounts
            </span>
            <div className="flex-grow h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full"></div>
        </div>
    )
}