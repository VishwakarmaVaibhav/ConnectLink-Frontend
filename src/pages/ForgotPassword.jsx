import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (cooldown === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [cooldown]);

  const startCooldown = () => {
    setCooldown(60);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cooldown > 0) return; // Just in case

    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email");
      setEmail("");
      startCooldown();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 shadow-lg rounded-xl p-8 max-w-md w-full space-y-6 animate-fade-in-up"
      >
        <h2 className="text-2xl font-semibold text-base-content text-center">
          Forgot Password
        </h2>
        <p className="text-center text-base-content/70">
          Enter your email below and we'll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-base-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={loading || cooldown > 0}
        />

        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 ${
            loading || cooldown > 0
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Sending..."
            : cooldown > 0
            ? `Wait ${cooldown}s`
            : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
