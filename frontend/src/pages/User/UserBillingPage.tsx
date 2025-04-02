// pages/User/Billing/Billing.tsx
import React, { useState } from "react"
import {
    CreditCardIcon,
    PlusCircleIcon,
    ClockIcon,
    DocumentMagnifyingGlassIcon
} from "@heroicons/react/24/outline"
import PageContainer from "../../components/Layout/PageContainer"
import TabNavigation, { TabItem } from "../../components/Common/Tab/TabNavigation"
import UserBillingContent from "../../components/User/Billing/UserBillingContent"
import { useUserBilling } from "../../hooks/User/useUserBilling"
import TabSkeletonLoader from "../../components/Common/Tab/TabSkeletonLoader"

const UserBillingPage: React.FC = () => {
    const { isLoading } = useUserBilling()
    const [activeTab, setActiveTab] = useState("OverviewMenu")

    // Define tabs with icons for better visual hierarchy
    const tabs: TabItem[] = [
        { id: "OverviewMenu", label: "Overview", icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" /> },
        { id: "HistoryMenu", label: "History", icon: <ClockIcon className="w-5 h-5" /> },
        { id: "TopUpMenu", label: "Top Up", icon: <PlusCircleIcon className="w-5 h-5" /> },
    ]

    return (
        <PageContainer
            title="Billing"
            subtitle="Manage your payments and credits"
            subtitleIcon={<CreditCardIcon className="w-5 h-5" />}
        >
            {isLoading ? (
                <TabSkeletonLoader count={tabs.length} />
            ) : (
                <>
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <UserBillingContent active={activeTab} />
                </>
            )}
        </PageContainer>
    )
}

export default UserBillingPage
