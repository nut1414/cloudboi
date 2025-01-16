import { useState } from "react";

import Navbartest from "../components/Test";

function CreateInstance() {
    const [selectedVersion, setSelectedVersion] = useState("");


    return (
        <>
            <Navbartest />
            <div className="  text-black absolute top-4 left-80 z-0 ">
                <div className="flex flex-col  justify-start items-start">

                    <p className=" text-5xl">Create _______</p>
                    <p className=" text-xl pt-10 pb-10">Choose an image</p>

                    <div className="flex gap-4">
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 1</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 2</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 3</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 4</p>
                    </div>
                    <p className=" text-2xl pt-10 pb-4">Version</p>

                    <select
                        id="os"
                        className="border border-gray-300 rounded-md px-2 py-1 text-black"
                        value={selectedVersion}
                        onChange={(e) => setSelectedVersion(e.target.value)}
                    >
                        <option value="">-- Choose an OS Version --</option>
                        <option value="Version 1">XX.XXX.XXX</option>
                        <option value="Version 2">XX.XXX.XXX</option>
                        <option value="Version 3">XX.XXX.XXX</option>
                    </select>

                    {selectedVersion && (
                        <p className="mt-4 text-lg">Selected Version: <strong>{selectedVersion}</strong></p>
                    )}

                    <p className=" text-2xl pt-10 ">Choose Size</p>
                    <p className="pt-2 pb-4">CPU options</p>


                    <div className="flex gap-4">
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 1</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 2</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 3</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 4</p>
                    </div>

                    <p className="text-2xl pt-5 pb-4">Choose Authentication Method</p>
                    <div className="bg-red-300 h-[360px] w-[650px] rounded-2xl flex flex-col  justify-start items-start">

                        <p className="text-xl font-bold ml-10 mt-10">Create root password</p>
                        <p className=" ml-10 mt-2">Choose a secure root password to access and manage your instance</p>
                        <input
                            type="text"
                            placeholder="Enter text..."
                            className="w-[80%] mt-4 ml-10 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xl ml-10 mt-10 mb-4">Password requirements</p>
                        <p className="ml-10"> * Requirement 1</p>
                        <p className="ml-10"> * Requirement 2</p>
                        <p className="ml-10"> * Requirement 3</p>

                    </div>
                    <p className="text-2xl pt-5 pb-5">Finalize Details</p>
                    <div className="bg-red-300 h-[200px] w-[650px] rounded-2xl flex flex-col  justify-start items-start">
                        <p className="text-xl font-bold ml-10 mt-10">Hostname</p>
                        <p className="ml-10 mt-2">Assign a unique hostname to help identify this instance</p>
                        <input
                            type="text"
                            placeholder="Enter text..."
                            className="w-[80%] mt-4 ml-10 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />


                    </div>
                    <p className="text-2xl pt-5 pb-5">Bill Summary</p>
                    <div className="bg-red-300 h-[200px] w-[650px] rounded-2xl flex flex-col  justify-start items-start mb-40">
                        <div className="  justify-center grid grid-cols-2  text-black text-lg pt-4 pb-6  font-semibold ">
                            <div className="mt-10 ml-6 ">
                                <p>xx CBC/month</p>
                                <p>xx GB CPU</p>
                                <p>xx GB SSDs</p>
                                <p>xx TB transfer</p>
                            </div>
                            <div className="ml-20 mt-10">
                                <div className="bg-[#D5C6E0] h-[120px] w-[200px] rounded-2xl flex flex-col ">
                                    <div className="mt-4">
                                        <p>Name</p>
                                        <p>OS</p>
                                        <p>Usage</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>



            </div>


            {/* Sticky Footer */}
            <footer className="fixed bottom-0 ml-4 left-60 w-[1000px] bg-[#D5C6E0] bg-opacity-50 text-black py-4  flex justify-end pr-4 ">
                <button className="bg-[#967AA1]  text-white px-6 py-2 rounded-lg hover:text-black">Create____</button>
            </footer>



        </>
    );
}

export default CreateInstance;
