


// import React, { useEffect, useState, useMemo } from "react";
// import { Loader2 } from "lucide-react";

// import {
//   FileText,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Eye,
//   X,
// } from "lucide-react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { debounce } from "../../util/debounce";

// type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
// type LeaveAction = "Approved" | "Rejected";
// type LoadingAction = {
//   id: string;
//   action: "Approved" | "Rejected"|"Deleted";
// } | null;








// interface EmployeeInfo {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
// }

// interface Leave {
//   _id: string;
//   employee?: EmployeeInfo;
//   leaveType: string;
//   startDate: string;
//   endDate: string;
//   reason?: string;
//   days?: number;
//   status: LeaveStatus;
//   createdAt: string;
// }

// const LeaveManagement: React.FC = () => {
//   const [leaves, setLeaves] = useState<Leave[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
//   const [page, setPage] = useState<number>(1);         // current page
// const [totalPages, setTotalPages] = useState<number>(1); // total pages from backend
// const LIMIT = 5; // ya jitni items per page chahiye


// const [searchInput, setSearchInput] = useState("");

// const [leaveTypeInput, setLeaveTypeInput] = useState("");

//  const [search, setSearch] = useState("");
//  const [leaveType, setLeaveType] = useState("");
 
//  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
 





//   // ✅ Fetch all leave requests
//   const fetchLeaves = async (page:number=1) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/leaves`,{
//         params: {
//           page,
//           limit: LIMIT,
//           search,       // 👈 name search
//           leaveType,    // 👈 dropdown filter
//         },
//       });
// const data = res.data.data;
// console.log("the data is",data) // backend se jo structure return ho raha hai
// setLeaves(data.leaves);
// setTotalPages(data.totalPages);

//       const payload = res.data?.data;
//       const list: Leave[] = Array.isArray(payload)
//         ? payload
//         : Array.isArray(payload?.leaves)
//         ? payload.leaves
//         : [];
//       setLeaves(list);
//     } catch (error:any) {
//       if (error?.response?.status === 404) {
//         setLeaves([]); // Empty state
//         setPage(1);
//         setTotalPages(1);
//       }
//       console.error("Error fetching leaves:", error);
//       toast.error(
//         error?.response?.data?.message || error?.response?.data?.error || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteLeave = async (id: string) => {
//     try {
//       setLoadingAction({ id, action: "Deleted" });
//       const res = await axios.delete(`/api/leaves/${id}`);
      
//       if (res.data.success) {
//         toast.success(res.data.message || "Leave deleted successfully");
//         setLeaves((prev) => prev.filter((leave) => leave._id !== id));
//       } else {
//         toast.error(res.data.message || "Failed to delete leave");
//       }
//     } catch (error: unknown) {
//       const err = error as { response?: { data?: { message?: string } } };
//       toast.error(err?.response?.data?.message || "Error deleting leave");
//       console.error("Error deleting leave:", error);
//     }
//     finally{
//       setLoadingAction(null)
//     }
//   };
  

// const debouncedSetFilters = useMemo(
//   () =>
//     debounce((searchValue: string, leaveTypeValue: string) => {
//       setSearch(searchValue);
//       setLeaveType(leaveTypeValue);
//       setPage(1); // reset page when filters change
//     }, 800),
//   []
// );

// // Trigger debounced API call whenever inputs change
// useEffect(() => {
//   debouncedSetFilters(searchInput, leaveTypeInput);
// }, [searchInput, leaveTypeInput]);
//   useEffect(() => {
//     fetchLeaves(page);
//   }, [page, search, leaveType]);

 

//   // ✅ Update leave status
//   const updateStatus = async (id: string, status: "Approved" | "Rejected") => {
//     try {
//       setLoadingAction({id, action: status})
//       if (status === "Approved") {
//         await axios.put(`/api/leaves/approve/${id}`);
        
//       } else if (status === "Rejected") {
//         await axios.put(`/api/leaves/reject/${id}`);
//       }

