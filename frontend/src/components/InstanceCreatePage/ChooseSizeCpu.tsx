import React from "react";

interface ChooseSizeCpuProps {

}

const ChooseSizeCpu: React.FC<ChooseSizeCpuProps> = ({ }) => {
  
    return (
        <>
            <p className=" text-2xl pt-10 ">Choose Size</p>
                    <p className="pt-2 pb-4">CPU options</p>


                    <div className="flex gap-4">
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 1</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 2</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 3</p>
                        <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">Package 4</p>
                    </div>
        </>
    );
};
export default ChooseSizeCpu;