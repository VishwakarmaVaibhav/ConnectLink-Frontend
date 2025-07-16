import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Password validation rules
  const validations = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allValid = Object.values(validations).every(Boolean);

  const { mutate: signUpMutation } = useMutation({
    mutationFn: (userData) => axiosInstance.post("/auth/signup", userData),
    onSuccess: () => {
      toast.success("Account created! Please check your email to verify.");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setUsername("");
      setEmail("");
      setPassword("");
      setLoading(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Signup failed");
      setLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allValid) {
      toast.error("Password does not meet all requirements");
      return;
    }
    setLoading(true);
    signUpMutation({ username, email, password });
  };

  const renderValidation = (isValid, label) => (
    <p className={`text-sm ${isValid ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
      {isValid ? "✅" : "❌"} {label}
    </p>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <input
        type="password"
        placeholder="Password (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
