const LoadingSpinner = ({ size = "md" }) => {
    const sizeClasses = {
        sm: "w-5 h-5 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
        xl: "w-16 h-16 border-4",
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} rounded-full animate-spin border-base-300 border-t-blue-600`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
