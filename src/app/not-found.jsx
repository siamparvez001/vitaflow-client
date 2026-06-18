import Link from "next/link";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-4">

            {/* 404 number */}
            <h1 className="text-[160px] font-extrabold text-gray-200 dark:text-gray-800 leading-none select-none pb-15">
                404
            </h1>

            {/* Paw icon */}
            <div className="text-6xl -mt-10 mb-10"></div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-3">
                Oops! Page not found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                Looks like this page ran away like a playful pup. <br />
                Let's get you back home!
            </p>

            {/* Button */}
            <Link
                href="/"
                className="flex items-center gap-2 px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                ← Back to Home
            </Link>
        </div>
    );
};

export default NotFound;