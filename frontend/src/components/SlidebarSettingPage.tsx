import React,{useEffect,useState} from "react";
import { useLocation } from "react-router-dom";

const SlidebarSettingPage: React.FC = () => {

    const location = useLocation();
    const [hoverAccess, setHoverAccess] = useState(false);
    const [hoverGraphs, setHoverGraphs] = useState(false);
    const [hoverPowers, setHoverPowers] = useState(false);
    const [hoverNetworking, setHoverNetworking] = useState(false);
    const [hoverDestroy, setHoverDestroy] = useState(false);

    const [showDiv, setShowDiv] = useState(true); 
    const [pathValue, setPathValue] = useState(location.pathname);


    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean); // Remove empty strings
        setPathValue(pathSegments[pathSegments.length - 1] || ""); // Get the last segment (e.g., "access")
        setShowDiv(true); // Reset visibility on route change
        console.log(pathSegments[pathSegments.length - 1])
      }, [location.pathname]);


    return (
        <nav >
              <div onMouseEnter={() => setShowDiv(false)} 
                       onMouseLeave={() => setShowDiv(true)}
                       className="mt-6 ml-48 h-[42px]  items-center inline-flex gap-14 ">
                    
                        <div onMouseEnter={() => setHoverAccess(true)}
                             onMouseLeave={() => setHoverAccess(false)}>
                            <a href="access"   className=""> Access</a>
                            { (pathValue === 'access' && showDiv)&& (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-0 sm:ms-0 px-10  rounded-full" ></div> )}
                             { (hoverAccess && showDiv === false) && (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-0 sm:ms-0 px-10  rounded-full" ></div> )}
                        </div>
                        <div onMouseEnter={() => setHoverGraphs(true)}
                             onMouseLeave={() => setHoverGraphs(false)}>
                            <a href="graphs"   className="" > Graphs  </a>
                            { (pathValue === 'graphs' && showDiv) && (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-1.5 sm:ms-0 px-10  rounded-full" ></div> )}
                            { (hoverGraphs && showDiv === false)&& (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-0 sm:ms-0 px-10  rounded-full" ></div> )}
                        </div>
                        <div onMouseEnter={() => setHoverPowers(true)}
                             onMouseLeave={() => setHoverPowers(false)}>
                            <a href="powers"   className="" > Powers  </a>
                            { (pathValue === 'powers' && showDiv) && (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-1.5 sm:ms-0 px-10 rounded-full" ></div> )}
                            { (hoverPowers && showDiv === false)&& (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-0 sm:ms-0 px-10  rounded-full" ></div> )}
                        </div>
                        <div onMouseEnter={() => setHoverNetworking(true)}
                             onMouseLeave={() => setHoverNetworking(false)}>
                            <a href="networking"  > Networking  </a>
                            { (pathValue === 'networking' && showDiv) && (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-1.5 sm:ms-0 px-10 rounded-full "></div>)} 
                            { (hoverNetworking && showDiv === false) && (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-0 sm:ms-0 px-10  rounded-full" ></div> )}
                        </div>
                        <div onMouseEnter={() => setHoverDestroy(true)}
                             onMouseLeave={() => setHoverDestroy(false)}>
                            <a href="destroy"  > Destroy  </a>
                            { (pathValue === 'destroy' && showDiv) && (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-1.5 sm:ms-0  px-10   rounded-full" ></div>)}
                            { (hoverDestroy && showDiv === false)&& (
                            <div style={{content:'" "', height:'8px', background:'#192A51', bottom:'-2px', left:'20px'}} className="mt-1 ms-0 sm:ms-0 px-10  rounded-full" ></div> )}
                        </div>
                     
               </div>
               <div className="absolute shadow-md top-36 ml-2 mt-2 px-[50%] py-1 bg-red-300 bg-opacity-50 z-[-1] rounded-full"></div>
        </nav>
      );
    };
    
export default SlidebarSettingPage;
       