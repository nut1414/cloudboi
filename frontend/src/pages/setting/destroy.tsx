import VerticalSidebar from "../../components/VerticalSidebar";
import SlidebarSettingPage from "../../components/SlidebarSettingPage";


function DestroyPage() {

    return (<>

        <VerticalSidebar />
        <div className="  text-black absolute top-4 left-80 z-0 ">
            <div className="flex flex-col  justify-start items-start">
                <p className=" text-4xl font-bold">Cloud Instance Name</p>
                <p className="bg-[#192A51] shadow-lg text-white mt-4  py-2 px-96 rounded-lg">Instance details</p>
                <SlidebarSettingPage />
                <div className="mt-8 bg-red-300  shadow-md h-[300px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                    <p className="ml-14 mt-4 text-2xl font-bold">Destroy Instance</p>
                    <p className="ml-14 mt-4 ">Permanently delete this instance, removing all associated data, configurations, and resources.  </p>
                    <p className="ml-14 mt-4 "> This action is irreversible and ideal when the instance is no longer needed or to free up</p>
                    <p className="ml-14 mt-4 "> resources. Ensure you have backed up any essential data, as this will fully dismantle </p>
                    <p className="ml-14 mt-4 "> the instance and reclaim the underlying resources for future use.</p>
                    <button
                    type="submit"
                    className="bg-[#192A51] w-[30%] text-white mt-5 ml-14  py-2 rounded-lg hover:border-white border-2   hover:text-blue-400 transition duration-300"
                >
                   Destroy this Instance
                </button>
                </div>
                
            </div>
        </div>
    </>)

} export default DestroyPage;