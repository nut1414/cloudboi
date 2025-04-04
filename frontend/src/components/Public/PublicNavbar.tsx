import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import DropdownButton, { DropdownItemProps } from "../Common/Button/DropdownButton";
import TopNavbar, { TopNavItemProps } from "../Common/Navbar/TopNavbar";
import { NavLogo } from "../Common/Navbar/NavLogo";
import { useUser } from "../../contexts/userContext";
import { useAuth } from "../../hooks/User/useAuth";
import {
  CloudIcon,
  UserIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline";
import { CloudIcon as CloudIconSolid } from "@heroicons/react/24/solid";
import Button from "../Common/Button/Button";
import SkeletonLoader from "../Common/SkeletonLoader";

interface UserMenuProps {
  username?: string;
  logout: () => Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'purple' | 'transparent';
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  username = 'User',
  logout,
  variant = 'transparent',
  className = ""
}) => {
  const navigate = useNavigate();
  const firstLetter = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dropdownItems: DropdownItemProps[] = [
    {
      href: `/user/${username}/instance`,
      label: "Dashboard"
    },
    {
      href: `/user/${username}/profile`,
      label: "Profile"
    },
    {
      href: `/user/${username}/setting`,
      label: "Settings"
    },
    {
      divider: true
    },
    {
      label: "Logout",
      icon: <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />,
      onClick: handleLogout,
      className: "text-red-400"
    }
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <DropdownButton
        icon={
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
            {firstLetter}
          </div>
        }
        label={username}
        variant={variant}
        buttonType="text"
        items={dropdownItems}
        position="bottom-right"
        disableHover={true}
      />
    </div>
  );
};

const PublicNavbar = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const { logout } = useAuth();

  // Logo component
  const Logo = (
    <CloudIconSolid className="h-9 w-9 bg-purple-500 p-1.5 rounded-md text-white" />
  );

  // About dropdown items
  const aboutDropdownItems = [
    { href: "/about-company", label: "About Company" },
    { href: "/about-team", label: "Our Team" },
    { href: "/about-mission", label: "Our Mission" }
  ];

  const navItems: TopNavItemProps[] = [
    {
      href: "/",
      label: "Home",
      icon: <CloudIconSolid className="w-5 h-5" />
    },
    {
      label: (
        <DropdownButton
          label="About Us"
          variant="transparent"
          buttonType="none"
          dropdownClassName="mt-3"
          icon={<InformationCircleIcon className="w-5 h-5" />}
          items={aboutDropdownItems}
        />
      ),
      isActive: window.location.pathname.includes("/about")
    },
    {
      href: "/pricing",
      label: "Pricing",
      icon: <CurrencyDollarIcon className="w-5 h-5" />
    },
    {
      href: "/use-cases",
      label: "Use Cases",
      icon: <PuzzlePieceIcon className="w-5 h-5" />
    }
  ];

  // Right section with auth controls
  const rightSection = (() => {
    const wrapperClasses = "ml-2 pl-4 border-l border-blue-800/30"

    if (isLoading) {
      return <div className={wrapperClasses}>
        <SkeletonLoader height="h-10" width="w-24" />
      </div>
    }

    if (isAuthenticated && user) {
      return (
        <div className={wrapperClasses}>
          <UserMenu username={user.username ?? undefined} logout={logout} />
        </div>
      )
    } else {
      return (
        <div className={wrapperClasses}>
          <Button
            label="Sign In"
            href="/login"
            variant="purple"
            icon={<UserIcon className="w-5 h-5" />}
          />
        </div>
      );
    }
  })();

  return (
    <TopNavbar
      leftSection={<NavLogo logo={Logo} logoText="CloudBoi" />}
      navItems={navItems}
      rightSection={rightSection}
      navAlignment="end"
      variant="default"
      stickyTop={true}
    />
  );
};

export default PublicNavbar;