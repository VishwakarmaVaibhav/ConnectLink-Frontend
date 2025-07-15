import {
  FaFacebookF,
  FaFacebookMessenger,
  FaWhatsapp,
  FaEnvelope,
  FaTwitter,
  FaLink,
} from "react-icons/fa";

export default function ShareModal({ postId }) {
  const postUrl = `${window.location.origin}/post/${postId}`;

  const shareOptions = [
    {
      icon: <FaLink />,
      label: "Copy link",
      onClick: () => {
        navigator.clipboard.writeText(postUrl);
        alert("Link copied to clipboard!");
      },
    },
    {
      icon: <FaFacebookF />,
      label: "Facebook",
      onClick: () =>
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`),
    },
    {
      icon: <FaFacebookMessenger />,
      label: "Messenger",
      onClick: () =>
        window.open(`fb-messenger://share/?link=${postUrl}`),
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      onClick: () =>
        window.open(`https://wa.me/?text=${postUrl}`),
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      onClick: () =>
        window.open(`mailto:?subject=Check this out!&body=${postUrl}`),
    },
    {
      icon: <FaTwitter />,
      label: "X (Twitter)",
      onClick: () =>
        window.open(`https://twitter.com/intent/tweet?url=${postUrl}`),
    },
  ];

  return (
    <div className="relative bg-black text-white p-6 rounded-xl flex flex-wrap justify-center gap-5 max-w-md mx-auto">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-white bg-gray-700 hover:bg-gray-600 p-1.5 rounded-full text-sm"
        onClick={() => window.dispatchEvent(new CustomEvent("closeShareModal"))}
        aria-label="Close"
      >
        ✕
      </button>

      {shareOptions.map(({ icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex flex-col items-center text-xs hover:opacity-80 transition focus:outline-none"
        >
          <div className="bg-[#181818] p-4 rounded-full text-lg">{icon}</div>
          <span className="mt-1">{label}</span>
        </button>
      ))}
    </div>
  );
}
