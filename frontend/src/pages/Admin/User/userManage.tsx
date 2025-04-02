// UserManage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserSearch from "../../../components/Admin/User/UserSearch";
import UserTable from "../../../components/Admin/User/UserTable";
import { User } from "../../../tmp/type";

const usersData: User[] = [
  { username: "johncena888", email: "johncena@email.com", id: "ansldin129ndasn12e", noOfInstances: 6, status: "Active", role: "user" },
  { username: "somchai", email: "somchai@email.com", id: "ansldin129ndasn12e", noOfInstances: 5, status: "Active", role: "user" },
  { username: "sompong", email: "johncena@email.com", id: "ansldin129ndasn12e", noOfInstances: 4, status: "Active", role: "user" },
  { username: "somsri", email: "johncena@email.com", id: "ansldin129ndasn12e", noOfInstances: 3, status: "Active", role: "user" },
  { username: "somsuk", email: "johncena@email.com", id: "ansldin129ndasn12e", noOfInstances: 2, status: "Active", role: "user" },
  { username: "somporn", email: "johncena@email.com", id: "ansldin129ndasn12e", noOfInstances: 1, status: "Active", role: "user" },
];

const UserManage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<keyof User>("username");

  const { adminName } = useParams<{ adminName: string }>(); // สมมติว่า route มี adminName เป็น parameter
  const navigate = useNavigate();

  // ค้นหา user ตาม search input และ selected search type.
  const filteredUsers = usersData.filter((user) =>
    user[searchType]?.toString().toLowerCase().includes(search.toLowerCase())
  );

  // ฟังก์ชันสำหรับเปลี่ยนหน้าไปยัง instance page
  const onViewInstance = (user: User) => {
    // สร้าง path โดยใช้ adminName และ user.username (หรือข้อมูลอื่น ๆ ตามที่ต้องการ)
    navigate(`/admin/${adminName}/${user.username}/instance`);
  };

  return (
    <>
      <div className="absolute shadow-md top-14 ml-8 mt-8 w-[920px] h-[4px] bg-purple-600 bg-opacity-50 z-[-1] rounded-full"></div>
      <div className="absolute top-4 left-80">
        <div className="flex flex-col justify-start items-start">
          <p className="text-white text-4xl font-bold">User Manage</p>
          <UserSearch
            search={search}
            searchType={searchType}
            onSearchChange={(e) => setSearch(e.target.value)}
            onSearchTypeChange={(e) => setSearchType(e.target.value as keyof User)}
          />
          <p className="text-gray-300 mt-8 pl-0 mr-96">
            Displaying {filteredUsers.length} items
          </p>
          <UserTable users={filteredUsers} onViewInstance={onViewInstance} />
        </div>
      </div>
    </>
  );
};

export default UserManage;
