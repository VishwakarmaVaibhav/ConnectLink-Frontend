import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<div className="bg-white rounded-xl shadow-lg sticky top-24 hidden lg:block overflow-hidden border border-gray-200">
			{/* Banner & Profile */}
			<div className="relative">
				<div
					className="h-20 bg-cover bg-center"
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
					}}
				/>
				<Link to={`/profile/${user.username}`}>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className="w-20 h-20 rounded-full border-4 border-white shadow-md absolute left-1/2 transform -translate-x-1/2 top-10"
					/>
				</Link>
			</div>

			{/* User Info */}
			<div className="pt-12 pb-4 px-4 text-center">
				<Link to={`/profile/${user.username}`}>
					<h2 className="text-lg font-semibold text-gray-800 hover:underline">{user.name}</h2>
				</Link>
				<p className="text-sm text-gray-500 truncate">{user.headline}</p>
				<p className="text-xs text-gray-400 mt-1">{user.connections.length} connections</p>
			</div>

			{/* Navigation Links */}
			<div className="border-t border-gray-100">
				<nav className="p-4">
					<ul className="space-y-2">
						<li>
							<Link
								to="/"
								className="flex items-center gap-3 text-gray-700 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
							>
								<Home size={20} /> <span>Home</span>
							</Link>
						</li>
						<li>
							<Link
								to="/network"
								className="flex items-center gap-3 text-gray-700 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
							>
								<UserPlus size={20} /> <span>My Network</span>
							</Link>
						</li>
						<li>
							<Link
								to="/notifications"
								className="flex items-center gap-3 text-gray-700 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
							>
								<Bell size={20} /> <span>Notifications</span>
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			{/* Profile CTA */}
			<div className="border-t border-gray-100 px-4 py-3 text-center">
				<Link
					to={`/profile/${user.username}`}
					className="text-sm font-medium text-blue-600 hover:underline"
				>
					Visit your profile
				</Link>
			</div>
		</div>
	);
}
