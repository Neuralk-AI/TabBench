
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void; // For closing sidebar on mobile nav
  isParentActive?: boolean;
  isExternal?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon, onClick, isParentActive = false, isExternal = false }) => {
  const location = useLocation();
  const isActive = !isExternal && (location.pathname === to || (isParentActive && location.pathname.startsWith(to) && location.pathname !== to));
  const isCurrentPage = !isExternal && location.pathname === to;

  const baseStyle = "flex items-center px-4 py-3 rounded-lg transition-colors duration-150 text-base"; // Changed text-sm to text-base
  const activeStyle = "bg-slate-200 text-slate-800 shadow-md"; 
  const inactiveStyle = "text-slate-700 hover:bg-slate-100 hover:text-[#1b998b]";
  const parentActiveStyle = "bg-slate-100 text-[#1b998b]";

  let combinedClassName = `${baseStyle} `;
  if (isCurrentPage) {
    combinedClassName += activeStyle;
  } else if (isActive) { 
    combinedClassName += parentActiveStyle;
  } else {
    combinedClassName += inactiveStyle;
  }
  
  if (isExternal) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyle} ${inactiveStyle}`} 
        onClick={onClick}
      >
        {icon && <span className="mr-3 shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={combinedClassName}
      onClick={onClick}
      aria-current={isCurrentPage ? 'page' : undefined}
    >
      {icon && <span className="mr-3 shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </Link>
  );
};


const industrialUseCases = [
  { name: 'Product Categorization', slug: 'product-categorization' },
  { name: 'Deduplication', slug: 'deduplication' },
];

const IndustrialSubMenu: React.FC<{onClick?: () => void}> = ({ onClick }) => {
  const location = useLocation();
  return (
    <ul className="pl-5 mt-1 space-y-1 ml-3 border-l border-slate-300">
      {industrialUseCases.map(uc => {
        const toPath = `/industrial/${uc.slug}`;
        const isActive = location.pathname === toPath;
        return (
          <li key={uc.slug}>
            <Link
              to={toPath}
              onClick={onClick}
              className={`block px-3 py-2 text-base rounded-md truncate ${ // Changed text-sm to text-base
                isActive 
                  ? 'bg-slate-200 text-slate-800' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {uc.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

// SVG Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
  </svg>
);
const IndustrialIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
  </svg>
);
const AcademicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.01 3.007A53.634 53.634 0 0012 13.489" 
    />
  </svg>
);
const NotebookIcon = () => ( 
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v4m-2-2h4" />
  </svg>
);
const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);
const ContributeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3z" />
  </svg>
);
const AboutIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);
const TermsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 0H4v2h12V5zM2 11a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 0H4v2h12v-2z" clipRule="evenodd" />
    <path d="M14 17H6a1 1 0 100 2h8a1 1 0 100-2z" />
  </svg>
);
const ContactIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const isIndustrialSection = location.pathname.startsWith('/industrial');

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-50 border-r border-slate-200 transform ${isOpen ? 'translate-x-0 animate-slideInLeft' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:flex-col md:w-60 lg:w-64 transition-transform duration-300 ease-in-out shadow-lg md:shadow-none`}
      aria-label="Main navigation"
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo and Title */}
        <div className="px-4 py-6 border-b border-slate-200"> 
           <Link 
             to="/" 
             className="flex flex-col items-center space-y-2" 
             onClick={closeSidebar}
           >
            <img 
                src="https://cdn-images.welcometothejungle.com/v82GguLLmnQoPY4v0Gu9ZTGrzAwtFaKjAd0pF-mNsFw/resize:auto:400::/czM6Ly93dHRqLXByb2R1Y3Rpb24vYWNjb3VudHMvdXBsb2Fkcy9vcmdhbml6YXRpb25zL2xvZ29zL2E5MWQ5M2U5MWMyNDYyZjA0MzNjMTc0Zjc0YjNjMjMwLzU2NmZkOTBjLTY2M2ItNDJlZC04N2I4LTVmMGIwYTg1NGU0NS5wbmc" 
                alt="TabBench Logo" 
                className="h-16 w-auto object-contain" 
            />
     
          </Link>
          <button 
            onClick={closeSidebar} 
            className="md:hidden text-slate-500 hover:text-[#1b998b] absolute top-4 right-4"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          <NavLink to="/" icon={<HomeIcon />} onClick={closeSidebar}>Home</NavLink>
          
          <NavLink to="/industrial/product-categorization" icon={<IndustrialIcon />} onClick={closeSidebar} isParentActive={isIndustrialSection}>
            Industrial Datasets
          </NavLink>
          {isIndustrialSection && <IndustrialSubMenu onClick={closeSidebar} />}
          
          <NavLink to="/academic" icon={<AcademicIcon />} onClick={closeSidebar}>Academic Datasets</NavLink>

          {/* Resources Section */}
          <div className="pt-6 mt-4 border-t border-slate-200">
            <h3 className="px-4 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">Resources</h3> 
            <div className="space-y-1">
                <NavLink to="https://github.com/Neuralk-AI/TabBench/tree/main/tutorials" icon={<NotebookIcon />} onClick={closeSidebar} isExternal={true}>Notebooks</NavLink>
                <NavLink to="https://github.com/Neuralk-AI/TabBench/" icon={<SettingsIcon />} onClick={closeSidebar} isExternal={true}>TabBench</NavLink>
                <NavLink to="https://github.com/Neuralk-AI/NeuralkFoundry-CE" icon={<SettingsIcon />} onClick={closeSidebar} isExternal={true}>Neuralk Foundry</NavLink>
                <NavLink to="/contribute" icon={<ContributeIcon />} onClick={closeSidebar}>Contribute</NavLink>
                <NavLink to="https://www.neuralk-ai.com" icon={<AboutIcon />} onClick={closeSidebar} isExternal={true}>About us</NavLink>
                <NavLink to="/terms-citation" icon={<TermsIcon />} onClick={closeSidebar}>Terms & Citation</NavLink>
                <NavLink to="https://www.neuralk-ai.com/contact" icon={<ContactIcon />} onClick={closeSidebar} isExternal={true}>Contact</NavLink>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer (Optional) */}
        <div className="px-4 py-3 mt-auto border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center">&copy; {new Date().getFullYear()} Neuralk-AI</p> 
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
