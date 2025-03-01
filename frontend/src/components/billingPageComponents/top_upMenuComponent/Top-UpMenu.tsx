import React,{ useState } from "react";

import TopUpInput from "./Top-upInput";
import TopUpButton from "./Top-upButton";
import TopUpAmountButtonGroup from "./Top-upAmountButtonGroup";

const TopUpMenu: React.FC = () => {
    const [creditValue, setCreditValue] = useState<number | "">("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        setCreditValue(rawValue === "" ? "" : Number(rawValue));
    };

    return (
        <>
            <p className="mt-8 text-xl font-bold">Total Credit: 1000 CBC</p>
            <div className="mt-10 bg-red-300 shadow-md h-[400px] w-[800px] rounded-2xl flex flex-col justify-start items-start">
                        <p className="ml-10 mt-8 text-3xl text-white font-bold">Top Up</p>
                        <div className="mt-10 justify-center grid grid-cols-2 gap-40">
                            <TopUpInput creditValue={creditValue} onChange={handleInputChange} />
                            <TopUpButton onClick={() => console.log("Top-up clicked with amount:", creditValue)} />
                        </div>
                        <TopUpAmountButtonGroup amounts={[100, 200, 300, 500, 1000]} check={true} onAmountSelect={setCreditValue} />
                        <TopUpAmountButtonGroup amounts={[1500, 2000, 2500, 5000]} check={false} onAmountSelect={setCreditValue} />           
            </div>
        </>
    );
};

export default TopUpMenu;
