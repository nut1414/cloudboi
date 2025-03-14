import React from "react";
import { BillingItem } from "../../../../tmp/type";
interface ContainerBillingProps {
    billing: BillingItem[];
}

const ContainerHistory: React.FC<ContainerBillingProps> = ({ billing }) => {
    return (
        <div className="max-h-[400px] overflow-y-auto">
            {billing.map((item, index) => (
                <div key={index} className="grid grid-cols-3 text-black text-md bg-red-300 border-b py-2 px-4 gap-10">
                    <span className="text-center">{item.date}</span>
                    <span className="text-center">{item.description}</span>
                    <span className="text-center">{item.amount}</span>
                </div>
            ))}
        </div>
    );
};

export default ContainerHistory;
