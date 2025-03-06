import React from "react";

interface ChooseAuthenMethodProps {

}

const ChooseAuthenMethod: React.FC<ChooseAuthenMethodProps> = ({ }) => {
   
    return (
        <>
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
        </>
    );
};
export default ChooseAuthenMethod;