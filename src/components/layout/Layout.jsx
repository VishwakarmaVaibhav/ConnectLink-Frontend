import Navbar from "./Navbar";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 text-black">
			{/* Navbar */}
			<header className="shadow-sm sticky top-0 z-50 bg-white">
				<Navbar />
			</header>

			{/* Main Content - No padding, full width */}
			<main className="flex-1 w-full">
				{children}
			</main>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
				© {new Date().getFullYear()} ConnectLink. All rights reserved.
			</footer>
		</div>
	);
};

export default Layout;
