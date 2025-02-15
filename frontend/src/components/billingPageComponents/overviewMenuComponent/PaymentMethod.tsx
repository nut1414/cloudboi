import React from "react";


const PaymentMethod: React.FC = () => {

    return (
        <>
            <p className="text-2xl mt-10 font-bold">Payment Method</p>
            <div className="mt-10 mb-10 bg-red-300  shadow-md h-[300px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                <div className=" mt-10  justify-center  ">
                    <div className="bg-[#F5E6E8] shadow-md h-[180px] w-[600px] mt-4 ml-20  rounded-xl flex justify-center items-center ">
                        <p>Payment Method Details</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentMethod;
