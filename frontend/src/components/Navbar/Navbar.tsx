import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#F5E6E8] text-white fixed top-0 left-64 w-[calc(100%-16rem)] p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Search Bar */}
        <input
            type="text"
            placeholder="Search by instance name..."
           className="bg-white text-black  placeholder-black pl-4 pr-20 py-2  rounded-2xl  border-transparent border-[#D5C6E0] border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        <ul className="flex space-x-4">
          <li>
            <a
              href="/manage/createinstance"
              className="bg-[#D5C6E0] text-black px-4 py-2  rounded-2xl"
            >
              Create 
            </a>
          </li>
          <li>
            <span className="w-[2px] h-14 fixed top-3 bg-[#D5C6E0] ml-1 "></span>
          </li>
          
          <li>
            <a
              href="#"
              className="bg-[#D5C6E0] text-black px-4 py-2  rounded-2xl ml-2 border-white border-2"
            >
              User profile
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