//       setLeaves((prev) =>
//         prev.map((leave) =>
//           leave._id === id ? { ...leave, status: status.toUpperCase() as Leave["status"] } : leave
//         )
//       );
//     } catch (error: any) {
//       console.error("Error updating status:", error);
//       toast.error(error.response?.data?.message || "Error updating status");
//     }
//     finally{
//       setLoadingAction(null );
//     }
//   };

//   // ✅ Stats
//   const stats = {
//     total: leaves.length,
//     approved: leaves.filter((l) => l.status === "APPROVED").length,
//     pending: leaves.filter((l) => l.status === "PENDING").length,
//     rejected: leaves.filter((l) => l.status === "REJECTED").length,
//   };

//   // ✅ Sort leaves
//   const sortedLeaves = [...leaves].sort((a, b) => {
//     const order: Record<LeaveStatus, number> = {
//       PENDING: 1,
//       APPROVED: 2,
//       REJECTED: 3,
//       CANCELLED: 4,
//     };
//     return order[a.status] - order[b.status];
//   });

//   return (
//     <div className="p-6 font-sans bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Leave <span className="text-blue-600">Management</span>
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Monitor and take actions on employee leave requests
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
//         <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
//           <FileText className="text-blue-600" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">Total Requests</p>
//             <p className="text-xl font-bold">{stats.total}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
//           <CheckCircle className="text-green-600" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">Approved</p>
//             <p className="text-xl font-bold">{stats.approved}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
//           <Clock className="text-yellow-500" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">Pending</p>
//             <p className="text-xl font-bold">{stats.pending}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
//           <XCircle className="text-red-600" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">Rejected</p>
//             <p className="text-xl font-bold">{stats.rejected}</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col sm:flex-row gap-3 mb-4">
//   {/* Search by name */}
//   <input
//     type="text"
//     placeholder="Search by employee name"
//     value={searchInput}
//     onChange={(e) => setSearchInput(e.target.value)}
//     className="border rounded-lg px-4 py-2 w-full sm:w-1/3"
//   />

//   {/* Filter by leave type */}
//   <select
//     value={leaveTypeInput}
//     onChange={(e) => setLeaveTypeInput(e.target.value)}
//     className="border rounded-lg px-4 py-2 w-full sm:w-1/4"
//   >
//     <option value="">All Leave Types</option>
//     <option value="SICK">Sick</option>
//     <option value="CASUAL">Casual</option>
//     <option value="ANNUAL">Annual</option>
//   </select>


// </div>

//       {/* Leave Table */}
//       <div className="p-6 rounded-xl shadow-sm bg-white border border-gray-100">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">
//           All Leave Requests
//         </h2>

//         {loading ? (
//           <p className="text-gray-500">Loading...</p>
//         ) : sortedLeaves.length === 0 ? (
//           <div className="flex flex-col items-center justify-center text-gray-500 py-12">
//             <FileText size={50} className="mb-3 text-gray-400" />
//             <p className="text-lg">No leave requests available</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse text-sm sm:text-base">
//               <thead>
//                 <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
//                   <th className="p-3">Employee</th>
//                   <th className="p-3">Leave Type</th>
//                   <th className="p-3">Period</th>
//                   <th className="p-3">Reason</th>
//                   <th className="p-3">Days</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sortedLeaves.map((leave) => (
//                   <tr
//                     key={leave._id}
//                     className={`border-b hover:bg-gray-50 transition ${
//                       leave.status === "PENDING" ? "bg-yellow-50/40" : ""
//                     }`}
//                   >
//                     <td className="p-3 font-medium text-gray-800">
//                       {leave.employee?.firstName} {leave.employee?.lastName}
//                     </td>
//                     <td className="p-3">{leave.leaveType}</td>
//                     <td className="p-3 text-gray-600">
//                       {new Date(leave.startDate).toLocaleDateString()} →{" "}
//                       {new Date(leave.endDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-3 text-gray-600">{leave.reason}</td>
//                     <td className="p-3 text-gray-600">{leave.days}</td>
//                     <td
//                       className={`p-3 font-semibold ${
//                         leave.status === "APPROVED"
//                           ? "text-green-600"
//                           : leave.status === "PENDING"
//                           ? "text-yellow-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {leave.status}
//                     </td>
//                     <td className="p-3 flex gap-2 flex-wrap">
//                       <button
//                         onClick={() => setSelectedLeave(leave)}
//                         className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
//                       >
//                         <Eye size={14} /> View
//                       </button>
//                       <button
//                           onClick={() => updateStatus(leave._id, "Approved")}
//                            disabled={
//                             leave.status === "APPROVED" ||
//                             (loadingAction?.id === leave._id &&
//                               loadingAction?.action === "Approved")
//                               }
//                                 className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//                              >
//                             {loadingAction?.id === leave._id &&
//                              loadingAction?.action === "Approved" ? (
//                             <>
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                              Approving...
//                               </>) : ( "Approve")}

