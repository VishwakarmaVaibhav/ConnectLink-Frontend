import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
	if (!user) {
		return (
			<div className="bg-base-100 rounded-xl shadow-lg sticky top-24 hidden lg:block overflow-hidden border border-base-300 p-4 text-center">
				<h2 className="text-xl font-bold text-base-content mb-2">New to ConnectLink?</h2>
				<p className="text-base-content/70 mb-4 text-sm">Sign up now to connect with alumni, students, and teachers!</p>
				<Link to="/signup" className="block w-full bg-primary text-primary-content font-semibold py-2 rounded-full hover:bg-primary-focus transition duration-300 mb-2">
					Sign Up
				</Link>
				<Link to="/login" className="block w-full border border-primary text-primary font-semibold py-2 rounded-full hover:bg-primary/10 transition duration-300">
					Log In
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-base-100 rounded-xl shadow-lg sticky top-24 hidden lg:block overflow-hidden border border-base-300">
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
					<h2 className="text-lg font-semibold text-base-content hover:text-primary transition-colors">{user.name}</h2>
				</Link>
				<p className="text-sm text-base-content/60 truncate">{user.headline}</p>
				<p className="text-xs text-base-content/50 mt-1">{user.connections.length} connections</p>
			</div>

			{/* Navigation Links */}
			<div className="border-t border-base-300">
				<nav className="p-4">
					<ul className="space-y-2">
						<li>
							<Link
								to="/"
								className="flex items-center gap-3 text-base-content/80 px-3 py-2 rounded-lg hover:bg-base-200 hover:text-primary transition-colors"
							>
								<Home size={20} /> <span>Home</span>
							</Link>
						</li>
						<li>
							<Link
								to="/network"
								className="flex items-center gap-3 text-base-content/80 px-3 py-2 rounded-lg hover:bg-base-200 hover:text-primary transition-colors"
							>
								<UserPlus size={20} /> <span>My Network</span>
							</Link>
						</li>
						<li>
							<Link
								to="/notifications"
								className="flex items-center gap-3 text-base-content/80 px-3 py-2 rounded-lg hover:bg-base-200 hover:text-primary transition-colors"
							>
								<Bell size={20} /> <span>Notifications</span>
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			{/* Profile CTA */}
			<div className="border-t border-base-300 px-4 py-3 text-center">
				<Link
					to={`/profile/${user.username}`}
					className="text-sm font-medium text-primary hover:underline"
				>
					Visit your profile
				</Link>
			</div>
		</div>
	);
}
