import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-blue-100 to-purple-100 px-4">
			<div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md animate-fade-in-up">
				<div className="text-center mb-6">
					<img className="mx-auto h-20 w-auto" src="./small-logo.png" alt="ConnectLink" />
					<h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">Sign in to your account</h2>
					<p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
				</div>

				{/* Login Form Component */}
				<LoginForm />

				<div className="mt-8">
					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">New to ConnectLink?</span>
						</div>
					</div>
					<Link
						to="/signup"
						className="w-full inline-flex justify-center items-center py-2 px-4 border border-blue-500 text-blue-600 rounded-lg shadow-sm text-sm font-medium hover:bg-blue-50 transition-colors"
					>
						Join now
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