//                                </button>

//                            <button
//                              onClick={() => updateStatus(leave._id, "Rejected")}
//                               disabled={
//                                 leave.status === "REJECTED" ||
//                                 (loadingAction?.id === leave._id &&
//                                   loadingAction?.action === "Rejected")
//                                        }
//                                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
//                                 >
//                           {loadingAction?.id === leave._id &&
//                            loadingAction?.action === "Rejected"? (
//                             <>
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                              Rejecting...
//                               </>) : ( "Reject")}
//                            </button>

//                            <button
//                                onClick={() => deleteLeave(leave._id)}
//                                disabled={loadingAction?.id === leave._id}
//                                 className="px-3 py-1 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
//                                >
//                                 {loadingAction?.id === leave._id &&
//                                  loadingAction?.action === "Deleted" ? ("Deleting...") : ("Delete")}</button>

//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {/* Pagination */}
// {totalPages > 1 && (
//   <div className="flex justify-center items-center gap-2 mt-6">
//     {/* Previous */}
//     <button
//       onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//       disabled={page === 1}
//       className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100"
//     >
//       Prev
//     </button>

//     {/* Page Numbers */}
//     {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//       <button
//         key={p}
//         onClick={() => setPage(p)}
//         className={`px-3 py-1 rounded-lg border text-sm ${
//           page === p
//             ? "bg-blue-600 text-white border-blue-600"
//             : "hover:bg-gray-100"
//         }`}
//       >
//         {p}
//       </button>
//     ))}

//     {/* Next */}
//     <button
//       onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//       disabled={page === totalPages}
//       className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100"
//     >
//       Next
//     </button>
//   </div>
// )}


//       {/* Modal */}
//       {selectedLeave && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
//             {/* Close Button */}
//             <button
//               onClick={() => setSelectedLeave(null)}
//               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
//             >
//               <X size={20} />
//             </button>

//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Leave Details
//             </h3>

//             <div className="space-y-3 text-gray-700 text-sm">
//               <p>
//                 <strong>Employee:</strong>{" "}
//                 {selectedLeave.employee?.firstName}{" "}
//                 {selectedLeave.employee?.lastName}
//               </p>
//               <p>
//                 <strong>Email:</strong> {selectedLeave.employee?.email}
//               </p>
//               <p>
//                 <strong>Leave Type:</strong> {selectedLeave.leaveType}
//               </p>
//               <p>
//                 <strong>Period:</strong>{" "}
//                 {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
//                 {new Date(selectedLeave.endDate).toLocaleDateString()}
//               </p>
//               <p>
//                 <strong>Days:</strong> {selectedLeave.days}
//               </p>
//               <p>
//                 <strong>Reason:</strong> {selectedLeave.reason}
//               </p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 <span
//                   className={`font-semibold ${
//                     selectedLeave.status === "APPROVED"
//                       ? "text-green-600"
//                       : selectedLeave.status === "PENDING"
//                       ? "text-yellow-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {selectedLeave.status}
//                 </span>
//               </p>
//               <p>
//                 <strong>Created At:</strong>{" "}
//                 {new Date(selectedLeave.createdAt).toLocaleString()}
//               </p>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setSelectedLeave(null)}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//               >
//                 Close
//               </button>
//               {selectedLeave.status !== "APPROVED" && (
//                 <button
//                   onClick={() => {
//                     updateStatus(selectedLeave._id, "Approved");
//                     setSelectedLeave(null);
//                   }}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                 >
//                   Approve
//                 </button>
//               )}
//               {selectedLeave.status !== "REJECTED" && (
//                 <button
//                   onClick={() => {
//                     updateStatus(selectedLeave._id, "Rejected");
//                     setSelectedLeave(null);
//                   }}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Reject
//                 </button>
//               )}
//               <button
//                 onClick={() => {
//                   deleteLeave(selectedLeave._id);
//                   setSelectedLeave(null);
//                 }}
//                 className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
     

