// components/User/Billing/OverviewMenu/OverviewMenu.tsx
import React, { useMemo } from "react";
import { CreditCardIcon, ArrowDownTrayIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Button from "../../Common/Button";
import Section from "../../Common/Section";

const OverviewMenu: React.FC = () => {
    const EstimateUsagePaid = useMemo(() => {
        return (
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-400 mb-2">Estimated Due</p>
                    <p className="text-3xl font-bold text-white">45,000 CBC</p>
                    <p className="text-gray-400 text-sm mt-2">Next billing date: Jun 1, 2023</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4">
                        <p className="text-gray-400 mb-1">Total Usage</p>
                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-bold text-white">45,000 CBC</p>
                            <span className="text-green-400 text-sm">Within limits</span>
                        </div>
                    </div>

                    <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4">
                        <p className="text-gray-400 mb-1">Total Paid</p>
                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-bold text-white">120,000 CBC</p>
                            <span className="text-gray-400 text-sm">Lifetime</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, []);

    const PaymentMethod = useMemo(() => {
        return (
            <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="w-6 h-6 text-purple-500 mr-3" />
                        <div>
                            <p className="text-white font-medium">CBC Digital Currency</p>
                            <p className="text-gray-400 text-sm">Primary payment method</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        label="Manage Balance"
                        onClick={() => console.log("Manage CBC balance")}
                    />
                </div>

                <div className="border-t border-blue-900/30 pt-4 mt-4">
                    <div className="flex justify-between text-gray-300">
                        <p>Current Balance</p>
                        <p className="font-medium text-white">75,000 CBC</p>
                    </div>
                    <div className="flex justify-between text-gray-300 mt-2">
                        <p>Auto-recharge</p>
                        <p className="text-green-400">Enabled (10,000 CBC minimum)</p>
                    </div>
                </div>
            </div>
        );
    }, []);

    return (
        <>
            <Section 
                title="Billing Overview" 
                icon={<ArrowDownTrayIcon className="w-5 h-5" />}
                description="View your current billing status, estimated usage, and payment information."
            >
                {EstimateUsagePaid}
            </Section>

            <div className="mt-8"></div>

            <Section 
                title="Payment Method" 
                icon={<CreditCardIcon className="w-5 h-5" />}
                description="Manage your CBC digital currency balance and payment preferences."
            >
                {PaymentMethod}
            </Section>
        </>
    );
};

export default OverviewMenu;