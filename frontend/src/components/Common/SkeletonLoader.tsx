import React from "react";

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  className?: string;
  rounded?: string;
  variant?: "default" | "light" | "dark" | "purple" | "blue" | "contrast";
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  height = "h-4",
  width = "w-full",
  className = "",
  variant = "default"
}) => {
  // Define color variants that work well on different backgrounds
  const variantClasses = {
    default: "bg-blue-900/20", // Original color - semi-transparent dark blue
    light: "bg-gray-300/30", // Light gray, good for dark backgrounds
    dark: "bg-gray-700/50", // Dark gray, good for light backgrounds
    purple: "bg-purple-500/30", // Purple to match your theme's accent color
    blue: "bg-blue-500/30", // Brighter blue for better visibility
    contrast: "bg-gray-500/50" // Medium gray with higher opacity for more contrast
  };

  return (
    <div 
      className={`animate-pulse ${variantClasses[variant]} ${height} ${width} ${className}`}
    ></div>
  );
};

export default SkeletonLoader;