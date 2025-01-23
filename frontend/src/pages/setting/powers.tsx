import VerticalSidebar from "../../components/VerticalSidebar";
import SlidebarSettingPage from "../../components/SlidebarSettingPage";


function PowersPage() {

    return (<>

        <VerticalSidebar />
        <div className="  text-black absolute top-4 left-80 z-0 ">
            <div className="flex flex-col  justify-start items-start">
                <p className=" text-4xl font-bold">Cloud Instance Name</p>
                <p className="bg-[#192A51] shadow-lg text-white mt-4  py-2 px-96 rounded-lg">Instance details</p>
                <SlidebarSettingPage />
                <div className="mt-8 bg-red-300  shadow-md h-[260px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                    <p className="ml-14 mt-4 text-2xl font-bold">Turn off Instance</p>
                    <p className="ml-14 mt-4 ">Safely power down your instance when it’s not in use, preserving data and configurations while </p>
                    <p className="ml-14 mt-4 "> minimizing resource usage and costs. You can turn it back on anytime to restore all settings and </p>
                    <p className="ml-14 mt-4 ">continue from where you left off.</p>
                    <button
                    type="submit"
                    className="bg-[#192A51] w-[20%] text-white mt-4 ml-14  py-2 rounded-lg hover:border-white border-2   hover:text-blue-400 transition duration-300"
                >
                   Turn off
                </button>
                </div>
                


            </div>
        </div>


    </>)


} export default PowersPage;