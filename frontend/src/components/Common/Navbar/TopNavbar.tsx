import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// TopNavItem types
export interface TopNavItemProps {
  href?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

// Simple Nav Item Component
export const TopNavItem: React.FC<TopNavItemProps & { variant?: 'default' | 'light' | 'dark' }> = ({
  href,
  label,
  icon,
  isActive = false,
  onClick,
  variant = 'default'
}) => {
  // Variant styles
  const variantStyles = {
    default: `text-gray-300 hover:text-white hover:bg-blue-800 ${isActive ? "text-white bg-blue-800" : ""}`,
    light: `text-gray-700 hover:text-gray-900 hover:bg-gray-100 ${isActive ? "text-gray-900 bg-gray-100" : ""}`,
    dark: `text-gray-400 hover:text-white hover:bg-gray-800 ${isActive ? "text-white bg-gray-800" : ""}`
  };

  // Common classes for both Link and div
  const commonClasses = `flex items-center px-5 py-3 mx-1 rounded-md text-base font-medium transition-all duration-200 ${variantStyles[variant]}`;

  // If href is not provided or empty, render a div instead of Link
  if (!href) {
    return (
      <div
        className={commonClasses}
        onClick={onClick}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {label}
      </div>
    );
  }

  // Otherwise render Link as before
  return (
    <Link
      to={href}
      className={commonClasses}
      onClick={onClick}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </Link>
  );
};

// Main TopNavbar Component
export interface TopNavbarProps {
  navItems?: TopNavItemProps[]; // Made optional
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  variant?: 'default' | 'light' | 'dark';
  stickyTop?: boolean;
  navAlignment?: 'start' | 'center' | 'end';
  className?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  navItems = [], // Default to empty array
  leftSection,
  rightSection,
  variant = 'default',
  stickyTop = true,
  navAlignment = 'center',
  className = ""
}) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Effect to handle scroll and update state
  useEffect(() => {
    if (!stickyTop) return; // Only add scroll listener if sticky is enabled
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Call once on mount to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, stickyTop]);

  // Variant styles
  const variantStyles = {
    default: {
      bg: "bg-[#192A51]",
      border: "border-blue-900/30",
      divider: "border-blue-800/30",
      text: "text-white"
    },
    light: {
      bg: "bg-white",
      border: "border-gray-200",
      divider: "border-gray-200",
      text: "text-gray-900"
    },
    dark: {
      bg: "bg-gray-900",
      border: "border-gray-800",
      divider: "border-gray-700",
      text: "text-white"
    }
  };

  // Navigation item alignment
  const alignmentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end"
  };

  const styles = variantStyles[variant];

  // Only apply shadow if sticky AND scrolled
  const shadowClass = stickyTop && scrolled ? 'shadow-xl' : '';

  return (
    <nav className={`${styles.bg} py-4 px-6 md:px-8 ${shadowClass} border-b ${styles.border} ${stickyTop ? 'sticky top-0 z-50' : ''} ${className} transition-shadow duration-300`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          {leftSection && (
            <div className="flex items-center">
              {leftSection}
            </div>
          )}

          {/* Navigation Items - Will grow to fill available space with specified alignment */}
          {navItems.length > 0 && (
            <div className={`flex items-center ${alignmentClasses[navAlignment]} flex-grow`}>
              {navItems.map((item, index) => (
                <TopNavItem
                  key={index}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={location.pathname === item.href}
                  onClick={item.onClick}
                  variant={variant}
                />
              ))}
            </div>
          )}

          {/* Right Section */}
          {rightSection && (
            <div className="flex items-center">
              {rightSection}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;