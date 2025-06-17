import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-120px)] text-center p-4 sm:p-8 bg-white shadow-xl rounded-lg">
      <img 
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" // A more thematic 404 image
        alt="Lost and Confused Illustration" 
        className="w-48 sm:w-64 h-auto mb-6 md:mb-8 rounded-lg" 
      />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1b998b] mb-3 md:mb-4">404</h1>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-3 md:mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-6 md:mb-8 text-sm sm:text-base max-w-md">
        Oops! The page you're looking for doesn't seem to exist... Maybe it was moved, or you mistyped the URL.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#1b998b] text-white font-semibold rounded-lg shadow-md hover:bg-[#157f71] transition-colors duration-150 text-sm sm:text-base"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;