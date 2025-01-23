import React, { useState } from "react";
import { NavContainer } from "./Nav.styled";
import { client, TestapiService } from "../client";

const Nav: React.FC = () => {
  const testService = TestapiService
  const testComponent = async (someNumber: Number) => {
    const response = await TestapiService.testapiReadTestapi({
      data: {
        path: {
          item: someNumber
        }
      }
    });
    return <div>Response: {response.test_response} {response.test_response2}</div>
  }
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <NavContainer>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
       
        <div className="text-lg font-bold">MyApp</div>

        {/* Hamburger Menu */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12" // Cross icon
                  : "M4 6h16M4 12h16m-7 6h7" // Hamburger icon
              }
            />
          </svg>
        </button>

        {/* Menu Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto md:flex bg-green-500 md:bg-transparent`}
        >
          <ul className="md:flex md:items-center">
            <li className="p-4 hover:bg-green-600 md:hover:bg-transparent">
              <a href="#home" className="block">
                Home
              </a>
            </li>
            <li className="p-4 hover:bg-green-600 md:hover:bg-transparent">
              <a href="#about" className="block">
                About
              </a>
            </li>
            <li className="p-4 hover:bg-green-600 md:hover:bg-transparent">
              <a href="#services" className="block">
                Services
              </a>
            </li>
            <li className="p-4 hover:bg-green-600 md:hover:bg-transparent">
              <a href="#contact" className="block">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </NavContainer>
  );
};

export default Nav;
