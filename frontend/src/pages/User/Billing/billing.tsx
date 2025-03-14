import React,{useState} from "react";

import BillingWrapper from "../../../components/User/Billing/BillingWrapper";
import BillingComponent from "../../../components/User/Billing/BillingComponent";

const Billing: React.FC = () => {
    const [activeTab, setActiveTab] = useState("OverviewMenu");

    return ( 
        <BillingWrapper active={activeTab} setActive={setActiveTab}>
            <BillingComponent active={activeTab} />
        </BillingWrapper>
    );
};

export default Billing;
