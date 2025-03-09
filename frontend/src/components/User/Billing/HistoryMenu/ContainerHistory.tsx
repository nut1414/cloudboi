import React from "react";

interface Billing {
    date: string;
    description: string;
    amount: string;

}

interface ContainerBillingProps {
    billing: Billing[];
}

const ContainerHistory: React.FC<ContainerBillingProps> = ({ billing }) => {

    return (
        <>
            <div className="max-h-[400px] overflow-y-auto">
                {billing.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 text-black text-md bg-red-300 border-b py-2 px-4 gap-10">
                        <span className="text-center">{item.date}</span>
                        <span className="text-center">{item.description}</span>
                        <span className="text-center">{item.amount}</span>
                    </div>
                ))}
            </div>
        </>
    );
};
export default ContainerHistory;