import VerticalSidebar from "../../components/VerticalSidebar";
import SlidebarSettingPage from "../../components/SlidebarSettingPage";


function NetworkingPage() {

    return (<>

        <VerticalSidebar />
        <div className="  text-black absolute top-4 left-80 z-0 ">
            <div className="flex flex-col  justify-start items-start">
                <p className=" text-4xl font-bold">Cloud Instance Name</p>
                <p className="bg-[#192A51] shadow-lg text-white mt-4  py-2 px-96 rounded-lg">Instance details</p>
                <SlidebarSettingPage />
                <div className="mt-8 bg-red-300  shadow-md h-[550px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                    <p className="ml-14 mt-4 text-2xl font-bold">Public Network</p>
                    <div className="ml-14 mt-10 bg-[#F5E6E8] shadow-lg h-[140px] w-[680px] rounded-2xl  flex flex-col  justify-start items-start ">
                        <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Public Network Details</p>

                    </div>
                    <div className=" shadow-md ml-10 mt-10 mb-6 px-[46%] py-[0.3%] bg-blue-300  rounded-full"></div>
                    <p className="ml-14 mt-4 text-2xl font-bold">Private Network</p>
                    <div className="ml-14 mt-10 bg-[#F5E6E8] shadow-lg h-[140px] w-[680px] rounded-2xl  flex flex-col  justify-start items-start ">
                        <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Private Network Details</p>

                    </div>

                </div>



            </div>
        </div>


    </>)


} export default NetworkingPage;