import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompleteProfileReminder = ({ user }) => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    if (user && user.username) {
      console.log("Navigating to profile of:", user);
      navigate(`/profile/${user.username}`);
    } else {
      console.error("User or username is undefined.");
    }
  };

  return (
    <div className="flex items-start mb-5 gap-4 bg-yellow-50 border border-yellow-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <AlertTriangle className="text-yellow-500 mt-1" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800">
          Your profile is incomplete!
        </p>
        <p className="text-xs text-yellow-700 mt-1">
          Add a profile picture, bio, and your platform links to help others know you better.
        </p>
      </div>

      <button
        onClick={handleCompleteProfile}
        className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-md hover:bg-yellow-600"
      >
        Complete
      </button>
    </div>
  );
};

export default CompleteProfileReminder;
