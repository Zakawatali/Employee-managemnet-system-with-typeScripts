
// import toast from "react-hot-toast";
// import axios from "./../../util/axiosInstance";
// import React, { useEffect, useState } from "react";
// import { MdEmail } from "react-icons/md";
// import { User2Icon } from "lucide-react";

// function EmployeeApproval() {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [positionFilter, setPositionFilter] = useState("All");
//   const [selectedUser, setSelectedUser] = useState(null); // ✅ For modal

//   // ✅ Load employees
//   useEffect(() => {
//   async function employees() {
//     try {
//       const res = await axios.get("/api/users");
//       console.log(res); // ✅ debug

//       // ✅ users array ko state me set karna
//       setUsers(res?.data?.data || []); 
//       setFilteredUsers(res?.data?.data || []);

//     } catch (error) {
//       toast.error(error?.response?.data?.message || error?.message);
//     }
//   }
//   employees();
// }, []);


//   // ✅ Approve user
//   const handleAccept = async (userId) => {
//     try {
//       const res = await axios.post(`/api/users/approve/${userId}`);
//       if (res.data.success) {
//         toast.success(res?.data?.message || "User approved!");
//         setUsers((prev) =>
//           prev.map((u) =>
//             u._id === userId ? { ...u, status: "APPROVED" } : u
//           )
//         );
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   // ❌ Reject user
//   const handleReject = async (userId) => {
//     try {
//       const res = await axios.post(`/api/users/reject/${userId}`);
//       if (res.data.success) {
//         toast.success(res?.data?.message || "User rejected!");
//         setUsers((prev) =>
//           prev.map((u) =>
//             u._id === userId ? { ...u, status: "REJECTED" } : u
//           )
//         );
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   // ✅ Filter logic
//   useEffect(() => {
//     let temp = users;

//     if (search.trim() !== "") {
//       temp = temp.filter(
//         (u) =>
//           u.firstName.toLowerCase().includes(search.toLowerCase()) ||
//           u.lastName.toLowerCase().includes(search.toLowerCase()) ||
//           u.email.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (positionFilter !== "All") {
//       temp = temp.filter((u) => u.position === positionFilter);
//     }

//     setFilteredUsers(temp);
//   }, [search, positionFilter, users]);

//   const positions = ["All", ...new Set(users.map((u) => u.position))];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col gap-1 mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Employee, <span className="text-blue-600"> Approvals</span>
//         </h1>
//         <p className="text-gray-500">
//           Manage pending employees and approve/reject their access
//         </p>
//       </div>

//       {/* Search + Filter */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="🔍 Search by name or email..."
//           className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select
//           className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           value={positionFilter}
//           onChange={(e) => setPositionFilter(e.target.value)}
//         >
//           {positions.map((pos, idx) => (
//             <option key={idx} value={pos}>
//               {pos}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ✅ User List */}
//       <div className="space-y-5">
//         {filteredUsers.length === 0 ? (
//           <p className="text-center text-gray-500">No employees found</p>
//         ) : (
//           filteredUsers.map((user) => (
//             <div
//               key={user._id}
//               className="w-full bg-white shadow-sm hover:shadow-md transition rounded-xl border border-gray-200 p-5"
//             >
//               {/* Top Row */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
//                     {user.firstName[0]}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-800 flex items-center gap-2">
//                       <User2Icon className="w-5 h-5 text-blue-600" />
//                       {user.firstName + " " + user.lastName}
//                     </p>
//                     <p className="text-sm text-gray-500 flex items-center gap-1">
//                       <MdEmail className="text-blue-400" />
//                       {user.email}
//                     </p>
//                   </div>
//                 </div>

//                 {/* ✅ Action Buttons */}
//                 <div className="flex gap-2">
//                   {user.status === "PENDING" && (
//                     <>
//                       <button
//                         onClick={() => handleAccept(user._id)}
//                         className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
//                       >
//                         ✅ Approve
//                       </button>
//                       <button
//                         onClick={() => handleReject(user._id)}
//                         className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
//                       >
//                         ❌ Reject
//                       </button>
//                     </>
//                   )}
//                   <button
//                     onClick={() => setSelectedUser(user)} // ✅ open modal
//                     className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
//                   >
//                     👁 View
//                   </button>
//                 </div>
//               </div>

