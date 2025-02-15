import React from "react";

interface AvailableCreditProps {

}

const AvailableCredit: React.FC<AvailableCreditProps> = ({ }) => {
    return (
        <>
            <div className="pb-20">
                <li className="relative group p-4">
                    {/* bg-red-300 */}
                    <div className="shadow-md absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[50%] h-[180%] -z-10 bg-[#967AA1]  scale-110 rounded-md opacity-100 transition-all p-2">
                        <span className="absolute top-2 left-2 text-xs text-gray-700">
                            Available Credit:
                        </span>
                        <span className="absolute bottom-2 left-2 text-white  text-2xs">
                            1000 CBC
                        </span>
                    </div>
                </li>
            </div>
        </>
    );
};
export default AvailableCredit;