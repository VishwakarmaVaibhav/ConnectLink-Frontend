import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation rules
  const validations = {
    length: newPassword.length >= 6,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const allValid = Object.values(validations).every(Boolean);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!allValid) {
      toast.error("Password does not meet requirements");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", { token, newPassword });
      toast.success("Password reset. You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  const renderValidation = (isValid, label) => (
    <p className={`text-sm ${isValid ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
      {isValid ? "✅" : "❌"} {label}
    </p>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-200 px-4">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full space-y-6 animate-fade-in-up"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600">
          Enter a new password to reset your account password.
        </p>

        <input
          type="password"
          placeholder="New password (6+ characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        <div className="space-y-1">
          {renderValidation(validations.length, "At least 6 characters")}
          {renderValidation(validations.uppercase, "At least one uppercase letter")}
          {renderValidation(validations.lowercase, "At least one lowercase letter")}
          {renderValidation(validations.number, "At least one number")}
          {renderValidation(validations.specialChar, "At least one special character")}
        </div>

        <button
          type="submit"
          disabled={loading || !allValid}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 ${
            loading || !allValid
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
