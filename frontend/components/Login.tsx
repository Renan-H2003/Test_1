
import React, { useState, useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const auth = useContext(AuthContext) as AuthContextType;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock sending OTP
        setIsOtpSent(true);
    };
    
    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock OTP verification and login
        if (otp === '123456') { // Mock OTP
            auth.login(email);
        } else {
            alert('Invalid OTP. Please use 123456 to continue.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">Career Compass AI</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Your Personal guide to professional success.</p>
                </div>

                {!isOtpSent ? (
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="********"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-white font-semibold bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
                        >
                            Sign in / Sign up
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleVerifyOtp}>
                        <p className="text-center text-gray-600 dark:text-gray-400">An OTP has been sent to {email}. (Hint: use 123456)</p>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter OTP</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="6-digit code"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-white font-semibold bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
                        >
                            Verify & Continue
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
