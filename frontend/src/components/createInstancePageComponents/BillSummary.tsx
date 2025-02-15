import React from "react";

interface BillSummaryProps {

}

const BillSummary: React.FC<BillSummaryProps> = ({ }) => {
   
    return (
        <>
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
        </>
    );
};
export default BillSummary;