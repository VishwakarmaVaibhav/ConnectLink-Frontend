import { useState } from "react";
import { Pencil, X, Plus, Check } from "lucide-react";

const MiniProjectsSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [projects, setProjects] = useState(userData.miniProjects || []);

	const handleChange = (index, field, value) => {
		const updated = [...projects];
		updated[index][field] = value;
		setProjects(updated);
	};

	const handleAddProject = () => {
		setProjects([...projects, { title: "", description: "", projectLink: "" }]);
	};

	const handleRemoveProject = (index) => {
		const updated = [...projects];
		updated.splice(index, 1);
		setProjects(updated);
	};

	const handleSave = () => {
		onSave({ miniProjects: projects });
		setIsEditing(false);
	};

	if (!projects.length && !isOwnProfile) return null;

	return (
		<div className="bg-base-100 p-4 md:p-6 rounded-xl mb-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-base-content">Mini Projects</h2>
				{isOwnProfile && (
					<button
						onClick={isEditing ? handleSave : () => setIsEditing(true)}
						className="text-base-content/60 hover:text-base-content/80"
						title={isEditing ? "Save Projects" : "Edit Projects"}
					>
						{isEditing ? <Check size={18} /> : <Pencil size={18} />}
					</button>
				)}
			</div>

			{isEditing ? (
				<div className="space-y-6">
					{projects.map((project, index) => (
						<div key={index} className="bg-base-200 p-4 rounded-md space-y-3 relative">
							<button
								onClick={() => handleRemoveProject(index)}
								className="absolute top-2 right-2 text-red-500 hover:text-red-700"
							>
								<X size={16} />
							</button>
							<input
								type="text"
								placeholder="Project Title"
								value={project.title}
								onChange={(e) => handleChange(index, "title", e.target.value)}
								className="w-full bg-base-100 border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-primary/50"
							/>
							<textarea
								placeholder="Project Description"
								value={project.description}
								onChange={(e) => handleChange(index, "description", e.target.value)}
								className="w-full bg-base-100 border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-primary/50"
							/>
							<input
								type="url"
								placeholder="Project Link"
								value={project.projectLink}
								onChange={(e) => handleChange(index, "projectLink", e.target.value)}
								className="w-full bg-base-100 border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-primary/50"
							/>
						</div>
					))}

					<div className="flex flex-wrap gap-3">
						<button
							onClick={handleAddProject}
							className="flex items-center gap-2 bg-base-200 hover:bg-gray-200 text-sm px-4 py-2 rounded-md"
						>
							<Plus size={16} />
							Add Project
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-5">
					{projects.map((project, index) => (
						<div key={index} className="bg-base-200 rounded-md p-4">
							<h3 className="text-lg font-semibold text-base-content">{project.title}</h3>
							<p className="text-base-content/70 mt-1">{project.description}</p>
							{project.projectLink && (
								<a
									href={project.projectLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block text-primary mt-2 hover:underline"
								>
									View Project →
								</a>
							)}
						</div>
					))}

					{isOwnProfile && !isEditing && (
						<button
							onClick={() => setIsEditing(true)}
							className="mt-4 text-sm text-blue-600 hover:underline"
						>
							Edit Projects
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default MiniProjectsSection;
