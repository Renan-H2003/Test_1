import React, { useState } from 'react';
import { CareerPath, UserProfile } from '../types';
import { ChevronDownIcon, CheckCircleIcon } from './common/icons';

interface CareerAnalysisProps {
    analysisResult: CareerPath[] | null;
    userProfile: UserProfile | null;
}

const CareerAnalysis: React.FC<CareerAnalysisProps> = ({ analysisResult, userProfile }) => {
    // Default to the first path being open, or null if no results.
    const [openIndex, setOpenIndex] = useState<number | null>(analysisResult && analysisResult.length > 0 ? 0 : null);

    if (!userProfile) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
                <p className="text-gray-600 dark:text-gray-400">Please complete your profile first to get your personalized career analysis.</p>
            </div>
        );
    }
    
    if (!analysisResult) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Analysis Not Available</h2>
                <p className="text-gray-600 dark:text-gray-400">There is no career analysis to display. Please generate one from your profile page.</p>
            </div>
        )
    }

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">Your Personalized Career Analysis</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Based on your profile, here are the top career paths we recommend for you, {userProfile.name}.
                </p>
            </div>
            
            <div className="space-y-4">
                {analysisResult.map((path, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex justify-between items-center p-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">{path.career_path}</h3>
                            <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} />
                        </button>
                        
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-[2000px]' : 'max-h-0'}`}>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-gray-700 dark:text-gray-300 mb-6 italic"><strong>Why it's a good fit:</strong> {path.suitability_reason}</p>

                                <div className="mb-8">
                                    <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {path.required_skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Your Roadmap to Success</h4>
                                    <div className="space-y-6">
                                        {path.roadmap.sort((a,b) => a.step - b.step).map((step, i) => (
                                            <div key={i} className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 flex flex-col items-center">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-primary-500 text-white rounded-full font-bold text-lg">
                                                        {step.step}
                                                    </div>
                                                    {i < path.roadmap.length -1 && <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 mt-2"></div>}
                                                </div>
                                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg flex-1 shadow">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{step.action}</p>
                                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{step.details}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex items-start space-x-4">
                                            <CheckCircleIcon className="w-10 h-10 text-green-500 flex-shrink-0" />
                                            <p className="font-semibold text-lg text-gray-800 dark:text-gray-100 pt-2">Goal Achieved!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerAnalysis;