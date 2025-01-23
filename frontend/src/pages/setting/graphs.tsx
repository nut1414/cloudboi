import VerticalSidebar from "../../components/VerticalSidebar";
import SlidebarSettingPage from "../../components/SlidebarSettingPage";


function GraphsPage() {


    return (<>
    
            <VerticalSidebar />
            <div className="  text-black absolute top-4 left-80 z-0 ">
                <div className="flex flex-col  justify-start items-start">
                    <p className=" text-4xl font-bold">Cloud Instance Name</p>
                    <p className="bg-[#192A51] shadow-lg text-white mt-4  py-2 px-96 rounded-lg">Instance details</p>
                    <SlidebarSettingPage />
                    <p className="shadow-lg  mt-8 bg-[#967AA1]  px-4 py-2 text-white rounded-lg">Time Granularity Dropdown</p>
                
                    <div className="mt-8 bg-red-300  shadow-md h-[230px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                        <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Console</p>
                
                    </div>

                    <div className="mt-8 bg-red-300  shadow-md h-[230px] w-[780px] rounded-2xl flex flex-col  justify-start items-start mb-20">
                        <p className="flex justify-center items-center h-full w-full text-xl font-bold">CPU Usage Graph</p>
                
                    </div>
                </div>
            </div>
    
    
    </>)


} export default GraphsPage;