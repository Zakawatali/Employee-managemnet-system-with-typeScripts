
// import React, { useContext, useEffect, useState } from "react";
// import { FileText, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import toast from "react-hot-toast";

// const LeaveRequests = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   // form fields
//   const [leaveType, setLeaveType] = useState("SICK");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");
//   const { user } = useContext(UserInfoContext);

//   const today = new Date().toISOString().split("T")[0];
 

//   // ✅ Fetch all leave requests for this employee
//   const fetchLeaves = async () => {
//     try {
//       if (!user?._id) return;
//       const res = await axios.get(`/api/leaves/${user._id}`);
//       setLeaveRequests(res.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching leaves:", error);
//       toast.error("error fetching leave");
//     }
//   };
  

//   useEffect(() => {
//     if (user?._id) {
//       fetchLeaves();
//     }
//   }, [user?._id]);   // 👈 dependency add
  

//   const stats = {
//     total: leaveRequests.length,
//     approved: leaveRequests.filter((req) => req.status === "APPROVED").length,
//     pending: leaveRequests.filter((req) => req.status === "PENDING").length,
//     rejected: leaveRequests.filter((req) => req.status === "REJECTED").length,
//   };

//   // ✅ Submit leave request
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!leaveType || !startDate || !endDate || !reason) {
//       alert("All fields are required!");
//       return;
//     }
  
//     if (startDate < today || endDate < today) {
//       alert("Dates must be today or later");
//       return;
//     }
  
//     const newRequest = {
//       employee: user._id, // FIXED
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//     };
  
//     try {
//       await axios.post("/api/leaves/applyLeave", newRequest);
  
//       setLeaveType("SICK");
//       setStartDate("");
//       setEndDate("");
//       setReason("");
//       setShowForm(false);
  
//       fetchLeaves();
//       toast.success("Leave applied successfully")
  
//     } catch (error) {
//       toast.error(error?.response?.data?.message || error.message);
//       console.error(error);
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
//         <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
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
//                   onChange={(e) => setLeaveType(e.target.value)}
//                   className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
//                 >
//                   <option value="SICK">SICK</option>
//                   <option value="CASUAL">CASUAL</option>
//                   <option value="ANNUAL">ANNUAL</option>
//                   <option value="UNPAID">UNPAID</option>
//                 </select>
//               </div>

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

// ✅ Types
interface User {
  _id?: string;
  name?: string;
}

interface LeaveRequest {
  _id: string;
  employee: string;
  leaveType: "SICK" | "CASUAL" | "ANNUAL" | "UNPAID" | string;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  reason: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | string;
  createdAt: string; // ISO date
}

const LeaveRequests: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Form fields
  const [leaveType, setLeaveType] = useState<LeaveRequest["leaveType"]>("SICK");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const { user } = useContext<{ user?: User }>(UserInfoContext);

  const today = new Date().toISOString().split("T")[0];

  // ✅ Fetch all leave requests for this employee
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
    total: leaveRequests.length,
    approved: leaveRequests.filter((req) => req.status === "APPROVED").length,
    pending: leaveRequests.filter((req) => req.status === "PENDING").length,
    rejected: leaveRequests.filter((req) => req.status === "REJECTED").length,
  };

  // ✅ Submit leave request
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason) {
      alert("All fields are required!");
      return;
    }

    if (startDate < today || endDate < today) {
      alert("Dates must be today or later");
      return;
    }

    const newRequest = {
      employee: user?._id,
      leaveType,
      startDate,
      endDate,
      reason,
    };

    try {
      await axios.post("/api/leaves/applyLeave", newRequest);

      // Reset form
      setLeaveType("SICK");
      setStartDate("");
      setEndDate("");
      setReason("");
      setShowForm(false);

      fetchLeaves();
      toast.success("Leave applied successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-8 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Leave Requests</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Request Leave
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
          <FileText className="text-indigo-600" size={30} />
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
          <CheckCircle className="text-green-600" size={30} />
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-xl font-bold">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
          <Clock className="text-yellow-500" size={30} />
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md flex items-center gap-3 transition">
          <XCircle className="text-red-600" size={30} />
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Submit Leave Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) =>
                    setLeaveType(e.target.value as LeaveRequest["leaveType"])
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="SICK">SICK</option>
                  <option value="CASUAL">CASUAL</option>
                  <option value="ANNUAL">ANNUAL</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter reason for leave..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave History */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Leave History</h2>

        {leaveRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-8">
            <FileText size={42} className="mb-3 text-indigo-500" />
            <p>No leave requests found</p>
            <p className="text-sm">
              Click <span className="font-medium">"Request Leave"</span> to
              submit your first request
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="p-3">Applied On</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">{req.leaveType}</td>
                    <td className="p-3">
                      {new Date(req.startDate).toLocaleDateString()} →{" "}
                      {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{req.reason}</td>
                    <td
                      className={`p-3 font-medium ${
                        req.status === "APPROVED"
                          ? "text-green-600"
                          : req.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {req.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
