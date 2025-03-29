import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Icon } from "../../assets/Icon";

// SearchBar component with real-time search
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  initialValue?: string;
  width?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search by instance name...",
  onSearch = () => { },
  className = "",
  initialValue = "",
  width = "w-64",
}) => {
  const [query, setQuery] = useState(initialValue);

  // Handle input changes directly
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Call onSearch directly
    onSearch(newQuery);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange} // Use the new handler
        placeholder={placeholder}
        className={`bg-[#23375F] text-white placeholder-gray-400 pl-4 pr-10 py-2 rounded-lg 
                  border-2 border-blue-800/30 focus:outline-none focus:ring-2 focus:ring-purple-500 
                  ${width} transition-all duration-200`}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {Icon.Search}
      </div>
    </div>
  );
};

// NavButton component
interface NavButtonProps {
  to?: string;
  label: string;
  hasBorder?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

const NavButton: React.FC<NavButtonProps> = ({
  to,
  label,
  hasBorder = false,
  className = "",
  icon,
  onClick,
  variant = 'primary'
}) => {
  const variantStyles = {
    primary: "bg-blue-800 text-white hover:bg-blue-700",
    secondary: "bg-purple-600 text-white hover:bg-purple-500",
    outline: "bg-transparent border-2 border-blue-800/30 text-gray-300 hover:bg-blue-800/20"
  };

  const Button = (
    <button
      onClick={onClick}
      className={`
        ${variantStyles[variant]} px-4 py-2 rounded-lg
        transition-colors duration-200 flex items-center gap-2
        ${hasBorder ? 'border-blue-700 border-2' : ''}
        ${className}
      `}
    >
      {icon}
      {label}
    </button>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block">
        {Button}
      </Link>
    );
  }

  return Button;
};

// Notification Badge component
interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick }) => (
  <button
    className="relative hover:opacity-80 transition-opacity w-6 h-6 text-gray-300"
    onClick={onClick}
    aria-label={`Notifications: ${count} unread`}
  >
    {Icon.Notification}
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </button>
);

interface TopNavbarProps {
  onSearch?: (query: string) => void;
  actions?: React.ReactNode[];
  showSearch?: boolean;
  notificationCount?: number;
  customLeftContent?: React.ReactNode;
  customRightContent?: React.ReactNode;
  className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  onSearch,
  actions,
  showSearch = true,
  notificationCount = 0,
  customLeftContent,
  customRightContent,
  className = "",
}) => {
  // Get username from URL params for correct routing
  const { userName } = useParams<{ userName: string }>();
  const navigate = useNavigate();

  return (
    <nav className={`bg-[#192A51] border-b border-blue-900/50 text-white w-full px-6 py-3 shadow-sm z-10 sticky top-0 transition-colors ${className}`}>
      <div className="flex justify-between items-center">
        {/* Left section: Search */}
        <div className="flex items-center">
          {customLeftContent || (
            <>
              {showSearch && (
                <SearchBar
                  onSearch={onSearch}
                  className="hidden md:block"
                  placeholder="Search..."
                  width="w-56 md:w-64 lg:w-80"
                />
              )}
            </>
          )}
        </div>

        {/* Right section: Actions, notifications */}
        <div className="ml-96 flex items-center gap-4">
          {customRightContent || (
            <>
              {/* Default or custom action buttons */}
              {actions ? (
                actions
              ) : (
                <NavButton
                  to={`/user/${userName}/instance/create`}
                  label="Create Instance"
                  variant="secondary"
                  icon={Icon.Plus}
                />
              )}

              {/* Notifications */}
              <NotificationBadge
                count={notificationCount}
                onClick={() => navigate(`/user/${userName}/notifications`)}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Export individual components for reusability
export { SearchBar, NavButton, NotificationBadge };

export default TopNavbar;