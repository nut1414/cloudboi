import React from "react";
import { User } from "../../../tmp/type";
import { Icon } from "../../../assets/Icon";

interface UserSearchProps {
    search: string;
    searchType: keyof User;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const searchOptions = [
    { value: "username", label: "Username" },
    { value: "email", label: "Email" },
    { value: "id", label: "User ID" },
    { value: "noOfInstances", label: "No Of Instances" },
    { value: "status", label: "Status" },
    { value: "role", label: "Role" },
];

const UserSearch: React.FC<UserSearchProps> = ({
    search,
    searchType,
    onSearchChange,
    onSearchTypeChange,
}) => {
    return (
        <div className="mt-16 flex items-center space-x-10">
            <select
                className="bg-[#23375F] border border-gray-300 rounded-2xl h-[50px] w-[200px] text-gray-300 text-center"
                value={searchType}
                onChange={onSearchTypeChange}
            >
                {searchOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="relative">
                <input
                    type="text"
                    placeholder={`Search by ${searchType}...`}
                    className="bg-[#23375F] text-gray-300 placeholder-gray-300 
               pl-4 pr-10 py-2 rounded-2xl 
               border-transparent border-[#D5C6E0] border-2 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={onSearchChange}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                    {Icon.Search}
                </div>
            </div>
        </div>
    );
};

export default UserSearch;
