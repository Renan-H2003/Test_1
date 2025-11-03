import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                &copy; {currentYear} Carnivores. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;