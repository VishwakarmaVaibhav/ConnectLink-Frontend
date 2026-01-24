// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        toast.success(res.data.message || "Email verified successfully!");
        navigate("/login?verified=true", { replace: true });
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired token");
      } finally {
        setLoading(false);
      }
    };

    if (token) verify();
    else {
      setError("Verification token is missing");
      setLoading(false);
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <Loader className="animate-spin size-6 mr-2" />
        <span>Verifying your email, please wait...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
      <p className="text-base-content/80">{error}</p>
    </div>
  );
};

export default VerifyEmail;
