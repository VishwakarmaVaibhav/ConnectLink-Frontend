import { School, X, Pencil, Check } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [educations, setEducations] = useState(userData.education || []);
	const [newEducation, setNewEducation] = useState({
		school: "",
		fieldOfStudy: "",
		startYear: "",
		endYear: "",
	});

	const handleAddEducation = () => {
		if (newEducation.school && newEducation.fieldOfStudy && newEducation.startYear) {
			setEducations([...educations, newEducation]);
			setNewEducation({
				school: "",
				fieldOfStudy: "",
				startYear: "",
				endYear: "",
			});
		}
	};

	const handleDeleteEducation = (id) => {
		setEducations(educations.filter((edu) => edu._id !== id));
	};

	const handleSave = () => {
		onSave({ education: educations });
		setIsEditing(false);
	};

	return (
		<div className="bg-base-100 rounded-xl p-4 md:p-6 mb-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-base-content">Education</h2>
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

			{educations.length === 0 && !isEditing && (
				<p className="text-base-content/60 italic">No education details added.</p>
			)}

			{educations.map((edu) => (
				<div key={edu._id} className="mb-5 flex justify-between items-start">
					<div className="flex gap-3">
						<School size={20} className="text-base-content/70 mt-1" />
						<div>
							<p className="font-semibold text-base-content">{edu.fieldOfStudy}</p>
							<p className="text-base-content/70 text-sm">{edu.school}</p>
							<p className="text-base-content/60 text-sm">
								{edu.startYear} – {edu.endYear || "Present"}
							</p>
						</div>
					</div>
					{isEditing && (
						<button onClick={() => handleDeleteEducation(edu._id)} className="text-red-500">
							<X size={18} />
						</button>
					)}
				</div>
			))}

			{isEditing && (
				<div className="mt-4 space-y-3">
					<input
						type="text"
						placeholder="School"
						value={newEducation.school}
						onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
					/>
					<input
						type="text"
						placeholder="Field of Study"
						value={newEducation.fieldOfStudy}
						onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
					/>
					<input
						type="number"
						placeholder="Start Year"
						value={newEducation.startYear}
						onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
					/>
					<input
						type="number"
						placeholder="End Year (optional)"
						value={newEducation.endYear}
						onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
						className="w-full px-4 py-2 rounded bg-base-200 focus:outline-none focus:ring focus:ring-primary"
					/>

					<button
						onClick={handleAddEducation}
						className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary-dark transition"
					>
						Add Education
					</button>
				</div>
			)}
		</div>
	);
};

export default EducationSection;
