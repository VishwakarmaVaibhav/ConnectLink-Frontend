import { X, Pencil, Check } from "lucide-react";
import { useState } from "react";

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [skills, setSkills] = useState(userData.skills || []);
	const [newSkill, setNewSkill] = useState("");

	const handleAddSkill = () => {
		if (newSkill.trim() && !skills.includes(newSkill.trim())) {
			setSkills([...skills, newSkill.trim()]);
			setNewSkill("");
		}
	};

	const handleDeleteSkill = (skill) => {
		setSkills(skills.filter((s) => s !== skill));
	};

	const handleSave = () => {
		onSave({ skills });
		setIsEditing(false);
	};

	return (
		<div className="p-4 md:p-6 bg-white rounded-xl">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">Skills</h2>
				{isOwnProfile && (
					<button
						onClick={isEditing ? handleSave : () => setIsEditing(true)}
						className="text-gray-500 hover:text-gray-700 transition"
						title={isEditing ? "Save" : "Edit"}
					>
						{isEditing ? <Check size={18} /> : <Pencil size={18} />}
					</button>
				)}
			</div>

			<div className="flex flex-wrap gap-2">
				{skills.length > 0 ? (
					skills.map((skill, index) => (
						<span
							key={index}
							className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
						>
							{skill}
							{isEditing && (
								<button onClick={() => handleDeleteSkill(skill)} className="text-red-500 hover:text-red-600">
									<X size={14} />
								</button>
							)}
						</span>
					))
				) : (
					<p className="text-gray-500 italic">No skills added yet.</p>
				)}
			</div>

			{isEditing && (
				<div className="flex items-center gap-2 mt-4">
					<input
						type="text"
						placeholder="New Skill"
						value={newSkill}
						onChange={(e) => setNewSkill(e.target.value)}
						className="flex-grow px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
					/>
					<button
						onClick={handleAddSkill}
						className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
					>
						Add
					</button>
				</div>
			)}
		</div>
	);
};

export default SkillsSection;
