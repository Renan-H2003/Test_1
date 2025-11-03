import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';
import { SunIcon, MoonIcon, LogoutIcon, ProfileIcon, SearchIcon, AnalysisIcon, UserCircleIcon } from './common/icons';
import ProfileForm from './ProfileForm';
import CareerAnalysis from './CareerAnalysis';
import CareerSearch from './CareerSearch';
import Footer from './common/Footer';
import { UserProfile, CareerPath } from '../types';

type View = 'profile' | 'analysis' | 'search';

const Dashboard: React.FC = () => {
    const [view, setView] = useState<View>('profile');
    
    // Simulating database persistence with localStorage.
    // In a real application, this data would be fetched from and saved to a backend database like PostgreSQL.
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            return savedProfile ? JSON.parse(savedProfile) : null;
        } catch (error) {
            console.error("Failed to parse user profile from localStorage", error);
            return null;
        }
    });

    const [analysisResult, setAnalysisResult] = useState<CareerPath[] | null>(null);
    
    const auth = useContext(AuthContext) as AuthContextType;
    const themeContext = useContext(ThemeContext) as ThemeContextType;

    useEffect(() => {
        // If a profile exists, default to the analysis view. If not, prompt to create one.
        if (userProfile && !analysisResult) { // check for analysis result to avoid re-running analysis unnecesarily
             setView('analysis');
        } else if (!userProfile) {
            setView('profile');
        }
    }, []); // Run only on initial component mount

    const handleProfileSubmit = (profile: UserProfile, result: CareerPath[]) => {
        setUserProfile(profile);
        setAnalysisResult(result);
        localStorage.setItem('userProfile', JSON.stringify(profile)); // Save to "DB"
        setView('analysis');
    };

    const renderView = () => {
        switch (view) {
            case 'profile':
                return <ProfileForm onProfileSubmit={handleProfileSubmit} initialProfile={userProfile} />;
            case 'analysis':
                return <CareerAnalysis analysisResult={analysisResult} userProfile={userProfile} />;
            case 'search':
                return <CareerSearch userProfile={userProfile} />;
            default:
                return <ProfileForm onProfileSubmit={handleProfileSubmit} initialProfile={userProfile} />;
        }
    };
    
    const NavItem: React.FC<{
        icon: React.ReactNode;
        label: string;
        active: boolean;
        onClick: () => void;
        disabled?: boolean;
    }> = ({ icon, label, active, onClick, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                active
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 flex flex-col justify-between shadow-lg">
                    <div>
                        <div className="flex items-center justify-center mb-8">
                            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Career Compass</h1>
                        </div>
                        <nav className="space-y-2">
                            <NavItem icon={<ProfileIcon className="w-6 h-6"/>} label="My Profile" active={view === 'profile'} onClick={() => setView('profile')} />
                            <NavItem icon={<AnalysisIcon className="w-6 h-6"/>} label="Career Analysis" active={view === 'analysis'} onClick={() => setView('analysis')} disabled={!userProfile} />
                            <NavItem icon={<SearchIcon className="w-6 h-6"/>} label="Search Careers" active={view === 'search'} onClick={() => setView('search')} disabled={!userProfile} />
                        </nav>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center p-2 text-gray-600 dark:text-gray-300">
                            <UserCircleIcon className="w-6 h-6" />
                            <span className="ml-3 text-sm font-medium truncate">{auth.user?.email}</span>
                        </div>
                        <button
                            onClick={themeContext.toggleTheme}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            {themeContext.theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                            <span className="ml-3">Toggle Theme</span>
                        </button>
                        <button
                            onClick={auth.logout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                            <LogoutIcon className="w-6 h-6" />
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </aside>
                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Welcome, {userProfile?.name?.split(' ')[0] || 'User'}!
                        </h2>
                        {userProfile?.dp ? (
                            <img src={userProfile.dp} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-md" />
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        )}
                    </header>
                    {renderView()}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;