import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Pencil, Check } from "lucide-react";
import imageCompression from "browser-image-compression";
import { Dialog } from "@headlessui/react"; // Install: `npm i @headlessui/react`

import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const queryClient = useQueryClient();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
		queryKey: ["connectionStatus", userData._id],
		queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
		enabled: !isOwnProfile,
	});

	const isConnected = userData.connections?.includes(authUser?._id);

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
	});

	const getConnectionStatus = useMemo(() => {
		if (isConnected) return "connected";
		return connectionStatus?.data?.status || "not_connected";
	}, [isConnected, connectionStatus]);

	const renderConnectionButton = () => {
		const baseClass =
			"text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center text-sm";
		switch (getConnectionStatus) {
			case "connected":
				return (
					<div className="flex flex-col md:flex-row gap-2 justify-center">
						<div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
							<UserCheck size={18} className="mr-2" /> Connected
						</div>
						<button
							className={`${baseClass} bg-red-500 hover:bg-red-600`}
							onClick={() => removeConnection(userData._id)}
						>
							<X size={18} className="mr-2" /> Remove
						</button>
					</div>
				);
			case "pending":
				return (
					<button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
						<Clock size={18} className="mr-2" /> Pending
					</button>
				);
			case "received":
				return (
					<div className="flex gap-2 justify-center">
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-green-500 hover:bg-green-600`}
						>
							Accept
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-red-500 hover:bg-red-600`}
						>
							Reject
						</button>
					</div>
				);
			default:
				return (
					<button
						onClick={() => sendConnectionRequest(userData._id)}
						className={`${baseClass} bg-primary hover:bg-primary-dark`}
					>
						<UserPlus size={18} className="mr-2" /> Connect
					</button>
				);
		}
	};

	const handleImageChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		try {
			const options = {
				maxSizeMB: 0.3,
				maxWidthOrHeight: 500,
				useWebWorker: true,
			};
			const compressedFile = await imageCompression(file, options);

			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({
					...prev,
					[event.target.name]: reader.result,
				}));
			};
			reader.readAsDataURL(compressedFile);
		} catch (error) {
			toast.error("Image upload failed");
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

	return (
		<div className="w-full overflow-hidden mb-6">
			{/* Banner */}
			<div className="relative h-44 sm:h-56 md:h-64 lg:h-72 w-full bg-gray-300">
				<img
					src={editedData.bannerImg || userData.bannerImg || "/banner.png"}
					alt="Banner"
					className="object-cover w-full h-full"
				/>
				{isEditing && (
					<label className="absolute top-3 right-3 bg-white p-2 rounded-full cursor-pointer shadow hover:bg-gray-100">
						<Camera size={20} className="text-gray-700" />
						<input
							type="file"
							name="bannerImg"
							className="hidden"
							onChange={handleImageChange}
							accept="image/*"
						/>
					</label>
				)}
			</div>

			{/* Profile Info */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-4 md:p-6 lg:px-12 bg-white">
				<div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
					{/* Profile Picture */}
					<div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0">
						<img
							src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
							alt={userData.name}
							className="w-full h-full rounded-full object-cover border-4 border-white"
						/>
						{isEditing && (
							<label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full cursor-pointer shadow hover:bg-gray-100">
								<Camera size={18} className="text-gray-700" />
								<input
									type="file"
									name="profilePicture"
									className="hidden"
									onChange={handleImageChange}
									accept="image/*"
								/>
							</label>
						)}
					</div>

					{/* Text Info */}
					<div className="flex-1 text-center md:text-left">
						{isEditing ? (
							<>
								<input
									type="text"
									value={editedData.name ?? userData.name}
									onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
									className="text-2xl font-bold w-full bg-transparent border-b focus:outline-none text-center md:text-left"
								/>
								<input
									type="text"
									value={editedData.headline ?? userData.headline}
									onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
									className="text-sm text-gray-600 w-full bg-transparent border-b focus:outline-none mt-1 text-center md:text-left"
								/>
							</>
						) : (
							<>
								<h2 className="text-2xl font-semibold text-gray-800">{userData.name}</h2>
								<p className="text-sm text-gray-600">{userData.headline}</p>
							</>
						)}

						<div className="flex items-center justify-center md:justify-start text-gray-500 gap-1 mt-2 text-sm">
							<MapPin size={16} />
							{isEditing ? (
								<input
									type="text"
									value={editedData.location ?? userData.location}
									onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
									className="bg-transparent border-b text-sm focus:outline-none text-center md:text-left"
								/>
							) : (
								<span>{userData.location}</span>
							)}
						</div>
						{userData?.connections?.length > 0 && (
  <button
    onClick={() => setIsModalOpen(true)}
    className="mt-3 text-sm text-blue-600 hover:underline font-medium"
  >
    {userData.connections.length} connections
  </button>
)}

					</div>
				</div>

				{/* Buttons */}
				{/* Buttons */}
<div className="w-full md:w-auto flex justify-center md:justify-end items-center">
	{isOwnProfile ? (
		<button
			onClick={isEditing ? handleSave : () => setIsEditing(true)}
			className="text-gray-500 hover:text-gray-700 transition"
			title={isEditing ? "Save" : "Edit"}
		>
			{isEditing ? <Check size={18} /> : <Pencil size={18} />}
		</button>
	) : (
		renderConnectionButton()
	)}
</div>

			</div>
			<Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 space-y-4">
      <Dialog.Title className="text-lg font-semibold text-gray-800">
        Connections
      </Dialog.Title>
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {userData.connections.map((conn) => (
          <li
            key={conn._id}
            className="flex items-center gap-3 border-b pb-2 hover:bg-gray-50 rounded px-2"
          >
            <img
              src={conn.profilePicture || "/avatar.png"}
              alt={conn.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-800">{conn.name}</p>
              <p className="text-sm text-gray-500">@{conn.username}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Close
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

		</div>
	);
};

export default ProfileHeader;
