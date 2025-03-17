import React from "react";
import ColumnName from "./ColumnName";
import ContainerHistory from "./ContainerHistory";
import { BillingItem } from "../../../../tmp/type";

const billingData: BillingItem[] = [
    { date: "2025-02-01", description: "Subscription", amount: "$10" },
    { date: "2025-01-01", description: "Addon", amount: "$5" },
    { date: "2025-01-01", description: "Addon", amount: "$5" },
    { date: "2025-01-01", description: "Addon", amount: "$5" },
];

const HistoryMenu: React.FC = () => {
    return (
        <div className="mt-10 bg-red-300 shadow-md w-[780px] rounded-2xl pb-10">
            <div className="bg-[#F5E6E8] shadow-md w-[700px] mt-10 ml-10 pb-14 rounded-xl">
                <ColumnName />
                <ContainerHistory billing={billingData} />
            </div>
        </div>
    );
};

export default HistoryMenu;
