import React from "react";
import { Link, useParams } from "react-router-dom";

// SearchBar component
const SearchBar: React.FC = () => (
  <input
    type="text"
    placeholder="Search by instance name..."
    className="bg-white text-black placeholder-black pl-4 pr-20 py-2 rounded-2xl border-transparent border-[#D5C6E0] border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

// NavButton component
interface NavButtonProps {
  to: string;
  label: string;
  hasBorder?: boolean;
  className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ to, label, hasBorder = false, className = "" }) => (
  <Link
    to={to}
    className={`bg-[#D5C6E0] text-black px-4 py-2 rounded-2xl ${hasBorder ? 'border-white border-2' : ''} ${className}`}
  >
    {label}
  </Link>
);

// Divider component
const Divider: React.FC = () => (
  <span className="w-[2px] h-14 fixed top-3 bg-[#D5C6E0] ml-1"></span>
);

const TopNavbar: React.FC = () => {
  // Get username from URL params for correct routing
  const { userName } = useParams<{ userName: string }>();
  
  return (
    <nav className="bg-[#F5E6E8] text-white fixed top-0 left-64 w-[calc(100%-16rem)] p-6 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Search Bar */}
        <SearchBar />
        
        {/* Navigation Actions */}
        <ul className="flex space-x-4 items-center">
          <li>
            <NavButton 
              to={`/user/${userName}/instance/create`} 
              label="Create" 
            />
          </li>
          <li>
            <Divider />
          </li>
          <li>
            <NavButton 
              to={`/user/${userName}/setting`} 
              label="User profile" 
              hasBorder
              className="ml-2" 
            />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TopNavbar;