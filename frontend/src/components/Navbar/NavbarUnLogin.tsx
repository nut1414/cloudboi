import React from "react";

interface ComponentWithChildren {
    children? : React.ReactNode
}

const NavbarUnLogin: React.FC<ComponentWithChildren> = ({ children }) => {
  return (
    <nav className="bg-[#192A51] text-white fixed top-0 left-0 w-full h-20 p-5 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl text-white font-bold">CloudBoi</h1>
        {children}
        {/* <ul className="flex space-x-4 items-center">
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              About us
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white px-4 py-2 rounded-2xl   hover:text-black"
            >
              Use cases
            </a>
          </li>
          <li>
            <a
              href="#"
              className="bg-[#967AA1] text-white ml-40 px-4 py-2  rounded-2xl  border-transparent border-white border-2   hover:text-black "
            >
              Sign In
            </a>
          </li>
        </ul> */}
      </div>
    </nav>
  );
};

export default NavbarUnLogin;
