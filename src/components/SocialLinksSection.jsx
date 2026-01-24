import { useState } from "react";
import { Pencil, Check, Github, Linkedin, Link } from "lucide-react";

const SocialLinksSection = ({ userData, isOwnProfile, onSave }) => {
	const initialLinks = userData.socialLinks || {};
	const [isEditing, setIsEditing] = useState(false);
	const [editedLinks, setEditedLinks] = useState(initialLinks);

	const handleChange = (e) => {
		setEditedLinks({
			...editedLinks,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = () => {
		onSave({ socialLinks: editedLinks });
		setIsEditing(false);
	};

	return (
		<div className="p-4 md:p-6 bg-base-100 rounded-xl">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-base-content">Social Links</h2>
				{isOwnProfile && (
					<button
						onClick={isEditing ? handleSave : () => setIsEditing(true)}
						className="text-base-content/60 hover:text-base-content/80 transition"
						title={isEditing ? "Save" : "Edit"}
					>
						{isEditing ? <Check size={18} /> : <Pencil size={18} />}
					</button>
				)}
			</div>

			{isEditing ? (
				<div className="space-y-3">
					<input
						type="url"
						name="github"
						placeholder="GitHub URL"
						value={editedLinks.github || ""}
						onChange={handleChange}
						className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<input
						type="url"
						name="linkedin"
						placeholder="LinkedIn URL"
						value={editedLinks.linkedin || ""}
						onChange={handleChange}
						className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<input
						type="url"
						name="portfolio"
						placeholder="Portfolio URL"
						value={editedLinks.portfolio || ""}
						onChange={handleChange}
						className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
			) : (
				<div className="flex flex-wrap gap-4 mt-2">
					{initialLinks.github && (
						<a
							href={initialLinks.github}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
						>
							<Github size={22} />
							<span className="hidden sm:inline">GitHub</span>
						</a>
					)}
					{initialLinks.linkedin && (
						<a
							href={initialLinks.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
						>
							<Linkedin size={22} />
							<span className="hidden sm:inline">LinkedIn</span>
						</a>
					)}
					{initialLinks.portfolio && (
						<a
							href={initialLinks.portfolio}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
						>
							<Link size={22} />
							<span className="hidden sm:inline">Portfolio</span>
						</a>
					)}
					{!initialLinks.github && !initialLinks.linkedin && !initialLinks.portfolio && (
						<p className="text-base-content/60 italic">No social links added yet.</p>
					)}
				</div>
			)}
		</div>
	);
};

export default SocialLinksSection;
