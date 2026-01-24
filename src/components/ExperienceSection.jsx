import { Briefcase, X, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState(userData.experience || []);
	const [newExperience, setNewExperience] = useState({
		title: "",
		company: "",
		startDate: "",
		endDate: "",
		description: "",
		currentlyWorking: false,
	});

	const handleAddExperience = () => {
		if (newExperience.title && newExperience.company && newExperience.startDate) {
			setExperiences([...experiences, newExperience]);

			setNewExperience({
				title: "",
				company: "",
				startDate: "",
				endDate: "",
				description: "",
				currentlyWorking: false,
			});
		}
	};

	const handleDeleteExperience = (id) => {
		setExperiences(experiences.filter((exp) => exp._id !== id));
	};

	const handleSave = () => {
		onSave({ experience: experiences });
		setIsEditing(false);
	};

	const handleCurrentlyWorkingChange = (e) => {
		setNewExperience({
			...newExperience,
			currentlyWorking: e.target.checked,
			endDate: e.target.checked ? "" : newExperience.endDate,
		});
	};

	return (
		<div className="bg-base-100 rounded-xl p-4 md:p-6 mb-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-base-content">Experience</h2>
				{isOwnProfile && (
					<button
						onClick={isEditing ? handleSave : () => setIsEditing(true)}
						className="text-base-content/60 hover:text-base-content/80"
						title={isEditing ? "Save" : "Edit"}
					>
						{isEditing ? <Check size={18} /> : <Pencil size={18} />}
					</button>
				)}
			</div>

			{experiences.map((exp) => (
				<div key={exp._id} className="mb-6 flex justify-between items-start">
					<div className="flex gap-3">
						<Briefcase size={20} className="text-base-content/70 mt-1" />
						<div>
							<p className="font-semibold text-base-content">{exp.title}</p>
							<p className="text-base-content/70 text-sm">{exp.company}</p>
							<p className="text-base-content/60 text-sm mb-1">
								{formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
							</p>
							{exp.description && (
								<p className="text-base-content/80 text-sm">{exp.description}</p>
							)}
						</div>
					</div>
					{isEditing && (
						<button onClick={() => handleDeleteExperience(exp._id)} className="text-red-500">
							<X size={18} />
						</button>
					)}
				</div>
			))}

			{isEditing && (
				<div className="mt-6 space-y-3">
					<input
						type="text"
						placeholder="Title"
						value={newExperience.title}
						onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
					/>
					<input
						type="text"
						placeholder="Company"
						value={newExperience.company}
						onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
					/>
					<input
						type="date"
						value={newExperience.startDate}
						onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
					/>

					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="currentlyWorking"
							checked={newExperience.currentlyWorking}
							onChange={handleCurrentlyWorkingChange}
							className="accent-primary"
						/>
						<label htmlFor="currentlyWorking" className="text-sm text-base-content/80">
							I currently work here
						</label>
					</div>

					{!newExperience.currentlyWorking && (
						<input
							type="date"
							value={newExperience.endDate}
							onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
							className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
						/>
					)}

					<textarea
						placeholder="Description"
						value={newExperience.description}
						onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 resize-none focus:outline-none focus:ring focus:ring-primary"
					/>

					<button
						onClick={handleAddExperience}
						className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary-dark transition"
					>
						Add Experience
					</button>
				</div>
			)}
		</div>
	);
};

export default ExperienceSection;
