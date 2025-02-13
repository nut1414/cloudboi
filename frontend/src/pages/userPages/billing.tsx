import React,{useState} from "react";

import BillingWrapper from "../../components/billingPageComponents/BillingWrapper";
import BillingComponent from "../../components/billingPageComponents/BillingComponent";

const Billing: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    return ( 
        <BillingWrapper active={activeTab} setActive={setActiveTab}>
            <BillingComponent active={activeTab} />
        </BillingWrapper>
    );
};

export default Billing;
