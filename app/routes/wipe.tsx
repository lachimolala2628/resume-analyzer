import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-5 p-6 bg-white rounded-2xl shadow-lg relative">
            <div className="flex max-sm:flex-col items-center justify-between">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Authenticated as: <span className="font-medium text-blue-600">{auth.user?.username}</span>
                    </p>
                </div>
                <div className="max-sm:mb-5">
                    <Link to="/" className="back-button">
                        <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                        <span className="text-gray-800 text-sm font-semibold">Back to Home</span>
                    </Link>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Existing Files</h2>
                {files.length > 0 ? (
                    <ul className="space-y-3">
                        {files.map((file) => (
                            <li
                                key={file.id}
                                className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                <span className="text-gray-800 font-medium">{file.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No files found.</p>
                )}
            </div>

            <div className="pt-4 border-t border-gray-200">
                <button
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
                    onClick={handleDelete}
                >
                    Wipe App Data
                </button>
            </div>
        </div>

    );
};

export default WipeApp;