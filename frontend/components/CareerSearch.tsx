
import React, { useState } from 'react';
import { UserProfile, CareerPath } from '../types';
import { searchCareerPath } from '../services/geminiService';
import Spinner from './common/Spinner';
import CareerAnalysis from './CareerAnalysis';

interface CareerSearchProps {
    userProfile: UserProfile | null;
}

const CareerSearch: React.FC<CareerSearchProps> = ({ userProfile }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CareerPath[] | null>(null);

    if (!userProfile) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400">Please complete your profile first to use the career search feature.</p>
            </div>
        );
    }
    
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const searchResult = await searchCareerPath(userProfile, query);
            setResult(searchResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">Explore Career Paths</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Have a specific career in mind? Enter it below to get a personalized roadmap based on your profile.
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-2xl mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'Software Engineer', 'Data Scientist', 'UX Designer'"
                    className="flex-grow px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-6 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-all duration-200"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            
            <div className="mt-8">
                {loading && <div className="flex items-center justify-center h-full"><Spinner message={`Generating roadmap for ${query}...`} /></div>}
                {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}
                {result && <CareerAnalysis analysisResult={result} userProfile={userProfile} />}
            </div>
        </div>
    );
};

export default CareerSearch;
