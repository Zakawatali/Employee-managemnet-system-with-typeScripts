
// import React, { useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { User, Mail, Briefcase } from "lucide-react";

// // ------------------------
// // TYPES
// // ------------------------
// interface EmployeeType {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   position?: string;
//   department?: "HR" | "IT" | "Finance" | "Marketing" | "Sales" | string;
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

//   // 🔍 Filters
//   const [search, setSearch] = useState<string>("");
//   const [department, setDepartment] = useState<string>("");

//   const [triggerSearch, setTriggerSearch] = useState<boolean>(false); // Trigger search only on button click

//   const LIMIT = 5;

  
//   const fetchEmployees = async (pageNumber: number) => {
//     try {
//       setLoading(true);
  
//       const res = await axios.get<FetchEmployeesResponse>("/api/employee", {
//         params: { page: pageNumber, limit: LIMIT, search, department },
//       });
  
//       setEmployees(res.data.data.employees);
//       setPage(res.data.data.page);
//       setTotalPages(res.data.data.totalPages);
//     } catch (error: any) {
//       // 👇 If no employees found, show empty list
//       if (error?.response?.status === 404) {
//         setEmployees([]); // Empty state
//         setPage(1);
//         setTotalPages(1);
//       }
  
//       // Show toast for other errors or optional
//       toast.error(
//         error?.response?.data?.message || error?.response?.data?.error || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchEmployees(1);
     
//     }, 800);

//     return () => clearTimeout(delay);
//   }, [search,department]);
//   // // 🔁 Reset page when search button is clicked
//   // useEffect(() => {
//   //   if (triggerSearch) {
//   //     setPage(1);
//   //     fetchEmployees(1);
      
//   //   }
//   // }, [triggerSearch]);

//   // 🔄 Fetch on page change
//   useEffect(() => {
    
//       fetchEmployees(page);
  
//   }, [page]);

//   // ------------------------
//   // UI
//   // ------------------------
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-600 animate-pulse">Loading employees...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Heading */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           All <span className="text-blue-600">Employees</span>
//         </h1>
//         <p className="text-gray-500">Search and manage employees</p>
//       </div>

//       {/* 🔍 Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-4 py-2 border rounded-lg w-full md:w-1/2"
//         />

//         {/* Department */}
//         <select
//           value={department}
//           onChange={(e) => setDepartment(e.target.value)}
//           className="px-4 py-2 border rounded-lg w-full md:w-1/3"
//         >
//           <option value="">All Departments</option>
//           <option value="HR">HR</option>
//           <option value="IT">IT</option>
//           <option value="Finance">Finance</option>
//           <option value="Marketing">Marketing</option>
//           <option value="Sales">Sales</option>
//         </select>

//         {/* Search Button
//         <button
//           onClick={() => setTriggerSearch(true)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Search
//         </button> */}
//       </div>

//       {/* Employees List */}
//       {employees.length === 0 ? (
//         <p className="text-gray-500 text-center py-6">No employees found.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {employees.map((emp) => (
//               <div
//                 key={emp._id}
//                 className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
//               >
//                 {/* Left */}
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
//                     {emp.firstName.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-800 flex items-center gap-2">
//                       <User size={16} />
//                       {emp.firstName} {emp.lastName}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-2">
//                       <Mail size={16} />
//                       {emp.email}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-2">
//                       <Briefcase size={16} />
//                       {emp.department || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Role */}
//                 <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
//                   {emp.role || "Employee"}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-8">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
//             >
//               Prev
//             </button>

//             <span className="text-sm text-gray-700">
//               Page <b>{page}</b> of <b>{totalPages}</b>
//             </span>

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => p + 1)}
//               className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Employee;
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import {
  User, Mail, Briefcase, X, Phone, Building2, Shield, Eye,
  MapPin, GraduationCap, Calendar, Hash, Clock, CheckCircle, Code
} from "lucide-react";

