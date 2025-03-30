import React from "react";

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  className?: string;
  rounded?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  height = "h-4",
  width = "w-full",
  className = "",
  rounded = "rounded"
}) => {
  return (
    <div 
      className={`animate-pulse bg-blue-900/20 ${height} ${width} ${rounded} ${className}`}
    ></div>
  );
};

export default SkeletonLoader;