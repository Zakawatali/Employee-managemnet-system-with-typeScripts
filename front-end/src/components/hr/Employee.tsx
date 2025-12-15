// import React, { useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { User, Mail, Briefcase } from "lucide-react";
// import Sidebar from "../sideBar";

// export default function Employee() {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("/api/employee/"); // ✅ added missing slash
//       setEmployees(res.data.data?.employees || []);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-600 animate-pulse">Loading employees...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
//       {/* Sidebar - responsive */}
//       <div className="w-full md:w-64 shadow-md bg-white">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 mt-12 md:mt-0">
//         {/* Heading */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             All <span className="text-blue-600">Employees</span>
//           </h1>
//           <p className="text-gray-500">View all employees here</p>
//         </div>

//         {/* Employees List */}
//         {employees.length === 0 ? (
//           <p className="text-gray-500 text-center py-6">No employees found.</p>
//         ) : (
//           <div className="space-y-4">
//             {employees.map((emp) => (
//               <div
//                 key={emp._id}
//                 className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xl transition"
//               >
//                 {/* Left Side (Avatar + Info) */}
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
//                     {emp.firstName?.charAt(0) || "E"}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-800 flex items-center gap-2">
//                       <User size={16} className="text-blue-500" />
//                       {emp.firstName} {emp.lastName}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-2 break-all">
//                       <Mail size={16} className="text-green-500" />
//                       {emp.email}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-2">
//                       <Briefcase size={16} className="text-purple-500" />
//                       {emp.position || "Employee"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Right Side (Role Badge) */}
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
//                     emp.role === "ADMIN"
//                       ? "bg-red-100 text-red-700"
//                       : emp.role === "HR"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-green-100 text-green-700"
//                   }`}
//                 >
//                   {emp.role || "Employee"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import { User, Mail, Briefcase } from "lucide-react";
import Sidebar from "../sideBar";

// ------------------------
// TYPES
// ------------------------
interface EmployeeType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  role?: "ADMIN" | "HR" | "EMPLOYEE" | string;
}

// Axios response type
interface FetchEmployeesResponse {
  success: boolean;
  data: {
    employees: EmployeeType[];
  };
}

// ------------------------
// COMPONENT
// ------------------------
const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get<FetchEmployeesResponse>("/api/employee/");
      setEmployees(res.data.data?.employees || []);
    } catch (error) {
      const err = error as any;
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 animate-pulse">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 shadow-md bg-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-12 md:mt-0">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            All <span className="text-blue-600">Employees</span>
          </h1>
          <p className="text-gray-500">View all employees here</p>
        </div>

        {/* Employees List */}
        {employees.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No employees found.</p>
        ) : (
          <div className="space-y-4">
            {employees.map((emp) => (
              <div
                key={emp._id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xl transition"
              >
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {emp.firstName?.charAt(0) || "E"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <User size={16} className="text-blue-500" />
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 break-all">
                      <Mail size={16} className="text-green-500" />
                      {emp.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Briefcase size={16} className="text-purple-500" />
                      {emp.position || "Employee"}
                    </p>
                  </div>
                </div>

                {/* Right Side (Role Badge) */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                    emp.role === "ADMIN"
                      ? "bg-red-100 text-red-700"
                      : emp.role === "HR"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {emp.role || "Employee"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
