import React from "react";


const PaymentMethod: React.FC = () => {

    return (
        <>
            <p className="text-white text-2xl mt-10 font-bold">Payment Method</p>
            <div className="mt-10 mb-10 bg-[#192A51]  shadow-md h-[300px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                <div className=" mt-10  justify-center  ">
                    <div className="text-white bg-[#23375F] shadow-md h-[180px] w-[600px] mt-4 ml-20  rounded-xl flex justify-center items-center ">
                        <p>Payment Method Details</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentMethod;
