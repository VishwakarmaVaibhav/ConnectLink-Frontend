import { X } from "lucide-react";
import { Link } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-scaleIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-base-content/40 hover:text-base-content/70 transition-colors bg-base-200 p-1 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <img src="/small-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    </div>

                    <h2 className="text-2xl font-bold text-base-content mb-2">Join the Conversation</h2>
                    <p className="text-base-content/70 mb-8">
                        Sign up or log in to like, comment, and connect with your professional network.
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/signup"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                        >
                            Create Account
                        </Link>
                        <Link
                            to="/login"
                            className="block w-full bg-base-100 border-2 border-base-300 text-base-content/80 font-semibold py-3 px-6 rounded-full hover:bg-base-200 hover:border-base-300 transition-all duration-300"
                        >
                            Log In
                        </Link>
                    </div>

                    <p className="mt-6 text-xs text-base-content/40">
                        By joining, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
