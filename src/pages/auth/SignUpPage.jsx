import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-blue-100 to-purple-100 px-4">
			<div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md animate-fade-in-up">
				<div className="text-center mb-6">
					<img className="mx-auto h-20 w-20" src="./small-logo.png" alt="ConnectLink" />
					<h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
						Make the most of your professional life
					</h2>
					<p className="text-sm text-gray-500 mt-1">Join ConnectLink today, it's free!</p>
				</div>

				{/* Sign Up Form Component */}
				<SignUpForm />

				<div className="mt-8">
					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">Already on ConnectLink?</span>
						</div>
					</div>
					<Link
						to="/login"
						className="w-full inline-flex justify-center items-center py-2 px-4 border border-blue-500 text-blue-600 rounded-lg shadow-sm text-sm font-medium hover:bg-blue-50 transition-colors"
					>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
