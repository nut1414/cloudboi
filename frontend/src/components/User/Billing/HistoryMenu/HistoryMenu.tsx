import React from "react";

import ColumnName from "./ColumnName";
import ContainerHistory from "./ContainerHistory";

const HistoryMenu: React.FC = () => {

    const items = [
        { date: '2025-02-01', description: 'Subscription', amount: '$10' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        { date: '2025-01-01', description: 'Addon', amount: '$5' },
        
    ];

    return (
        <>
            <div className="mt-10 bg-red-300  shadow-md w-[780px] rounded-2xl pb-10 ">
                <div className="bg-[#F5E6E8] shadow-md  w-[700px] mt-10 ml-10  pb-14 rounded-xl  items-center">
                    <ColumnName/>
                    <ContainerHistory billing={items} />
                </div>
            </div>
        </>
    );
};

export default HistoryMenu;
