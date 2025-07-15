import { useState } from "react";
import {  Pencil } from "lucide-react";


const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState(userData.about || "");

	const handleSave = () => {
		setIsEditing(false);
		onSave({ about });
	};

	return (
		<div className="bg-white p-4 md:p-6 rounded-2xl mb-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-gray-800">About</h2>
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
				<div>
					<textarea
						value={about}
						onChange={(e) => setAbout(e.target.value)}
						rows="5"
						className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						placeholder="Tell something about yourself..."
					/>
					<div className="mt-4 flex justify-end gap-2">
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
				<p className="text-gray-700 whitespace-pre-line">
					{userData.about || "No information added yet."}
				</p>
			)}
		</div>
	);
};

export default AboutSection;
