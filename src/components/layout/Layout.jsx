import Navbar from "./Navbar";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col bg-base-200 text-base-content transition-colors duration-300">
			{/* Navbar */}
			<header className="shadow-sm sticky top-0 z-50 bg-base-100">
				<Navbar />
			</header>

			{/* Main Content - No padding, full width */}
			<main className="flex-1 w-full">
				{children}
			</main>

			{/* Footer */}
			<footer className="bg-base-100 border-t border-base-300 py-4 text-center text-sm text-base-content/60">
				© {new Date().getFullYear()} ConnectLink. All rights reserved.
			</footer>
		</div>
	);
};

export default Layout;
