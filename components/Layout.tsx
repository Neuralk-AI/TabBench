
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useLocation, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  return (
    <header className="md:hidden bg-slate-50 shadow-md sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
           <img 
            src="https://cdn-images.welcometothejungle.com/v82GguLLmnQoPY4v0Gu9ZTGrzAwtFaKjAd0pF-mNsFw/resize:auto:400::/czM6Ly93dHRqLXByb2R1Y3Rpb24vYWNjb3VudHMvdXBsb2Fkcy9vcmdhbml6YXRpb25zL2xvZ29zL2E5MWQ5M2U5MWMyNDYyZjA0MzNjMTc0Zjc0YjNjMjMwLzU2NmZkOTBjLTY2M2ItNDJlZC04N2I4LTVmMGIwYTg1NGU0NS5wbmc" 
            alt="TabBench Logo" 
            className="h-10 w-auto object-contain" 
          />
          <span className="text-lg font-semibold text-[#1b998b]">TabBench</span>
        </Link>
        <button
          onClick={onToggleSidebar}
          className="text-slate-600 hover:text-[#1b998b] focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    // Close sidebar on route change on mobile
    closeSidebar();
  }, [location.pathname]);
  
  // Effect to manage body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) { // md breakpoint
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [isSidebarOpen]);


  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Mobile Header */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <div className="animate-fadeIn">
         {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;