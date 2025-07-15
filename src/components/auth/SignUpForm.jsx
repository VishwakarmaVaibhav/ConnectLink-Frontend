import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const SignUpForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const queryClient = useQueryClient();

	const { mutate: signUpMutation, isLoading } = useMutation({
		mutationFn: async (data) => {
			const res = await axiosInstance.post("/auth/signup", data);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Something went wrong");
		},
	});

	const handleSignUp = (e) => {
		e.preventDefault();
		signUpMutation({ name, username, email, password });
	};

	return (
		<form
			onSubmit={handleSignUp}
			className='flex flex-col gap-5 w-full'
		>
			<input
				type='text'
				placeholder='Full name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
				required
			/>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
				required
			/>
			<input
				type='password'
				placeholder='Password (6+ characters)'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
				required
			/>

			<button
				type='submit'
				disabled={isLoading}
				className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed'
			>
				{isLoading ? <Loader className='animate-spin size-5' /> : "Agree & Join"}
			</button>
		</form>
	);
};

export default SignUpForm;
