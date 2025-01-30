import React from "react";


const ColumnName: React.FC = () => {
    return (
        <>
            {/* Header Row */}
            <div className="  justify-center grid grid-cols-6 text-black text-lg pt-4 pb-6  font-semibold ">
                <span>Name</span>
                <span>OS</span>
                <span>Usage</span>
                <span>Instance Type</span>
                <span>Status</span>
                <span></span>

            </div>
        </>
    );
};
export default ColumnName;