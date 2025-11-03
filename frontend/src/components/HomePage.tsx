import React from 'react';
import Footer from './Footer';
import { AnalysisIcon, ProfileIcon, SearchIcon } from './icons';

interface HomePageProps {
  onSignIn: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => (
  <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onSignIn }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <header className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg z-10 sticky top-0">
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Career Compass AI
          </h1>
          <button
            onClick={onSignIn}
            className="btn-primary"
            data-testid="signin-button"
          >
            Sign In / Sign Up
          </button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="text-center py-24 px-6">
          <div className="container mx-auto">
            <h2 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
              Find Your Future, Today.
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Our AI-powered platform analyzes your unique skills and qualifications to illuminate the best career paths for you. Stop guessing, start planning.
            </p>
            <button
              onClick={onSignIn}
              className="btn-primary text-lg px-10 py-4"
              data-testid="get-started-button"
            >
              Get Started
            </button>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<ProfileIcon className="w-8 h-8" />}
                title="Build Your Profile"
                description="Upload your CV and provide your qualifications, skills, and Gemini API key to create a comprehensive professional snapshot."
              />
              <FeatureCard 
                icon={<AnalysisIcon className="w-8 h-8" />}
                title="Get AI Analysis"
                description="Our Gemini AI evaluates your profile to generate personalized career recommendations and detailed roadmaps."
              />
              <FeatureCard 
                icon={<SearchIcon className="w-8 h-8" />}
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