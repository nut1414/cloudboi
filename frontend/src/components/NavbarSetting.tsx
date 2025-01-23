import React from "react";

interface ComponentWithChildren {
  children?: React.ReactNode
}

const NavbarUnLogin: React.FC<ComponentWithChildren> = ({ children }) => {
  return (
    <nav className="bg-[#192A51] text-white fixed top-0 left-0 w-full h-20 p-5 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl text-white font-bold">CloudBoi</h1>
        {children}
      </div>
    </nav>
  );
};

export default NavbarUnLogin;
