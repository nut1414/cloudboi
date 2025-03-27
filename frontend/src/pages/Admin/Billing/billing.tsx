import React, { useState } from "react";

import PaymentSummary from "../../../components/Admin/Billing/PaymentSummary";
import TransactionSearch from "../../../components/Admin/Billing/TransactionSearch";
import TransactionTable from "../../../components/Admin/Billing/TransactionTable";
import { BillingTransaction } from "../../../tmp/type";

const transactions: BillingTransaction[] = [
    { id: "1", date: "Oct 25, 2025 10:15:11", username: "johncena88", type: "Top-up", status: "success", amount: 5000 },
    { id: "2", date: "Oct 24, 2025 10:15:11", username: "aaa", type: "Top-up", status: "success", amount: 1000 },
    { id: "3", date: "Oct 23, 2025 10:15:11", username: "bbb", type: "Subscription", status: "success", amount: 2000 },
    { id: "4", date: "Oct 22, 2025 10:15:11", username: "ccc", type: "Top-up", status: "success", amount: 800 },
    { id: "5", date: "Oct 21, 2025 10:15:11", username: "eee", type: "Subscription", status: "cancel", amount: 1200 },
];

const BillingAdmin: React.FC = () => {
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("username");

    // Filter transactions based on search input and selected type
    const filteredTransactions = transactions.filter((transaction) =>
        transaction[searchType as keyof BillingTransaction]
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <>
            <div className="absolute shadow-md top-14 left-72 mt-4 w-[880px] h-[4px] bg-red-300 bg-opacity-50 z-[-1] rounded-full"></div>
            <div className="text-black absolute top-4 left-80 z-0">
                <div className="flex flex-col justify-start items-start">
                    <p className="text-4xl font-bold">Billing Admin</p>
                    <div className="mt-10 bg-red-300 shadow-md h-[220px] w-auto rounded-2xl flex flex-col justify-start items-start">
                        <div className="bg-[#F5E6E8] shadow-md h-[140px] w-auto mt-10 ml-10 mr-6 rounded-xl flex flex-col justify-start items-start">
                            <div className="mt-4 ml-6 mr-6 flex items-center space-x-4">
                                <PaymentSummary title="Paid" amount={1271.52} label="CBCs" textColorClass="text-[#89BC4A]" />
                                <div className="shadow-md mr-2 w-[4px] h-[100px] bg-[#967AA1] rounded-full"></div>
                                <PaymentSummary title="Pending" amount={271.52} label="CBCs" textColorClass="text-[#D4B96C]" />
                                <div className="shadow-md mr-2 w-[4px] h-[100px] bg-[#967AA1] rounded-full"></div>
                                <PaymentSummary title="Canceled" amount={271.52} label="CBCs" textColorClass="text-[#CD4E4E]" />
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-2xl font-bold">All Transactions</p>
                    <TransactionSearch
                        search={search}
                        searchType={searchType}
                        onSearchChange={setSearch}
                        onSearchTypeChange={setSearchType}
                    />
                    <TransactionTable instances={filteredTransactions} />
                </div>
            </div>
        </>
    );
};

export default BillingAdmin;