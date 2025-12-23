
// import React, { useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { User, Mail, Briefcase } from "lucide-react";
// import Sidebar from "../sideBar";

// // ------------------------
// // TYPES
// // ------------------------
// interface EmployeeType {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   position?: string;
//   role?: "ADMIN" | "HR" | "EMPLOYEE" | string;
// }

// interface FetchEmployeesResponse {
//   success: boolean;
//   data: {
//     employees: EmployeeType[];
//     page: number;
//     limit: number;
//     totalPages: number;
//     totalEmployees: number;
//   };
// }

// // ------------------------
// // COMPONENT
// // ------------------------
// const Employee: React.FC = () => {
//   const [employees, setEmployees] = useState<EmployeeType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [page, setPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);

//   const LIMIT = 5;

//   const fetchEmployees = async (pageNumber: number) => {
//     try {
//       setLoading(true);
//       const res = await axios.get<FetchEmployeesResponse>(
//         `/api/employee?page=${pageNumber}&limit=${LIMIT}`
//       );

//       setEmployees(res.data.data.employees);
//       setPage(res.data.data.page);
//       setTotalPages(res.data.data.totalPages);
//     } catch (error) {
//       const err = error as any;
//       toast.error(err?.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees(page);
//   }, [page]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-600 animate-pulse">
//           Loading employees...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
     

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
//           <p className="text-gray-500 text-center py-6">
//             No employees found.
//           </p>
//         ) : (
//           <>
//             <div className="space-y-4">
//               {employees.map((emp) => (
//                 <div
//                   key={emp._id}
//                   className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xl transition"
//                 >
//                   {/* Left Side */}
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
//                       {emp.firstName?.charAt(0) || "E"}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-800 flex items-center gap-2">
//                         <User size={16} className="text-blue-500" />
//                         {emp.firstName} {emp.lastName}
//                       </p>
//                       <p className="text-sm text-gray-600 flex items-center gap-2 break-all">
//                         <Mail size={16} className="text-green-500" />
//                         {emp.email}
//                       </p>
//                       <p className="text-sm text-gray-600 flex items-center gap-2">
//                         <Briefcase size={16} className="text-purple-500" />
//                         {emp.position || "Employee"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right Side (Role Badge) */}
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
//                       emp.role === "ADMIN"
//                         ? "bg-red-100 text-red-700"
//                         : emp.role === "HR"
//                         ? "bg-blue-100 text-blue-700"
//                         : "bg-green-100 text-green-700"
//                     }`}
//                   >
//                     {emp.role || "Employee"}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex justify-between items-center  mt-8">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage(page - 1)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               <span className="text-sm text-gray-700">
//                 Page <b>{page}</b> of <b>{totalPages}</b>
//               </span>

//               <button
//                 disabled={page === totalPages}
//                 onClick={() => setPage(page + 1)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };


// export default Employee;
import React, { useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import { User, Mail, Briefcase } from "lucide-react";

// ------------------------
// TYPES
// ------------------------
interface EmployeeType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  department?: "HR" | "IT" | "Finance" | "Marketing" | "Sales" | string;
  role?: "ADMIN" | "HR" | "EMPLOYEE" | string;
}

interface FetchEmployeesResponse {
  success: boolean;
  data: {
    employees: EmployeeType[];
    page: number;
    limit: number;
    totalPages: number;
    totalEmployees: number;
  };
}

// ------------------------
// COMPONENT
// ------------------------
const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 🔍 Filters
  const [search, setSearch] = useState<string>("");
  const [department, setDepartment] = useState<string>("");

  const [triggerSearch, setTriggerSearch] = useState<boolean>(false); // Trigger search only on button click

  const LIMIT = 5;

  // ------------------------
  // FETCH EMPLOYEES
  // ------------------------
  // const fetchEmployees = async (pageNumber: number) => {
  //   try {
  //     setLoading(true);

  //     const res = await axios.get<FetchEmployeesResponse>("/api/employee", {
  //       params: {
  //         page: pageNumber,
  //         limit: LIMIT,
  //         search,
  //         department,
  //       },
  //     });

  //     setEmployees(res.data.data.employees);
  //     setPage(res.data.data.page);
  //     setTotalPages(res.data.data.totalPages);
  //   } catch (error: any) {
  //     console.log(error)
  //     toast.error(error?.response?.data?.message || error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchEmployees = async (pageNumber: number) => {
    try {
      setLoading(true);
  
      const res = await axios.get<FetchEmployeesResponse>("/api/employee", {
        params: { page: pageNumber, limit: LIMIT, search, department },
      });
  
      setEmployees(res.data.data.employees);
      setPage(res.data.data.page);
      setTotalPages(res.data.data.totalPages);
    } catch (error: any) {
      // 👇 If no employees found, show empty list
      if (error?.response?.status === 404) {
        setEmployees([]); // Empty state
        setPage(1);
        setTotalPages(1);
      }
  
      // Show toast for other errors or optional
      toast.error(
        error?.response?.data?.message || error?.response?.data?.error || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchEmployees(1);
     
    }, 800);

    return () => clearTimeout(delay);
  }, [search,department]);
  // // 🔁 Reset page when search button is clicked
  // useEffect(() => {
  //   if (triggerSearch) {
  //     setPage(1);
  //     fetchEmployees(1);
      
  //   }
  // }, [triggerSearch]);

  // 🔄 Fetch on page change
  useEffect(() => {
    
      fetchEmployees(page);
  
  }, [page]);

  // ------------------------
  // UI
  // ------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 animate-pulse">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          All <span className="text-blue-600">Employees</span>
        </h1>
        <p className="text-gray-500">Search and manage employees</p>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/2"
        />

        {/* Department */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/3"
        >
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>

        {/* Search Button
        <button
          onClick={() => setTriggerSearch(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button> */}
      </div>

      {/* Employees List */}
      {employees.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No employees found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {employees.map((emp) => (
              <div
                key={emp._id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {emp.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <User size={16} />
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail size={16} />
                      {emp.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Briefcase size={16} />
                      {emp.department || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {emp.role || "Employee"}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-700">
              Page <b>{page}</b> of <b>{totalPages}</b>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Employee;
