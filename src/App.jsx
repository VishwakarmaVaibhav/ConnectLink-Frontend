import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import ErrorBoundary from "./components/ErrorBoundary"; // ✅ import this
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
function App() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

	if (isLoading) return null;

	return (
		<Layout>
			<Routes>
				<Route
					path="/"
					element={
						authUser ? (
							<ErrorBoundary>
								<HomePage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/login"} />
						)
					}
				/>
				<Route
					path="/signup"
					element={
						!authUser ? (
							<ErrorBoundary>
								<SignUpPage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/"} />
						)
					}
				/>
				<Route
					path="/login"
					element={
						!authUser ? (
							<ErrorBoundary>
								<LoginPage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/"} />
						)
					}
				/>
				<Route
					path="/notifications"
					element={
						authUser ? (
							<ErrorBoundary>
								<NotificationsPage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/login"} />
						)
					}
				/>
				<Route
					path="/network"
					element={
						authUser ? (
							<ErrorBoundary>
								<NetworkPage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/login"} />
						)
					}
				/>
				<Route
					path="/post/:postId"
					element={
						authUser ? (
							<ErrorBoundary>
								<PostPage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/login"} />
						)
					}
				/>
				<Route
					path="/profile/:username"
					element={
						authUser ? (
							<ErrorBoundary>
								<ProfilePage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/login"} />
						)
					}
				/>
				 <Route path="/verify-email" element={<VerifyEmailPage />} />
				 <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
				<Route
					path="/search"
					element={
						authUser ? (
							<ErrorBoundary>
								<SearchPage />
							</ErrorBoundary>
						) : (
							<Navigate to={"/login"} />
						)
					}
				/>
			</Routes>
			<Toaster />
		</Layout>
	);
}

export default App;
