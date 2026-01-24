import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-base-100 shadow-xl rounded-2xl p-8 border border-base-300">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-base-content mb-6">Terms and Conditions</h1>
                <p className="text-base-content/60 mb-8">Last Updated: January 19, 2026</p>

                <div className="space-y-6 text-base-content/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using ConnectLink.social, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">2. User Accounts</h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>You must provide accurate and complete information when creating an account.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You must notify us immediately of any unauthorized use of your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">3. User Conduct</h2>
                        <p>
                            You agree not to use the platform for any unlawful or prohibited activities, including but not limited to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>Harassing, abusing, or harming others.</li>
                            <li>Posting false, misleading, or inappropriate content.</li>
                            <li>Attempting to compromise the security of the platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">4. Intellectual Property</h2>
                        <p>
                            The content, features, and functionality of ConnectLink are owned by us and are protected by copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">5. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">6. Limitation of Liability</h2>
                        <p>
                            ConnectLink shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">7. Changes to Terms</h2>
                        <p>
                            We may modify these Terms at any time. Your continued use of the platform constitutes acceptance of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-base-content mb-3">8. Contact Us</h2>
                        <p>
                            For any questions regarding these Terms, please contact us at support@connectlink.social.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
