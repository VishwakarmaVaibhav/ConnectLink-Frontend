import { Component } from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-6 bg-red-100 text-red-700 rounded-md">
					<h2 className="text-xl font-semibold">Something went wrong.</h2>
					<p>Please refresh the page or try again later.</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
