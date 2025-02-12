import React from "react";
import { twMerge } from 'tailwind-merge';


import TopUpAmountButton from "./Top-upAmountButton";


interface TopUpAmountButtonGroupProps {
    amounts: number[];
    check: boolean;
    onAmountSelect: (amount: number) => void;
}
const TopUpAmountButtonGroup: React.FC<TopUpAmountButtonGroupProps> = ({ amounts,check, onAmountSelect }) => {
    return (
        <div className={twMerge("flex justify-center space-x-4 mt-4 ",(check === false) ? "ml-20" : "ml-10")}> 
            {amounts.map((amount) => (
                <TopUpAmountButton key={amount} amount={amount} onClick={() => onAmountSelect(amount)} />
            ))}
        </div>
    );
};
export default TopUpAmountButtonGroup;

