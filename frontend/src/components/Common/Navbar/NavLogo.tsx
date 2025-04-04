import { Link } from "react-router-dom";

// Convenience Logo Component for leftSection
export const NavLogo: React.FC<{logo?: React.ReactNode; logoText?: string; variant?: 'default' | 'light' | 'dark'}> = ({
    logo,
    logoText,
    variant = 'default'
  }) => {
    const variantStyles = {
      default: "text-white",
      light: "text-gray-900",
      dark: "text-white"
    };
  
    return (
      <Link to="/" className="flex items-center gap-3">
        {logo}
        {logoText && <span className={`${variantStyles[variant]} text-2xl font-bold`}>{logoText}</span>}
      </Link>
    );
  };