import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { useState, useEffect } from "react";

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-indigo-200/25 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-float"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-12">
        <div className={`bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 
                        p-8 sm:p-12 w-full max-w-md transition-all duration-1000 transform
                        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <img 
                className="relative mx-auto h-16 w-auto transform hover:scale-110 transition-transform duration-300" 
                src="./small-logo.png" 
                alt="ConnectLink" 
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 
                          bg-clip-text text-transparent mb-3 animate-fadeInUp">
              Welcome Back
            </h1>
            
            <p className="text-base-content/70 text-base font-medium animate-fadeInUp delay-200">
              Sign in to continue your networking journey
            </p>
          </div>

          {/* Login Form */}
          <div className="animate-fadeInUp delay-400">
            <LoginForm />
          </div>

          {/* Divider */}
          <div className="mt-8 mb-6 animate-fadeInUp delay-600">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-base-100/80 px-4 text-base-content/60 font-medium">New to ConnectLink?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="animate-fadeInUp delay-800">
            <Link
              to="/signup"
              className="group w-full inline-flex justify-center items-center py-3 px-6 
                       border-2 border-transparent bg-gradient-to-r from-blue-50 to-purple-50 
                       text-blue-700 rounded-xl font-semibold text-sm 
                       hover:from-blue-100 hover:to-purple-100 hover:border-blue-200
                       transform hover:scale-[1.02] transition-all duration-300 
                       focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <span className="mr-2">Create your account</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4 animate-fadeInUp delay-1000">
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="text-base-content/60 hover:text-blue-600 transition-colors duration-300 font-medium">
                Privacy Policy
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-base-content/60 hover:text-blue-600 transition-colors duration-300 font-medium">
                Terms of Service
              </a>
            </div>
            
           
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-16 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-24 left-16 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-12 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-30px) rotate(-180deg); 
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(90deg); 
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-1000 { animation-delay: 1s; }
        
        /* Glassmorphism effect */
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;