//     </div>
    
//   );
// };

// export default LeaveManagement;
import React, { useEffect, useState, useMemo } from "react";
import {
  Loader2, FileText, CheckCircle, Clock, XCircle,
  Eye, X, Search, ChevronLeft, ChevronRight, Calendar, User, Trash2
} from "lucide-react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import { debounce } from "../../util/debounce";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
type LoadingAction = { id: string; action: "Approved" | "Rejected" | "Deleted" } | null;

interface EmployeeInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Leave {
  _id: string;
  employee?: EmployeeInfo;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  days?: number;
  status: LeaveStatus;
  createdAt: string;
}

// ─────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────
const statusConfig: Record<LeaveStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  APPROVED:  { label: "Approved",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  PENDING:   { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   },
  REJECTED:  { label: "Rejected",  bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500"     },
  CANCELLED: { label: "Cancelled", bg: "bg-slate-50",   text: "text-slate-500",   border: "border-slate-200",   dot: "bg-slate-400"   },
};

const leaveTypeColors: Record<string, string> = {
  SICK:   "bg-rose-50 text-rose-700 border-rose-200",
  CASUAL: "bg-sky-50 text-sky-700 border-sky-200",
  ANNUAL: "bg-violet-50 text-violet-700 border-violet-200",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves]               = useState<Leave[]>([]);
  const [loading, setLoading]             = useState<boolean>(true);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [page, setPage]                   = useState<number>(1);
  const [totalPages, setTotalPages]       = useState<number>(1);
  const LIMIT = 5;

  const [searchInput, setSearchInput]       = useState("");
  const [leaveTypeInput, setLeaveTypeInput] = useState("");
  const [search, setSearch]                 = useState("");
  const [leaveType, setLeaveType]           = useState("");
  const [loadingAction, setLoadingAction]   = useState<LoadingAction>(null);

  // ── ALL ORIGINAL LOGIC UNTOUCHED ────────────────────────────────────────
  const fetchLeaves = async (p: number = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/leaves`, {
        params: { page: p, limit: LIMIT, search, leaveType },
      });
      const data = res.data.data;
      setLeaves(data.leaves);
      setTotalPages(data.totalPages);
      const payload = res.data?.data;
      const list: Leave[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.leaves)
        ? payload.leaves
        : [];
      setLeaves(list);
    } catch (error: any) {
      if (error?.response?.status === 404) { setLeaves([]); setPage(1); setTotalPages(1); }
      toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLeave = async (id: string) => {
    try {
      setLoadingAction({ id, action: "Deleted" });
      const res = await axios.delete(`/api/leaves/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Leave deleted successfully");
        setLeaves((prev) => prev.filter((l) => l._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete leave");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Error deleting leave");
    } finally {
      setLoadingAction(null);
    }
  };

  const debouncedSetFilters = useMemo(
    () => debounce((s: string, lt: string) => { setSearch(s); setLeaveType(lt); setPage(1); }, 800),
    []
  );

  useEffect(() => { debouncedSetFilters(searchInput, leaveTypeInput); }, [searchInput, leaveTypeInput]);
  useEffect(() => { fetchLeaves(page); }, [page, search, leaveType]);

  const updateStatus = async (id: string, status: "Approved" | "Rejected") => {
    try {
      setLoadingAction({ id, action: status });
      if (status === "Approved") await axios.put(`/api/leaves/approve/${id}`);
      else await axios.put(`/api/leaves/reject/${id}`);
      setLeaves((prev) =>
        prev.map((l) => l._id === id ? { ...l, status: status.toUpperCase() as Leave["status"] } : l)
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating status");
    } finally {
      setLoadingAction(null);
    }
  };

  const stats = {
    total:    leaves.length,
    approved: leaves.filter((l) => l.status === "APPROVED").length,
    pending:  leaves.filter((l) => l.status === "PENDING").length,
    rejected: leaves.filter((l) => l.status === "REJECTED").length,
  };

  const sortedLeaves = [...leaves].sort((a, b) => {
    const order: Record<LeaveStatus, number> = { PENDING: 1, APPROVED: 2, REJECTED: 3, CANCELLED: 4 };
    return order[a.status] - order[b.status];
  });
  // ────────────────────────────────────────────────────────────────────────

  const isActing = (id: string, action: string) =>
    loadingAction?.id === id && loadingAction?.action === action;

  return (
    <div className="min-h-screen bg-[#f4f6f9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.97);       } to { opacity:1; transform:scale(1);       } }
        .fade-up  { animation: fadeUp  0.35s ease both; }
        .scale-in { animation: scaleIn 0.2s  ease-out both; }
        .row-hover:hover { background: #f8faff; }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="mb-10 fade-up">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">HR Operations</p>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Leave Management
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">Monitor and action employee leave requests</p>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Requests", value: stats.total,    icon: <FileText    size={20} />, accent: "text-blue-600",    bg: "bg-blue-50"    },
            { label: "Approved",       value: stats.approved, icon: <CheckCircle size={20} />, accent: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending",        value: stats.pending,  icon: <Clock       size={20} />, accent: "text-amber-600",   bg: "bg-amber-50"   },
            { label: "Rejected",       value: stats.rejected, icon: <XCircle     size={20} />, accent: "text-red-600",     bg: "bg-red-50"     },
          ].map((s, i) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.accent} flex items-center justify-center flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-slate-800 leading-tight">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5 fade-up" style={{ animationDelay: "240ms" }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by employee name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
              />
            </div>
            <select
              value={leaveTypeInput}
              onChange={(e) => setLeaveTypeInput(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
            >
              <option value="">All Leave Types</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="ANNUAL">Annual Leave</option>
            </select>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden fade-up" style={{ animationDelay: "300ms" }}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <FileText size={15} className="text-white" />
            </div>
            <h2 className="font-semibold text-slate-800">All Leave Requests</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Loader2 size={18} className="text-white animate-spin" />
              </div>
              <p className="text-slate-400 text-sm">Loading leave requests...</p>
            </div>
          ) : sortedLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <FileText size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-600 font-medium">No leave requests found</p>
              <p className="text-slate-400 text-sm">Adjust your filters to see results</p>
            </div>
          ) : (
            // ✅ table-fixed + percentage widths = no horizontal overflow ever
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-[24%] px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="w-[12%] px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="w-[20%] px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="w-[8%]  px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Days</th>
                  <th className="w-[14%] px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="w-[22%] px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedLeaves.map((leave, i) => {
                  const sc       = statusConfig[leave.status] || statusConfig.CANCELLED;
                  const ltColor  = leaveTypeColors[leave.leaveType] || "bg-slate-50 text-slate-600 border-slate-200";
                  const initials = `${leave.employee?.firstName?.charAt(0) ?? ""}${leave.employee?.lastName?.charAt(0) ?? ""}`.toUpperCase();

                  return (
                    <tr
                      key={leave._id}
                      className="row-hover transition-colors"
                      style={{ animation: "fadeUp 0.3s ease both", animationDelay: `${i * 40}ms` }}
                    >
                      {/* Employee */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                            {initials || <User size={12} />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-xs leading-snug truncate">
                              {leave.employee?.firstName} {leave.employee?.lastName}
                            </p>
                            {leave.employee?.email && (
                              <p className="text-xs text-slate-400 truncate">{leave.employee.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-xs font-semibold ${ltColor}`}>
                          {leave.leaveType}
                        </span>
                      </td>

                      {/* Period — stacked to avoid width pressure */}
                      <td className="px-4 py-3.5">
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Calendar size={10} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">{fmt(leave.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <span className="w-[10px] flex-shrink-0">→</span>
                            <span className="truncate">{fmt(leave.endDate)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Days */}
                      <td className="px-4 py-3.5">
                        <span className="text-slate-700 font-semibold text-sm">{leave.days ?? "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>

                      {/* Actions — 2×2 grid, fully contained */}
                      <td className="px-4 py-3.5">
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            onClick={() => setSelectedLeave(leave)}
                            className="inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                          >
                            <Eye size={10} /> View
                          </button>
                          <button
                            onClick={() => updateStatus(leave._id, "Approved")}
                            disabled={leave.status === "APPROVED" || !!loadingAction}
                            className="inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isActing(leave._id, "Approved")
                              ? <Loader2 size={10} className="animate-spin" />
                              : <><CheckCircle size={10} /> OK</>
                            }
                          </button>
                          <button
                            onClick={() => updateStatus(leave._id, "Rejected")}
                            disabled={leave.status === "REJECTED" || !!loadingAction}
                            className="inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isActing(leave._id, "Rejected")
                              ? <Loader2 size={10} className="animate-spin" />
                              : <><XCircle size={10} /> Reject</>
                            }
                          </button>
                          <button
                            onClick={() => deleteLeave(leave._id)}
                            disabled={!!loadingAction}
                            className="inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isActing(leave._id, "Deleted")
                              ? <Loader2 size={10} className="animate-spin" />
                              : <><Trash2 size={10} /> Del</>
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 fade-up">
            <p className="text-sm text-slate-400">
              Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                    page === p
                      ? "bg-slate-900 text-white shadow-md"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedLeave(null)} />
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                  <FileText size={17} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Leave Details</h3>
                  <p className="text-slate-400 text-xs">Full request information</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeave(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {`${selectedLeave.employee?.firstName?.charAt(0) ?? ""}${selectedLeave.employee?.lastName?.charAt(0) ?? ""}`.toUpperCase() || <User size={16} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {selectedLeave.employee?.firstName} {selectedLeave.employee?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{selectedLeave.employee?.email}</p>
                </div>
                <div className="ml-auto">
                  {(() => {
                    const sc = statusConfig[selectedLeave.status] || statusConfig.CANCELLED;
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Leave Type", value: selectedLeave.leaveType },
                  { label: "Days",       value: selectedLeave.days ?? "—" },
                  { label: "Start Date", value: fmt(selectedLeave.startDate) },
                  { label: "End Date",   value: fmt(selectedLeave.endDate) },
                  { label: "Applied On", value: fmt(selectedLeave.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-slate-700">{String(value)}</p>
                  </div>
                ))}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                  <p className="text-xs text-slate-400 mb-0.5">Reason</p>
                  <p className="text-sm text-slate-700">{selectedLeave.reason || "No reason provided"}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedLeave(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              {selectedLeave.status !== "APPROVED" && (
                <button
                  onClick={() => { updateStatus(selectedLeave._id, "Approved"); setSelectedLeave(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={14} /> Approve
                </button>
              )}
              {selectedLeave.status !== "REJECTED" && (
                <button
                  onClick={() => { updateStatus(selectedLeave._id, "Rejected"); setSelectedLeave(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <XCircle size={14} /> Reject
                </button>
              )}
              <button
                onClick={() => { deleteLeave(selectedLeave._id); setSelectedLeave(null); }}
                className="px-4 py-2.5 rounded-xl bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;