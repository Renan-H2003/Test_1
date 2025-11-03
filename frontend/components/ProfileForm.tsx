import React, { useState, useEffect } from 'react';
import { UserProfile, CareerPath } from '../types';
import { analyzeCareerPaths } from '../services/geminiService';
import Spinner from './common/Spinner';
import { UserCircleIcon } from './common/icons';

interface ProfileFormProps {
    onProfileSubmit: (profile: UserProfile, result: CareerPath[]) => void;
    initialProfile: UserProfile | null;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileSubmit, initialProfile }) => {
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        degree: '',
        qualifications: '',
        cvText: '',
        skills: '',
        dp: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Pre-fill form if existing profile data is provided
        if (initialProfile) {
            setProfile(initialProfile);
        }
    }, [initialProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, dp: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // In a real app with a DB, this would be a PUT (update) or POST (create) request.
            // Here, we just call the analysis service.
            const result = await analyzeCareerPaths(profile);
            onProfileSubmit(profile, result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const isFormIncomplete = !profile.name || !profile.degree || !profile.qualifications || !profile.cvText || !profile.skills;

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Spinner message={initialProfile ? "Re-analyzing your profile..." : "Analyzing your profile..."} /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {initialProfile ? 'Edit Your Professional Profile' : 'Create Your Professional Profile'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                {initialProfile ? 'Update your details below to refine your career guidance.' : 'Fill out your details below. The more information you provide, the more accurate your career guidance will be.'}
            </p>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-6">
                    {profile.dp ? (
                        <img src={profile.dp} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                        <UserCircleIcon className="w-24 h-24 text-gray-300 dark:text-gray-600" />
                    )}
                    <div>
                        <label htmlFor="dp-upload" className="cursor-pointer bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">Upload Photo</label>
                        <input id="dp-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" />
                    </div>
                    <div>
                        <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Degree / Field of Study</label>
                        <input type="text" name="degree" id="degree" value={profile.degree} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" />
                    </div>
                </div>

                <div>
                    <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qualifications & Achievements</label>
                    <textarea name="qualifications" id="qualifications" rows={4} value={profile.qualifications} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" placeholder="e.g., Certifications, Awards, Published Papers"></textarea>
                </div>
                 <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                    <textarea name="skills" id="skills" rows={3} value={profile.skills} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" placeholder="e.g., React, Python, Data Analysis, Project Management"></textarea>
                </div>
                <div>
                    <label htmlFor="cvText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Paste CV/Resume Content</label>
                    <textarea name="cvText" id="cvText" rows={10} value={profile.cvText} onChange={handleChange} required className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" placeholder="Paste the full text of your CV here for a detailed analysis."></textarea>
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div className="text-right">
                    <button type="submit" disabled={isFormIncomplete || loading} className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {initialProfile ? 'Update & Re-Analyze' : 'Analyze & Find My Career Paths'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;