import VerticalSidebar from "../../components/VerticalSidebar";
import SlidebarSettingPage from "../../components/SlidebarSettingPage";

function AccessPage() {

    return (
        <>
            <VerticalSidebar />
            <div className="  text-black absolute top-4 left-80 z-0 ">
                <div className="flex flex-col  justify-start items-start">
                    <p className=" text-4xl font-bold">Cloud Instance Name</p>
                    <p className="bg-[#192A51] shadow-lg text-white mt-4  py-2 px-96 rounded-lg">Instance details</p>

                    <SlidebarSettingPage />

                    <div className="mt-8 bg-red-300  shadow-md h-[230px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                        <p className="ml-14 mt-4 text-xl font-bold">Instance Console</p>
                        <p className="ml-14 mt-4 ">Access the console for direct control over your cloud instance, just like having physical access to </p>
                        <p className="ml-14">  the server. Use it to configure settings, troubleshoot issues, and perform administrative actions </p>
                        <p className="ml-14">  without needing SSH access.Ideal for managing your instance at a detailed level.</p>

                        <div className=" mt-2  justify-center grid grid-cols-2 ">
                            <div className="bg-blue-300 h-[50px] w-[100px] mt-4 ml-20  rounded-2xl">
                                <p className="text-xs mt-1">Log in as...</p>
                                <p className="mr-6">root</p>
                            </div>

                            <button
                                type="submit"
                                className="bg-[#192A51] w-[100%] text-white mt-4  py-2 rounded-lg hover:border-white border-2   hover:text-blue-400 transition duration-300"
                            >
                                Launch Instance Console
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 bg-red-300 shadow-md h-[220px] w-[780px] rounded-2xl flex flex-col  justify-start items-start mb-40">
                        <p className="ml-14 mt-4 text-xl font-bold">Reset root password </p>
                        <p className="ml-14 mt-4 ">Reset the root password to update or regain access permissions for your instance. Essential for   </p>
                        <p className="ml-14">  securing administrative control, this option is helpful if you’ve lost access or want to improve security </p>
                        <p className="ml-14"> by setting a new password.</p>

                        <div className=" mt-2 ml-14 ">
                            <button
                                type="submit"
                                className="bg-[#192A51] w-[100%] text-white mt-4  py-2 rounded-lg hover:border-white border-2   hover:text-blue-400 transition duration-300"
                            >
                                Reset root password
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>)

} export default AccessPage;