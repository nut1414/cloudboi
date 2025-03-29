import React from "react";


const ColumnName: React.FC = () => {

    return (
        <>
            {/* Header Row */}
            <div className="ml-24 grid grid-cols-3 text-lg pt-4 pb-6  font-semibold ">
                <span>Date</span>
                <span>Description</span>
                <span className="ml-12">Amount</span>
            </div>
        </>
    );
};

export default ColumnName;
