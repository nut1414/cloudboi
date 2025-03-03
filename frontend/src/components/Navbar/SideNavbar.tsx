import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

// Define proper types
interface NavItemProps {
  path: string;
  label: string;
  currentPath: string;
  showHighlight: boolean;
  userName: string;
}

// NavItem component with proper TypeScript types
const NavItem: React.FC<NavItemProps> = ({ path, label, currentPath, showHighlight, userName }) => {
  const isActive = currentPath === path;
  const showActiveHighlight = isActive && showHighlight;
  
  return (
    <li className={`relative group p-4 ${isActive && showHighlight ? "bg-[#1E345F]" : ""} 
          ${!showHighlight ? "hover:bg-[#1E345F]" : ""}`}>
      {/* Hover highlight */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1] 
          scale-110 rounded-md opacity-0 group-hover:opacity-100 transition-all"></div>
      
      {/* Active highlight */}
      {showActiveHighlight && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 
            bg-[#967AA1] scale-110 rounded-md opacity-100 transition-all"></div>
      )}
      
      <Link to={`/user/${userName}/${path}`} className="text-white block w-full">
        {label}
      </Link>
    </li>
  );
};

// Credit card component
const CreditCard: React.FC = () => (
  <li className="relative group p-4">
    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[50%] h-[180%] -z-10 
        bg-[#967AA1] scale-110 rounded-md opacity-100 transition-all p-2">
      <span className="absolute top-2 left-2 text-xs text-gray-700">
        Available Credit:
      </span>
      <span className="absolute bottom-2 left-2 text-white text-2xs">
        1000 CBC
      </span>
    </div>
  </li>
);

const SideNavbar: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [showHighlight, setShowHighlight] = useState<boolean>(true);
  
  // Extract userName from the URL path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const userName = pathSegments.length > 1 && pathSegments[0] === "user" ? pathSegments[1] : "";

  // Navigation items array for easy management
  const navItems = [
    { path: "instance", label: "Manage" },
    { path: "billing", label: "Billing" },
    { path: "support", label: "Support" },
    { path: "setting", label: "Setting" }
  ];

  useEffect(() => {
    // Get the current section (e.g., "instance", "billing")
    if (pathSegments.length > 2 && pathSegments[0] === "user") {
      setCurrentPath(pathSegments[2] || "");
    } else {
      setCurrentPath("");
    }
    setShowHighlight(true);
  }, [location.pathname, pathSegments]);

  const handleNavHover = (): void => {
    setShowHighlight(false);
  };

  const handleNavLeave = (): void => {
    setShowHighlight(true);
  };

  return (
    <nav className="bg-[#192A51] h-screen w-64 fixed top-0 left-0 px-4">
      <ul className="flex flex-col h-full">
        {/* Logo */}
        <li className="p-6">
          <Link to="/" className="text-white text-4xl">CloudBoi</Link>
        </li>
        
        {/* Spacing */}
        <li className="p-4"></li>
        
        {/* Credit Card */}
        <CreditCard />
        
        {/* Spacing */}
        <li className="p-4"></li>
        <li className="p-4"></li>
        
        {/* Navigation Items */}
        <ul 
          onMouseEnter={handleNavHover}
          onMouseLeave={handleNavLeave}
          className="space-y-2 text-center"
        >
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              currentPath={currentPath}
              showHighlight={showHighlight}
              userName={userName}
            />
          ))}
        </ul>
      </ul>
    </nav>
  );
};

export default SideNavbar;