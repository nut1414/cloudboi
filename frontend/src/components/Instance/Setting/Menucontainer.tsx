import React from "react";

interface MenuContainerProps {
  children: React.ReactNode;
  style?: string;
}

const MenuContainer: React.FC<MenuContainerProps> = ({ children, style}) => {
  return (
    <div className={`shadow-md ${style} rounded-2xl flex flex-col justify-start items-start `}>
      {children}
    </div>
  );
};  

export default MenuContainer;