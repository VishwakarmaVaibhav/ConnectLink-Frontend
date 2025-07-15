import { useState } from "react";
import {  Pencil } from "lucide-react";
const LocationDomainSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [location, setLocation] = useState(userData.location || "");
	const [domain, setDomain] = useState(userData.domain || "");

	const handleSave = () => {
		onSave({ location, domain });
		setIsEditing(false);
	};

	return (
		<div className="bg-white p-4 md:p-6 rounded-2xl mb-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-gray-800">Location & Domain</h2>
				{isOwnProfile && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className="text-gray-500 hover:text-gray-700 transition"
					>
						<Pencil size={18} />
					</button>
				)}
			</div>

			{isEditing ? (
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
						<input
							type="text"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
							placeholder="Enter your location"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
						<input
							type="text"
							value={domain}
							onChange={(e) => setDomain(e.target.value)}
							className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
							placeholder="E.g., Web Development, Data Science"
						/>
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<button
							onClick={() => setIsEditing(false)}
							className="text-sm text-gray-500 hover:text-gray-700 transition"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className="bg-blue-600 text-white py-2 px-5 rounded-full text-sm hover:bg-blue-700 transition"
						>
							Save
						</button>
					</div>
				</div>
			) : (
				<div className="text-gray-700 space-y-1">
					<p>
						<span className="font-medium text-gray-900">Location:</span>{" "}
						{location || "Not specified"}
					</p>
					<p>
						<span className="font-medium text-gray-900">Domain:</span>{" "}
						{domain || "General"}
					</p>
				</div>
			)}
		</div>
	);
};

export default LocationDomainSection;
