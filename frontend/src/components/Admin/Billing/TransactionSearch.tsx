import React from "react";

interface TransactionSearchProps {
  search: string;
  searchType: string;
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
}

const TransactionSearch: React.FC<TransactionSearchProps> = ({
  search,
  searchType,
  onSearchChange,
  onSearchTypeChange,
}) => (
  <div className="mt-6 justify-center grid grid-cols-2 gap-10">
    <input
      type="text"
      placeholder={`Search by ${searchType}...`}
       className="bg-[#23375F] text-gray-300 placeholder-gray-300 pl-4 pr-20 py-2 rounded-2xl border-transparent border-[#D5C6E0] border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <select
      id="os"
      className="bg-[#23375F] text-gray-300 border border-gray-300 rounded-2xl h-[50px] w-[200px] text-black text-center"
      value={searchType}
      onChange={(e) => onSearchTypeChange(e.target.value)}
    >
      <option value="username">Username</option>
      <option value="type">Type</option>
      <option value="status">Status</option>
      <option value="amount">Amount</option>
    </select>
  </div>
);

export default TransactionSearch;
