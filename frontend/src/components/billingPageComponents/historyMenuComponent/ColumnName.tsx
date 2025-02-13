import React from "react";


const ColumnName: React.FC = () => {

    return (
        <>
            {/* Header Row */}
            <div className="grid grid-cols-3 text-black text-lg pt-4 pb-6  font-semibold ">
                <span>Date</span>
                <span>Description</span>
                <span>Amount</span>
            </div>
        </>
    );
};

export default ColumnName;
