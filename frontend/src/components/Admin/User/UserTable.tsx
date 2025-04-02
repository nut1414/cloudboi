import React from "react";
import { User } from "../../../tmp/type";

interface UserTableProps {
  users: User[];
  onViewInstance: (user: User) => void;
}

export const UserTableHeader: React.FC = () => (
  <div className="grid grid-cols-6 text-white text-lg pt-4 pb-6 px-4 font-semibold text-center">
    <span>Username</span>
    <span>Email</span>
    <span>No. Of Instances</span>
    <span>Status</span>
    <span>Role</span>
    <span></span>
  </div>
);

interface UserTableRowProps {
  user: User;
  onViewInstance: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({ user, onViewInstance }) => (
  <div className="grid grid-cols-6 text-gray-300 text-md bg-[#23375F] mt-1 py-2 px-4 items-center">
    <span className="text-center">{user.username}</span>
    <span className="text-center mr-6">{user.email}</span>
    <span className="text-center">{user.noOfInstances}</span>
    <span
      className={`text-center font-semibold ${
        user.status === "Active" ? "text-green-500" : "text-red-500"
      }`}
    >
      {user.status}
    </span>
    <span className="text-center">{user.role}</span>
    <button
      onClick={() => onViewInstance(user)}
      className="bg-purple-600 shadow-md text-xs text-white py-2 rounded-2xl hover:bg-purple-700 transition-colors duration-300"
    >
      View Instance    
    </button>
  </div>
);

const UserTable: React.FC<UserTableProps> = ({ users, onViewInstance }) => {
  return (
    <div className="mt-[5vh] pb-16 mb-10 shadow-md w-[900px] bg-[#192A51] rounded-2xl">
      <UserTableHeader />
      <div className="max-h-[600px] overflow-y-auto">
        {users.length > 0 ? (
          users.map((user) => (
            <UserTableRow key={user.id} user={user} onViewInstance={onViewInstance} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No matching results found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserTable;