//               {/* Status */}
//               <div className="mt-3">
//                 <span
//                   className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                     user.status === "APPROVED"
//                       ? "bg-green-100 text-green-700"
//                       : user.status === "PENDING"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {user.status}
//                 </span>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ✅ Modal (modern cards instead of form) */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//               Employee Details
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
//                 <p className="text-xs text-gray-500">First Name</p>
//                 <p className="font-semibold text-gray-800">
//                   {selectedUser.firstName}
//                 </p>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
//                 <p className="text-xs text-gray-500">Last Name</p>
//                 <p className="font-semibold text-gray-800">
//                   {selectedUser.lastName}
//                 </p>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
//                 <p className="text-xs text-gray-500">Email</p>
//                 <p className="font-semibold text-gray-800">
//                   {selectedUser.email}
//                 </p>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
//                 <p className="text-xs text-gray-500">Position</p>
//                 <p className="font-semibold text-gray-800">
//                   {selectedUser.position}
//                 </p>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
//                 <p className="text-xs text-gray-500">Experience</p>
//                 <p className="font-semibold text-gray-800">
//                   {selectedUser.experience} yrs
//                 </p>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
//                 <p className="text-xs text-gray-500">Status</p>
//                 <span
//                   className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-semibold ${
//                     selectedUser.status === "APPROVED"
//                       ? "bg-green-100 text-green-700"
//                       : selectedUser.status === "PENDING"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {selectedUser.status}
//                 </span>
//               </div>
//             </div>

//             {/* Close button */}
//             <button
//               onClick={() => setSelectedUser(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default EmployeeApproval;
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios  from "./../../util/axiosInstance";
import { MdEmail } from "react-icons/md";
import { User2Icon } from "lucide-react";

// ------------------------
// TYPES
// ------------------------

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  experience: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
}

// ------------------------
// COMPONENT
// ------------------------

const EmployeeApproval: React.FC = () => {
  const [users, setUsers] = useState<Employee[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>("");
  const [positionFilter, setPositionFilter] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null); // ✅ Modal

  // ✅ Load employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await axios.get<{ success: boolean; data: Employee[] }>("/api/users");
        setUsers(res.data.data || []);
        setFilteredUsers(res.data.data || []);
      } catch (error) {
        const err = error as any;
        toast.error(err?.response?.data?.message || err.message);
      }
    }
    fetchEmployees();
  }, []);

  // ✅ Approve user
  const handleAccept = async (userId: string) => {
    try {
      const res = await axios.post<{ success: boolean; message: string }>(`/api/users/approve/${userId}`);
      if (res.data.success) {
        toast.success(res.data.message || "User approved!");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: "APPROVED" } : u))
        );
      }
    } catch (error) {
      const err = error as any;
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  // ✅ Reject user
  const handleReject = async (userId: string) => {
    try {
      const res = await axios.post<{ success: boolean; message: string }>(`/api/users/reject/${userId}`);
      if (res.data.success) {
        toast.success(res.data.message || "User rejected!");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: "REJECTED" } : u))
        );
      }
    } catch (error) {
      const err = error as any;
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  // ✅ Filter logic
  useEffect(() => {
    let temp = [...users];

    if (search.trim() !== "") {
      temp = temp.filter(
        (u) =>
          u.firstName.toLowerCase().includes(search.toLowerCase()) ||
          u.lastName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (positionFilter !== "All") {
      temp = temp.filter((u) => u.position === positionFilter);
    }

    setFilteredUsers(temp);
  }, [search, positionFilter, users]);

  const positions = ["All", ...Array.from(new Set(users.map((u) => u.position)))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Employee, <span className="text-blue-600"> Approvals</span>
        </h1>
        <p className="text-gray-500">
          Manage pending employees and approve/reject their access
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          {positions.map((pos, idx) => (
            <option key={idx} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ User List */}
      <div className="space-y-5">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500">No employees found</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="w-full bg-white shadow-sm hover:shadow-md transition rounded-xl border border-gray-200 p-5"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
                    {user.firstName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <User2Icon className="w-5 h-5 text-blue-600" />
                      {user.firstName + " " + user.lastName}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MdEmail className="text-blue-400" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* ✅ Action Buttons */}
                <div className="flex gap-2">
                  {user.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAccept(user._id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedUser(user)} // ✅ open modal
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                  >
                    👁 View
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : user.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Modal (modern cards instead of form) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              Employee Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">First Name</p>
                <p className="font-semibold text-gray-800">{selectedUser.firstName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Last Name</p>
                <p className="font-semibold text-gray-800">{selectedUser.lastName}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{selectedUser.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Position</p>
                <p className="font-semibold text-gray-800">{selectedUser.position}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Experience</p>
                <p className="font-semibold text-gray-800">{selectedUser.experience} yrs</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-semibold ${
                    selectedUser.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : selectedUser.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeApproval;
