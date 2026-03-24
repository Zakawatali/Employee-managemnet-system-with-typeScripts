

// import React, { useContext, useEffect, useState, FormEvent } from "react";
// import { FileText, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import toast from "react-hot-toast";

// // ✅ Types
// interface User {
//   _id?: string;
//   name?: string;
// }

// interface LeaveRequest {
//   _id: string;
//   employee: string;
//   leaveType: "SICK" | "CASUAL" | "ANNUAL" | "UNPAID" | string;
//   startDate: string; // ISO date
//   endDate: string;   // ISO date
//   reason: string;
//   status: "APPROVED" | "PENDING" | "REJECTED" | string;
//   createdAt: string; // ISO date
// }

// const LeaveRequests: React.FC = () => {
//   const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);

//   // Form fields
//   const [leaveType, setLeaveType] = useState<LeaveRequest["leaveType"]>("SICK");
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [reason, setReason] = useState<string>("");

//   const { user } = useContext<{ user?: User }>(UserInfoContext);
//   const [errors, setErrors] = useState<{
//     leaveType?: string;
//     startDate?: string;
//     endDate?: string;
//     reason?: string;
//   }>({});
  

//   const today = new Date().toISOString().split("T")[0];

//   // ✅ Fetch all leave requests for this employee
//   const fetchLeaves = async () => {
//     try {
//       if (!user?._id) return;
//       const res = await axios.get<{ data: LeaveRequest[] }>(`/api/leaves/${user._id}`);
//       setLeaveRequests(res.data.data || []);
//     } catch (error: any) {
//       console.error("Error fetching leaves:", error);
//       toast.error("Error fetching leave");
//     }
//   };

//   useEffect(() => {
//     if (user?._id) fetchLeaves();
//   }, [user?._id]);

//   const stats = {
//     total: leaveRequests.length,
//     approved: leaveRequests.filter((req) => req.status === "APPROVED").length,
//     pending: leaveRequests.filter((req) => req.status === "PENDING").length,
//     rejected: leaveRequests.filter((req) => req.status === "REJECTED").length,
//   };

//   // ✅ Submit leave request
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

   
//     setErrors({});
   

//     const newRequest = {
//       employee: user?._id,
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//     };

//     try {
//       await axios.post("/api/leaves/applyLeave", newRequest);

//       // Reset form
//       setLeaveType("SICK");
//       setStartDate("");
//       setEndDate("");
//       setReason("");
//       setShowForm(false);

//       fetchLeaves();
//       toast.success("Leave applied successfully");
//     } catch (error: any) {
//       const data = error?.response?.data.message;

//       // ✅ Joi validation errors
//       if (data?.errors?.length) {
//         const fieldErrors: any = {};
    
//         data.errors.forEach((err: any) => {
//           if (err.field) {
//             fieldErrors[err.field] = err.message;
//           }
//         });
    
//         setErrors(fieldErrors);
//         return;
//       }
//       else{
//         toast.error(error?.response?.data?.message || error.message);
        
//       }
      
//     }
//   };

//   return (
//     <div className="p-6 space-y-8 text-gray-800">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-700">Leave Requests</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
//         >
//           <Plus size={18} /> Request Leave
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
//           <FileText className="text-indigo-600" size={30} />
//           <div>
//             <p className="text-sm text-gray-500">Total</p>
//             <p className="text-xl font-bold">{stats.total}</p>
//           </div>
//         </div>
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
//           <CheckCircle className="text-green-600" size={30} />
//           <div>
//             <p className="text-sm text-gray-500">Approved</p>
//             <p className="text-xl font-bold">{stats.approved}</p>
//           </div>
//         </div>
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
//           <Clock className="text-yellow-500" size={30} />
//           <div>
//             <p className="text-sm text-gray-500">Pending</p>
//             <p className="text-xl font-bold">{stats.pending}</p>
//           </div>
//         </div>
//         <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
//           <XCircle className="text-red-600" size={30} />
//           <div>
//             <p className="text-sm text-gray-500">Rejected</p>
//             <p className="text-xl font-bold">{stats.rejected}</p>
//           </div>
//         </div>
//       </div>

//       {/* Popup Form */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-700">
//               Submit Leave Request
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Leave Type */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Leave Type
//                 </label>
//                 <select
//                   value={leaveType}
//                   onChange={(e) =>
//                     setLeaveType(e.target.value as LeaveRequest["leaveType"])
//                   }
//                   className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
//                 > 
                
//                   <option value="SICK">SICK</option>
//                   <option value="CASUAL">CASUAL</option>
//                   <option value="ANNUAL">ANNUAL</option>
//                   <option value="UNPAID">UNPAID</option>
//                 </select>
//               </div>
//               {errors.leaveType && (
//               <p className="text-red-500 text-xs mt-1">{errors.leaveType}</p>
//                )}

