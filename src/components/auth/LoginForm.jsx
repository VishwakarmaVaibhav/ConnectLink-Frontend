import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader, Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const queryClient = useQueryClient();

	const { mutate: loginMutation, isLoading } = useMutation({
		mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
		onSuccess: () => {
			toast.success("Logged in successfully!");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Something went wrong");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation({ usernameOrEmail: username, password });
	};

	return (
		<form onSubmit={handleSubmit} className='w-full max-w-md space-y-5'>
			<input
				type='text'
				placeholder='Username or Email'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
				required
			/>

			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 pr-12'
					required
				/>
				<button
					type='button'
					onClick={() => setShowPassword(!showPassword)}
					className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700'
				>
					{showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
				</button>
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed'
			>
				{isLoading ? <Loader className='animate-spin size-5' /> : "Login"}
			</button>
		</form>
	);
};

export default LoginForm;
