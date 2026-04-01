import { useNavigate } from "react-router-dom";

function Notfound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#1d1d1d] text-white text-center px-4">

            <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>

            <h2 className="text-2xl font-semibold mb-2">
                Oops! Page Not Found 😕
            </h2>

            <p className="text-gray-400 mb-6 max-w-md">
                The page you are looking for might have been removed,
                renamed, or is temporarily unavailable.
            </p>

            <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-all"
            >
                🔐 Go to Login
            </button>

        </div>
    );
}

export default Notfound;