//               {/* Dates */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     min={today}
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
//                   />
//                    {errors.startDate && (
//                      <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
//                        )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     min={today}
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
//                   />
//                             {errors.endDate && (
//                       <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
//                        )}
//                 </div>
//               </div>

//               {/* Reason */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Reason
//                 </label>
//                 <textarea
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   rows={3}
//                   className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Enter reason for leave..."
//                 />
//                 {errors.reason && (
//                   <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
//                    )}
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="px-4 py-2 rounded-lg border hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Leave History */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-lg font-bold mb-4 text-gray-700">Leave History</h2>

//         {leaveRequests.length === 0 ? (
//           <div className="flex flex-col items-center justify-center text-gray-500 py-8">
//             <FileText size={42} className="mb-3 text-indigo-500" />
//             <p>No leave requests found</p>
//             <p className="text-sm">
//               Click <span className="font-medium">"Request Leave"</span> to
//               submit your first request
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse text-sm sm:text-base">
//               <thead>
//                 <tr className="bg-gray-100 text-left text-gray-600">
//                   <th className="p-3">Applied On</th>
//                   <th className="p-3">Type</th>
//                   <th className="p-3">Period</th>
//                   <th className="p-3">Reason</th>
//                   <th className="p-3">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaveRequests.map((req) => (
//                   <tr key={req._id} className="border-b hover:bg-gray-50">
//                     <td className="p-3">
//                       {new Date(req.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-3">{req.leaveType}</td>
//                     <td className="p-3">
//                       {new Date(req.startDate).toLocaleDateString()} →{" "}
//                       {new Date(req.endDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-3">{req.reason}</td>
//                     <td
//                       className={`p-3 font-medium ${
//                         req.status === "APPROVED"
//                           ? "text-green-600"
//                           : req.status === "PENDING"
//                           ? "text-yellow-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {req.status}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeaveRequests;
import React, { useContext, useEffect, useState, FormEvent } from "react";
import { FileText, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import toast from "react-hot-toast";

// ✅ Types (UNCHANGED)
interface User {
  _id?: string;
  name?: string;
}

interface LeaveRequest {
  _id: string;
  employee: string;
  leaveType: "SICK" | "CASUAL" | "ANNUAL" | "UNPAID" | string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | string;
  createdAt: string;
}

// ------------------------
// HELPERS
// ------------------------
const leaveTypeMeta: Record<string, { cls: string; dot: string }> = {
  SICK:    { cls: "bg-rose-50 text-rose-700 border border-rose-200",       dot: "bg-rose-500"    },
  CASUAL:  { cls: "bg-sky-50 text-sky-700 border border-sky-200",          dot: "bg-sky-500"     },
  ANNUAL:  { cls: "bg-violet-50 text-violet-700 border border-violet-200", dot: "bg-violet-500"  },
  UNPAID:  { cls: "bg-amber-50 text-amber-700 border border-amber-200",    dot: "bg-amber-500"   },
};

const statusMeta: Record<string, { cls: string; dot: string }> = {
  APPROVED: { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  PENDING:  { cls: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-500"   },
  REJECTED: { cls: "bg-rose-50 text-rose-700 border border-rose-200",          dot: "bg-rose-500"    },
};

const Badge: React.FC<{ label: string; meta: Record<string, { cls: string; dot: string }> }> = ({ label, meta }) => {
  const m = meta[label?.toUpperCase()] || { cls: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {label}
    </span>
  );
};

const FieldWrap: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    {children}
    {error && <p className="text-rose-500 text-xs mt-0.5">{error}</p>}
  </div>
);

// ------------------------
// MAIN COMPONENT
// ------------------------
const LeaveRequests: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [leaveType, setLeaveType] = useState<LeaveRequest["leaveType"]>("SICK");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const { user } = useContext<{ user?: User }>(UserInfoContext);
  const [errors, setErrors] = useState<{
    leaveType?: string; startDate?: string; endDate?: string; reason?: string;
  }>({});

  const today = new Date().toISOString().split("T")[0];

  // ✅ FETCH (UNCHANGED)
  const fetchLeaves = async () => {
    try {
      if (!user?._id) return;
      const res = await axios.get<{ data: LeaveRequest[] }>(`/api/leaves/${user._id}`);
      setLeaveRequests(res.data.data || []);
    } catch (error: any) {
      console.error("Error fetching leaves:", error);
      toast.error("Error fetching leave");
    }
  };

  useEffect(() => {
    if (user?._id) fetchLeaves();
  }, [user?._id]);

  const stats = {
    total:    leaveRequests.length,
    approved: leaveRequests.filter((r) => r.status === "APPROVED").length,
    pending:  leaveRequests.filter((r) => r.status === "PENDING").length,
    rejected: leaveRequests.filter((r) => r.status === "REJECTED").length,
  };

  // ✅ SUBMIT (UNCHANGED)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newRequest = { employee: user?._id, leaveType, startDate, endDate, reason };
    try {
      await axios.post("/api/leaves/applyLeave", newRequest);
      setLeaveType("SICK");
      setStartDate("");
      setEndDate("");
      setReason("");
      setShowForm(false);
      fetchLeaves();
      toast.success("Leave applied successfully");
    } catch (error: any) {
      const data = error?.response?.data.message;
      if (data?.errors?.length) {
        const fieldErrors: any = {};
        data.errors.forEach((err: any) => { if (err.field) fieldErrors[err.field] = err.message; });
        setErrors(fieldErrors);
        return;
      } else {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  // ── Duration helper
  const calcDays = (start: string, end: string) => {
    if (!start || !end) return null;
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-screen-lg mx-auto px-6 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1 h-5 rounded-full bg-blue-600" />
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">My Workspace</p>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
            <p className="text-sm text-slate-500 mt-0.5">Apply for leave and track your request history</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={15} />
            Request Leave
          </button>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",    value: stats.total,    icon: <FileText size={18} />,   iconBg: "bg-blue-50",    accent: "text-blue-600",    dot: "bg-blue-500"    },
            { label: "Approved", value: stats.approved, icon: <CheckCircle size={18} />,iconBg: "bg-emerald-50", accent: "text-emerald-600", dot: "bg-emerald-500" },
            { label: "Pending",  value: stats.pending,  icon: <Clock size={18} />,      iconBg: "bg-amber-50",   accent: "text-amber-600",   dot: "bg-amber-500"   },
            { label: "Rejected", value: stats.rejected, icon: <XCircle size={18} />,    iconBg: "bg-rose-50",    accent: "text-rose-600",    dot: "bg-rose-500"    },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</span>
                <span className={`p-2 rounded-lg ${c.iconBg} ${c.accent}`}>{c.icon}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-extrabold tabular-nums ${c.accent}`}>{c.value}</span>
                {stats.total > 0 && (
                  <span className="text-xs text-slate-400 mb-1">
                    {Math.round((c.value / stats.total) * 100)}%
                  </span>
                )}
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.dot} transition-all duration-500`}
                  style={{ width: stats.total > 0 ? `${(c.value / stats.total) * 100}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Leave History Table Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Leave History</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {leaveRequests.length} {leaveRequests.length === 1 ? "request" : "requests"}
              </span>
            </div>
          </div>

          {leaveRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText size={22} className="text-blue-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No leave requests found</p>
              <p className="text-xs text-slate-400">
                Click <span className="font-semibold text-blue-600">"Request Leave"</span> to submit your first request
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Applied On", "Type", "Period", "Duration", "Reason", "Status"].map((h, i) => (
                      <th key={h} className={`px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${i === 5 ? "text-center" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leaveRequests.map((req) => {
                    const days = calcDays(req.startDate, req.endDate);
                    return (
                      <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">

                        {/* Applied On */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-slate-600">
                                {new Date(req.createdAt).getDate()}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-700">
                                {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-3.5">
                          <Badge label={req.leaveType} meta={leaveTypeMeta} />
                        </td>

                        {/* Period */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <p className="text-xs font-medium text-slate-700">
                            {new Date(req.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            <span className="mx-1.5 text-slate-300">→</span>
                            {new Date(req.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </td>

                        {/* Duration */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {days ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                              {days} {days === 1 ? "day" : "days"}
                            </span>
                          ) : <span className="text-slate-400 text-xs">—</span>}
                        </td>

                        {/* Reason */}
                        <td className="px-5 py-3.5 max-w-[200px]">
                          <p className="text-xs text-slate-600 truncate" title={req.reason}>
                            {req.reason}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 text-center">
                          <Badge label={req.status} meta={statusMeta} />
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Apply Leave Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
            style={{ animation: "scaleIn 0.2s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-block w-1 h-4 rounded-full bg-blue-600" />
                  <p className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase">Leave</p>
                </div>
                <h3 className="text-base font-bold text-slate-900">Submit Leave Request</h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

              <FieldWrap label="Leave Type" error={errors.leaveType}>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveRequest["leaveType"])}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="SICK">SICK</option>
                  <option value="CASUAL">CASUAL</option>
                  <option value="ANNUAL">ANNUAL</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </FieldWrap>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldWrap label="Start Date" error={errors.startDate}>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </FieldWrap>
                <FieldWrap label="End Date" error={errors.endDate}>
                  <input
                    type="date"
                    min={today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </FieldWrap>
              </div>

              {/* Duration preview */}
              {startDate && endDate && calcDays(startDate, endDate) && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="text-xs font-semibold text-blue-700">
                    Duration: {calcDays(startDate, endDate)} {calcDays(startDate, endDate) === 1 ? "day" : "days"}
                  </p>
                </div>
              )}

              <FieldWrap label="Reason" error={errors.reason}>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Enter reason for leave…"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
                />
              </FieldWrap>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LeaveRequests;