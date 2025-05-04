// components/User/Billing/OverviewMenu/OverviewMenu.tsx
import React, { useEffect, useState, useMemo } from "react"
import { CreditCardIcon, CurrencyDollarIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import Button from "../../Common/Button/Button"
import Section from "../../Common/Section"
import { useUserBilling } from "../../../hooks/User/useUserBilling"
import { CURRENCY } from "../../../constant/CurrencyConstant"

const OverviewMenu: React.FC = () => {
    const { userBillingOverview, userWallet, navigateToTopUp } = useUserBilling()
    const isZeroSubscription = userBillingOverview?.upcoming_payment?.total_subscription === 0

    // Memoize the estimate usage and paid components
    const EstimateUsagePaid = useMemo(() => {
        const upcoming_payment = userBillingOverview?.upcoming_payment
        const all_time_payment = userBillingOverview?.all_time_payment
        
        return (
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-400 mb-2">Estimated Due</p>
                    <p className="text-3xl font-bold text-white" data-testid="overview-menu-estimated-due">
                        {upcoming_payment?.sum_amount ? `${upcoming_payment.sum_amount} ${CURRENCY.SYMBOL}` : "-"}
                    </p>
                    <p className="text-gray-400 text-sm mt-2" data-testid="overview-menu-next-billing-date">
                        Next billing date: {upcoming_payment?.earliest_due_date || "-"}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4">
                        <p className="text-gray-400 mb-1">Active Subscriptions</p>
                        <div className="flex justify-between items-center" data-testid="overview-menu-active-subscriptions">
                            <p className="text-2xl font-bold text-white">
                                {upcoming_payment?.total_subscription}
                            </p>
                            <span className={`text-sm ${isZeroSubscription ? 'text-gray-500' : 'text-green-400'}`}>
                                {isZeroSubscription ? 'None' : 'Active'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4">
                        <p className="text-gray-400 mb-1">Total Paid</p>
                        <div className="flex justify-between items-center" data-testid="overview-menu-total-paid-cycle">
                            <p className="text-2xl font-bold text-white">
                                {all_time_payment?.sum_amount ? `${all_time_payment.sum_amount} ${CURRENCY.SYMBOL}` : "-"}
                            </p>
                            <span className="text-gray-400 text-sm">
                                {all_time_payment?.total_cycle} payment cycle(s)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [userBillingOverview])

    // Memoize the payment method component
    const PaymentMethod = useMemo(() => {
        return (
            <div className="bg-[#23375F]/70 rounded-lg shadow border border-blue-800/30 p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="w-6 h-6 text-purple-500 mr-3" />
                        <div>
                            <p className="text-white font-medium">{CURRENCY.NAME}</p>
                            <p className="text-gray-400 text-sm">Primary payment method</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        label="Top Up Balance"
                        onClick={navigateToTopUp}
                        data-testid="overview-menu-top-up-balance"
                    />
                </div>

                <div className="border-t border-blue-900/30 pt-4 mt-4">
                    <div className="flex justify-between text-gray-300">
                        <p>Current Balance</p>
                        <p className="font-medium text-white" data-testid="overview-menu-current-balance">
                            {`${userWallet?.balance} ${CURRENCY.SYMBOL}`}
                        </p>
                    </div>
                    <div className="flex justify-between text-gray-300 mt-2">
                        <p>Last Updated</p>
                        <p className="text-green-400">
                            {userWallet?.last_updated_at}
                        </p>
                    </div>
                </div>
            </div>
        )
    }, [userWallet, navigateToTopUp])

    return (
        <>
            <Section 
                title="Billing Overview" 
                icon={<ChartBarIcon className="w-5 h-5" />}
                description="View your current billing status, estimated usage, and payment information."
            >
                {EstimateUsagePaid}
            </Section>
            <Section 
                title="Payment Method" 
                icon={<CreditCardIcon className="w-5 h-5" />}
                description={`Manage your ${CURRENCY.NAME} balance and payment preferences.`}
                className="mt-8"
            >
                {PaymentMethod}
            </Section>
        </>
    )
}

export default React.memo(OverviewMenu)