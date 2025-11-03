import React from 'react';
import Footer from './common/Footer';
import { AnalysisIcon, ProfileIcon, SearchIcon } from './common/icons';

interface HomePageProps {
    onSignIn: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onSignIn }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="w-full bg-white dark:bg-gray-800 shadow-md z-10">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Career Compass AI</h1>
                    <button
                        onClick={onSignIn}
                        className="bg-primary-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
                    >
                        Sign In / Sign Up
                    </button>
                </nav>
            </header>

            <main className="flex-grow">
                <section className="text-center py-20 px-6 bg-white dark:bg-gray-800">
                    <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Find Your Future, Today.</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
                        Our AI-powered platform analyzes your unique skills and qualifications to illuminate the best career paths for you. Stop guessing, start planning.
                    </p>
                    <button
                        onClick={onSignIn}
                        className="bg-primary-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-primary-700 transition-transform transform hover:scale-105 duration-300 shadow-lg"
                    >
                        Get Started
                    </button>
                </section>

                <section className="py-20 px-6">
                    <div className="container mx-auto">
                        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<ProfileIcon className="w-6 h-6" />}
                                title="Build Your Profile"
                                description="Provide your qualifications, skills, and resume details to create a comprehensive professional snapshot."
                            />
                            <FeatureCard 
                                icon={<AnalysisIcon className="w-6 h-6" />}
                                title="Get AI Analysis"
                                description="Our advanced AI evaluates your profile to generate personalized career recommendations and detailed roadmaps."
                            />
                            <FeatureCard 
                                icon={<SearchIcon className="w-6 h-6" />}
                                title="Explore & Succeed"
                                description="Search for specific careers or follow our guided paths to acquire new skills and achieve your goals."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;