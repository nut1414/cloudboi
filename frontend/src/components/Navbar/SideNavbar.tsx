import React, { useEffect, useState } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { Icon } from "../../assets/Icon";
import { useAuth } from "../../hooks/User/useAuth";

// Define proper types
interface NavItemProps {
  path: string;
  label: string;
  userName: string | undefined;
  isHovering: boolean;
  icon?: React.ReactNode; // Optional icon prop
}

interface SideNavbarProps {
  navItems?: { path: string; label: string; icon?: React.ReactNode }[]; // Make nav items customizable
  creditLimit?: number; // Make credit limit customizable
  creditCurrency?: string; // Make currency customizable
  logoText?: string; // Allow custom logo text
  logoIcon?: React.ReactNode; // Allow custom logo icon
  onLogout?: () => void; // Logout callback
  userRole?: string; // User role to display
}

// NavItem component with better relative styling
const NavItem: React.FC<NavItemProps> = ({
  path,
  label,
  userName,
  isHovering,
  icon
}) => {
  const { pathname } = useLocation();
  const currentPath = pathname.split("/").pop() || "";
  const isActive = currentPath === path;

  return (
    <li className={`
      relative rounded-md transition-all duration-200
      ${isActive && !isHovering ? "bg-blue-800" : ""}
      ${isHovering ? "hover:bg-blue-800" : ""}
    `}>
      <Link
        to={`/user/${userName}/${path}`}
        className={`
          flex items-center py-3 px-5 text-lg font-medium
          transition-all duration-200 w-full
          ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
        `}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {label}
      </Link>
    </li>
  );
};

// Credit card component with flex instead of absolute positioning
const CreditCard: React.FC<{ creditLimit?: number; currency?: string }> = ({
  creditLimit = 1000,
  currency = "CBC"
}) => (
  <div className="mx-4 my-4">
    <div className="
      bg-purple-600 
      rounded-lg shadow-md overflow-hidden
      flex flex-col p-5
      border border-purple-500/20
    ">
      <span className="text-sm text-purple-100 font-medium">
        Available Credit:
      </span>
      <span className="text-white text-2xl font-bold mt-2">
        {creditLimit} {currency}
      </span>
    </div>
  </div>
);

// User menu component
const UserMenu: React.FC<{
  userName: string | undefined;
  userRole?: string;
  onLogout: () => Promise<void>;
}> = ({ userName, userRole = "User Account", onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.user-profile-section')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="user-profile-section relative mt-auto border-t border-blue-800/30 p-4">
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={toggleMenu}
      >
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {userName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col flex-grow">
          <span className="text-white font-medium">{userName}</span>
          <span className="text-gray-400 text-sm">{userRole}</span>
        </div>
        {/* Dropdown arrow - rotates when open */}
        <div className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
          {Icon.ArrowDown}
        </div>
      </div>

      {/* Drop-up menu */}
      {isMenuOpen && (
        <div className="absolute bottom-20 left-4 right-4 bg-[#23375F] rounded-lg shadow-lg border border-blue-800/30 overflow-hidden transition-all duration-300">
          <div className="py-2">
            <Link to={`/user/${userName}/profile`} className="block px-4 py-2 text-white hover:bg-blue-800 transition-colors">
              View Profile
            </Link>
            <Link to={`/user/${userName}/preferences`} className="block px-4 py-2 text-white hover:bg-blue-800 transition-colors">
              Preferences
            </Link>
            <div className="border-t border-blue-800/30 my-1"></div>
            <button
              onClick={async () => {
                await onLogout();
                navigate("/login");
              }}
              className="block w-full text-left px-4 py-2 text-red-400 hover:bg-blue-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SideNavbar: React.FC<SideNavbarProps> = ({
  navItems: customNavItems,
  creditLimit,
  creditCurrency,
  logoText = "CloudBoi",
  logoIcon = Icon.Logo,
  userRole
}) => {
  const { userName } = useParams<{ userName: string }>();
  const { logout } = useAuth();
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Default navigation items - can be overridden via props
  const defaultNavItems = [
    { path: "instance", label: "Manage", icon: Icon.Manage },
    { path: "billing", label: "Billing", icon: Icon.Billing },
    { path: "support", label: "Support", icon: Icon.Support },
    { path: "setting", label: "Setting", icon: Icon.Setting }
  ];

  // Use provided navItems or fall back to defaults
  const navItems = customNavItems || defaultNavItems;

  return (
    <nav className="
      h-screen min-h-screen w-72 
      bg-[#192A51]
      flex flex-col
      shadow-xl
      border-r border-blue-900/50
      flex-shrink-0 
    ">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-800/30">
        <Link to="/" className="text-white text-3xl font-bold flex items-center">
          {logoIcon}
          {logoText}
        </Link>
      </div>

      {/* Credit Card */}
      <CreditCard creditLimit={creditLimit} currency={creditCurrency} />

      {/* Navigation Items */}
      <div className="mt-6 mb-3 px-5 text-gray-400 text-sm uppercase tracking-wider font-medium">
        Main Navigation
      </div>

      <ul
        className="flex-grow px-4 space-y-2 mb-8"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            path={item.path}
            label={item.label}
            userName={userName}
            isHovering={isHovering}
            icon={item.icon}
          />
        ))}
      </ul>

      {/* User Profile Section with Drop-up Menu */}
      <UserMenu
        userName={userName}
        userRole={userRole}
        onLogout={logout}
      />
    </nav>
  );
};

export default SideNavbar;
