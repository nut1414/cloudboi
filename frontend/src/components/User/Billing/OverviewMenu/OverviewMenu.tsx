import React from "react";

import EstimateUsagePaid from "./EstimateUsagePaid";
import PaymentMethod from "./PaymentMethod";

const OverviewMenu: React.FC = () => {

    return (
        <>
            <EstimateUsagePaid/>
            <PaymentMethod/>
        </>
    );
};

export default OverviewMenu;
