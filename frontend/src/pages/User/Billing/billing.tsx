import React,{useState} from "react";

import BillingWrapper from "../../../components/User/BillingPage/BillingWrapper";
import BillingComponent from "../../../components/User/BillingPage/BillingComponent";

const Billing: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    return ( 
        <BillingWrapper active={activeTab} setActive={setActiveTab}>
            <BillingComponent active={activeTab} />
        </BillingWrapper>
    );
};

export default Billing;
