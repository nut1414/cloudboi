// pages/User/Billing/Billing.tsx
import React, { useState } from "react";
import {
    CreditCardIcon,
    ArrowPathIcon,
    PlusCircleIcon
} from "@heroicons/react/24/outline";
import PageContainer from "../../components/Layout/PageContainer";
import TabNavigation, { TabItem } from "../../components/Common/Tab/TabNavigation";
import UserBillingContent from "../../components/User/Billing/UserBillingContent";

const UserBillingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("OverviewMenu");

    // Define tabs with icons for better visual hierarchy
    const tabs: TabItem[] = [
        { id: "OverviewMenu", label: "Overview", icon: <CreditCardIcon className="w-5 h-5" /> },
        { id: "HistoryMenu", label: "History", icon: <ArrowPathIcon className="w-5 h-5" /> },
        { id: "TopUpMenu", label: "Top Up", icon: <PlusCircleIcon className="w-5 h-5" /> },
    ];

    return (
        <PageContainer
            title="Billing"
            subtitle="Manage your payments and credits"
        >
            {/* Navigation Tabs with Active Indicator */}
            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Content Area */}
            <UserBillingContent active={activeTab} />
        </PageContainer>
    );
};

export default UserBillingPage;
