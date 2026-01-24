import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-base-100 shadow-xl rounded-2xl p-8 border border-base-300">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-base-content mb-6">Privacy Policy</h1>
                <p className="text-base-content/60 mb-8">Last Updated: January 19, 2026</p>

                <div className="space-y-6 text-base-content/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">1. Introduction</h2>
                        <p>
                            Welcome to ConnectLink.social ("ConnectLink"). We value your privacy and are committed to protecting your personal data.
                            This policy explains how we collect, use, and safeguard your information when you use our networking platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">2. Information We Collect</h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Personal Information:</strong> Name, email address, username, profile picture, and professional details (skills, experience, education).</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our platform, including posts, connections, and search queries.</li>
                            <li><strong>Cookies:</strong> We use cookies to manage sessions and improve your experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">3. How We Use Your Information</h2>
                        <p>
                            We use your data to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>Provide and improve the ConnectLink platform.</li>
                            <li>Facilitate networking between students, alumni, and teachers.</li>
                            <li>Send important account notifications and updates.</li>
                            <li>Ensure the security and integrity of our services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">4. Data Sharing</h2>
                        <p>
                            We do not sell your personal data. We may share information with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Service Providers:</strong> Third-party partners who help us operate the platform (e.g., cloud hosting, email services).</li>
                            <li><strong>Legal Requirements:</strong> If required by law or to protect our rights and safety.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">6. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information. You can manage your profile settings or contact us for assistance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@connectlink.social.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
