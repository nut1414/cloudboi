import React,{useEffect,useState} from "react";
import { useLocation } from "react-router-dom";

const Navbartest: React.FC = () => {

  
  const location = useLocation();
  const [pathValue, setPathValue] = useState(location.pathname);
  const [showDiv, setShowDiv] = useState(true); // Controls visibility of the div


  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean); // Remove empty strings
    setPathValue(pathSegments[0] || ""); // Get only the first segment (e.g., "manage")
    setShowDiv(true); // Reset visibility on route change
  }, [location.pathname]);


  const handleNavHover = () => {
    setShowDiv(false); // Hide the div when hovering over <nav>
  };

  const handleNavLeave = () => {
    setShowDiv(true); // Show the div again when leaving <nav>
  };

  return (
    <nav className="bg-[#192A51] h-screen w-64 fixed top-0 left-0 ">
        
      <ul className="flex flex-col h-full">
      <li className="p-6 ">
          <a href="#home" className="text-white text-4xl">CloudBoi</a>
        </li>
     
        <li className="p-4 ">
          <a href="#home" className="text-white"></a>
        </li>
        <li className="relative group p-4">
          {/* bg-red-300 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[50%] h-[180%] -z-10 bg-[#967AA1]  scale-110 rounded-md opacity-100 transition-all p-2">
            <span className="absolute top-2 left-2 text-xs text-gray-700">
              Available Credit:
            </span>

            <span className="absolute bottom-2 left-2 text-white  text-2xs">
              1000 CBC
            </span>
          </div>
        </li>
        
        <li className="p-4 ">
          <a href="#home" className="text-white"></a>
        </li>
        <li className="p-4 ">
          <a href="#home" className="text-white"></a>
        </li>
        <ul onMouseEnter={handleNavHover}
            onMouseLeave={handleNavLeave}>

          <li className={`relative group p-4 
                ${pathValue === "manage" && showDiv ? "bg-[#1E345F]" : ""} 
                ${!showDiv ? "hover:bg-[#1E345F]" : ""}`}>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1]  scale-110 rounded-md opacity-0 group-hover:opacity-100 transition-all"></div>
            {pathValue === "manage" && showDiv && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1] scale-110 rounded-md opacity-0 opacity-100 transition-all"></div>
        )}
            <a href="/manage" className="text-white">
            Manage
            </a>
          </li>
          <li className={`relative group p-4  ${pathValue === "billing" && showDiv ? "bg-[#1E345F]" : ""} 
                ${!showDiv ? "hover:bg-[#1E345F]" : ""}`}>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1]  scale-110 rounded-md opacity-0 group-hover:opacity-100 transition-all"></div>
            {pathValue === "billing" && showDiv && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1] scale-110 rounded-md opacity-0 opacity-100 transition-all"></div>
        )}
            <a href="/billing" className="text-white">
            Billing
            </a>
          </li>
          <li className={`relative group p-4 
                ${pathValue === "support" && showDiv ? "bg-[#1E345F]" : ""} 
                ${!showDiv ? "hover:bg-[#1E345F]" : ""}`}>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1]  scale-110 rounded-md opacity-0 group-hover:opacity-100 transition-all"></div>
            {pathValue === "support" && showDiv && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1] scale-110 rounded-md opacity-0 opacity-100 transition-all"></div>
        )}
            <a href="/support" className="text-white">
            Support
            </a>
          </li>
          <li className={`relative group p-4 
                ${pathValue === "setting" && showDiv ? "bg-[#1E345F]" : ""} 
                ${!showDiv ? "hover:bg-[#1E345F]" : ""}`}>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1]  scale-110 rounded-md opacity-0 group-hover:opacity-100 transition-all"></div>
            {pathValue === "setting" && showDiv && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1] scale-110 rounded-md opacity-0 opacity-100 transition-all"></div>
        )}
            <a href="/setting" className="text-white">
            Setting
            </a>
          </li>
         
        </ul>
      </ul>
    </nav>
    
  );
};

export default Navbartest;