// ------------------------
// TYPES (UNCHANGED)
// ------------------------
interface EmployeeType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: "HR" | "IT" | "Finance" | "Marketing" | "Sales" | string;
  role?: "ADMIN" | "HR" | "EMPLOYEE" | string;
  address?: string;
  dateOfBirth?: string;
  education?: string;
  employeeCode?: string;
  experience?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  createdAt?: string;
  updatedAt?: string;
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
// HELPERS (UNCHANGED)
// ------------------------
const formatDate = (iso?: string) => {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-50 text-red-700 border border-red-200",
  HR: "bg-violet-50 text-violet-700 border border-violet-200",
  EMPLOYEE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const deptColors: Record<string, string> = {
  HR: "bg-pink-50 text-pink-700 border border-pink-200",
  IT: "bg-sky-50 text-sky-700 border border-sky-200",
  Finance: "bg-amber-50 text-amber-700 border border-amber-200",
  Marketing: "bg-orange-50 text-orange-700 border border-orange-200",
  Sales: "bg-teal-50 text-teal-700 border border-teal-200",
};

const deptDot: Record<string, string> = {
  HR: "bg-pink-500", IT: "bg-sky-500", Finance: "bg-amber-500",
  Marketing: "bg-orange-500", Sales: "bg-teal-500",
};

// ------------------------
// INFO ROW (UNCHANGED logic, refined design)
// ------------------------
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  mono?: boolean;
}> = ({ icon, label, value, mono }) => (
  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
    <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm text-slate-800 font-medium break-words ${mono ? "font-mono text-xs text-slate-600" : ""}`}>
        {value || "N/A"}
      </p>
    </div>
  </div>
);

// ------------------------
// EMPLOYEE MODAL (UNCHANGED logic, refined design)
// ------------------------
const EmployeeModal: React.FC<{
  employee: EmployeeType | null;
  onClose: () => void;
}> = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
          style={{ animation: "scaleIn 0.2s ease-out" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Modal Header ── */}
          <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0 flex items-center justify-between bg-white">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-block w-1 h-4 rounded-full bg-blue-600" />
                <p className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase">Employee Profile</p>
              </div>
              <h2 className="text-base font-bold text-slate-900">Full Details</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* ── Profile Banner ── */}
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={employee.image || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=dbeafe&color=3b82f6&size=64`}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-14 h-14 rounded-xl border-2 border-white shadow-sm object-cover bg-blue-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=dbeafe&color=3b82f6&size=64`;
                  }}
                />
                {employee.status === "ACTIVE" && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-base leading-tight">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{employee.position || "Employee"}</p>
                {employee.employeeCode && (
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{employee.employeeCode}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColors[employee.role || ""] || "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                  {employee.role || "EMPLOYEE"}
                </span>
                {employee.department && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${deptColors[employee.department] || "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${deptDot[employee.department] || "bg-slate-400"}`} />
                    {employee.department}
                  </span>
                )}
                {employee.status && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    employee.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    <CheckCircle size={10} />
                    {employee.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <section>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Contact Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InfoRow icon={<Mail size={15} />} label="Email" value={employee.email} />
                <InfoRow icon={<Phone size={15} />} label="Phone" value={employee.phone} />
                <InfoRow icon={<MapPin size={15} />} label="Address" value={employee.address} />
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Personal Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InfoRow icon={<Calendar size={15} />} label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
                <InfoRow icon={<GraduationCap size={15} />} label="Education" value={employee.education} />
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Work Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InfoRow icon={<Briefcase size={15} />} label="Position" value={employee.position} />
                <InfoRow icon={<Building2 size={15} />} label="Department" value={employee.department} />
                <InfoRow icon={<Shield size={15} />} label="Role" value={employee.role} />
                <InfoRow icon={<Code size={15} />} label="Experience" value={employee.experience ? `${employee.experience} years` : undefined} />
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">System Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InfoRow icon={<Hash size={15} />} label="Employee Code" value={employee.employeeCode} mono />
                <InfoRow icon={<Clock size={15} />} label="Joined On" value={formatDate(employee.createdAt)} />
                <InfoRow icon={<Clock size={15} />} label="Last Updated" value={formatDate(employee.updatedAt)} />
              </div>
            </section>
          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

// ------------------------
// MAIN COMPONENT
// ------------------------
const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [department, setDepartment] = useState<string>("");

  const LIMIT = 5;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FETCH LOGIC UNCHANGED
  const fetchEmployees = useCallback(async (pageNumber: number, searchVal: string, deptVal: string) => {
    try {
      setLoading(true);
      const res = await axios.get<FetchEmployeesResponse>("/api/employee", {
        params: { page: pageNumber, limit: LIMIT, search: searchVal, department: deptVal },
      });
      setEmployees(res.data.data.employees);
      setPage(res.data.data.page);
      setTotalPages(res.data.data.totalPages);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setEmployees([]);
        setPage(1);
        setTotalPages(1);
      }
      toast.error(
        error?.response?.data?.message || error?.response?.data?.error || error.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchEmployees(page, search, department);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [page, search, department]);

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
  const handleDepartmentChange = (val: string) => { setDepartment(val); setPage(1); };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading employees…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-screen-lg mx-auto px-6 py-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1 h-5 rounded-full bg-blue-600" />
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
                Human Resources
              </p>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Employees</h1>
            <p className="text-sm text-slate-500 mt-0.5">Search and manage your workforce</p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Department filter */}
          <div className="relative md:w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </span>
            <select
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
            >
              <option value="">All Departments</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>

        {/* ── Employee Table Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Employee Directory</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {employees.length} {employees.length === 1 ? "record" : "records"}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Page <span className="font-medium text-slate-600">{page}</span> of{" "}
              <span className="font-medium text-slate-600">{totalPages}</span>
            </span>
          </div>

          {/* Empty state */}
          {employees.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="text-sm font-medium text-slate-500">No employees found</p>
              <p className="text-xs text-slate-400">Try adjusting your search or department filter</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {employees.map((emp) => (
                <li
                  key={emp._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors"
                >
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={emp.image || `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=dbeafe&color=3b82f6&size=48`}
                        alt={emp.firstName}
                        className="w-10 h-10 rounded-xl object-cover bg-blue-100 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=dbeafe&color=3b82f6&size=48`;
                        }}
                      />
                      {emp.status === "ACTIVE" && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm">
                          {emp.firstName} {emp.lastName}
                        </span>
                        {emp.department && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${deptColors[emp.department] || "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${deptDot[emp.department] || "bg-slate-400"}`} />
                            {emp.department}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Mail size={11} className="text-slate-400" />
                        {emp.email}
                      </p>
                      {emp.position && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Briefcase size={11} className="text-slate-300" />
                          {emp.position}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Role badge + View */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColors[emp.role || ""] || "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                      {emp.role || "EMPLOYEE"}
                    </span>
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md transition-all"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* ── Pagination footer ── */}
          {employees.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>

              {/* Page pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold transition ${
                      p === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};

export default Employee;