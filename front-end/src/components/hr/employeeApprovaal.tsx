
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import axios from "../../util/axiosInstance";
// import { MdEmail } from "react-icons/md";
// import { User2Icon } from "lucide-react";

// // ------------------------
// // TYPES
// // ------------------------

// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   position: string;
//   experience: number;
//   status: "PENDING" | "APPROVED" | "REJECTED" | string;
// }

// interface PaginationResponse {
//   users: Employee[];
//   total: number;
//   totalPages: number;
//   page: number;
// }
// type LoadingAction ={
//     id: string; 
//     action: "Approved" | "Rejected"  }
  




// // ------------------------
// // COMPONENT
// // ------------------------

// const EmployeeApproval: React.FC = () => {
//   const [users, setUsers] = useState<Employee[]>([]);
//   const [search, setSearch] = useState<string>("");
//   const [selectedUser, setSelectedUser] = useState<Employee | null>(null);

//   // Pagination
//   const [page, setPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const limit = 3;
//   const [loadingAction, setLoadingAction] =useState<LoadingAction>(null);
//   // ------------------------
//   // FETCH USERS (SERVER SIDE SEARCH)
//   // ------------------------

//   const fetchEmployees = async (pageNo: number = 1) => {
//     try {
//       const res = await axios.get<{ success: boolean; data: PaginationResponse }>(
//         "/api/users",
//         {
//           params: {
//             page: pageNo,
//             limit,
//             search, // ✅ backend search
//           },
//         }
//       );

//       setUsers(res.data.data.users || []);
//       setTotalPages(res.data.data.totalPages || 1);
//       setPage(res.data.data.page || 1);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   // Fetch on page change
//   useEffect(() => {
//     fetchEmployees(page);
//   }, [page]);

//   // Reset page & refetch on search (with debounce)
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchEmployees(1);
//     }, 800);

//     return () => clearTimeout(delay);
//   }, [search]);

//   // ------------------------
//   // APPROVE / REJECT
//   // ------------------------

//   const handleAccept = async (id: string) => {
//     try {
//       setLoadingAction({id,action:"Approved"})
//       const res = await axios.post(`/api/users/approve/${id}`);
//       if (res.data.success) {
//         toast.success("User approved");
//         fetchEmployees(page);
//       }
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || err.message);
//     }
//     finally{
//       setLoadingAction(null)
//     }
//   };

//   const handleReject = async (id: string) => {
//     try { 
//       setLoadingAction({id,action:"Rejected"})
//       const res = await axios.post(`/api/users/reject/${id}`);
//       if (res.data.success) {
//         toast.success("User rejected");
//         fetchEmployees(page);
//       }
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || err.message);
//     }
//   };

//   // ------------------------
//   // UI
//   // ------------------------

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <h1 className="text-3xl font-bold mb-6">
//         Employee <span className="text-blue-600">Approvals</span>
//       </h1>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="🔍 Search by name "
//         className="w-full sm:w-1/2 border rounded-lg px-4 py-2 mb-6"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* List */}
//       {users.length === 0 ? (
//         <p className="text-center text-gray-500">No employees found</p>
//       ) : (
//         <div className="space-y-4">
//           {users.map((user) => (
//             <div
//               key={user._id}
//               className="bg-white border rounded-xl p-5 shadow-sm"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold flex items-center gap-2">
//                     <User2Icon className="w-5 h-5 text-blue-600" />
//                     {user.firstName} {user.lastName}
//                   </p>
//                   <p className="text-sm text-gray-500 flex items-center gap-1">
//                     <MdEmail />
//                     {user.email}
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   {user.status === "PENDING" && (
//                     <>
//                       <button
//                         onClick={() => handleAccept(user._id)}
//                         disabled={loadingAction?.id==user._id}
//                         className="bg-green-600 text-white px-3 py-1 rounded"
//                       >
//                        {loadingAction?.id==user._id && loadingAction.action== "Approved"
//                            ? "Approving...": "Approve"}
//                       </button>
//                       <button
//                         onClick={() => handleReject(user._id)}
//                         disabled={loadingAction?.id==user._id}
//                         className="bg-red-600 text-white px-3 py-1 rounded"
//                       >
//                         {loadingAction?.id==user._id && loadingAction.action== "Rejected"
//                            ? "Approving...": "Rejected"}
//                       </button>
//                     </>
//                   )}
//                   <button
//                     onClick={() => setSelectedUser(user)}
//                     className="bg-blue-600 text-white px-3 py-1 rounded"
//                   >
//                     View
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           onClick={() => setPage((p) => Math.max(p - 1, 1))}
//           disabled={page === 1}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>

//         <span>
//           Page {page} of {totalPages}
//         </span>

//         <button
//           onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//           disabled={page === totalPages}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {/* Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
//             <button
//               onClick={() => setSelectedUser(null)}
//               className="absolute top-2 right-2"
//             >
//               ✖
//             </button>

//             <h2 className="text-xl font-bold mb-4">Employee Details</h2>
//             <p><b>Name:</b> {selectedUser.firstName} {selectedUser.lastName}</p>
//             <p><b>Email:</b> {selectedUser.email}</p>
//             <p><b>Position:</b> {selectedUser.position}</p>
//             <p><b>Experience:</b> {selectedUser.experience} years</p>
//             <p><b>Status:</b> {selectedUser.status}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeApproval;
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../util/axiosInstance";
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

interface PaginationResponse {
  users: Employee[];
  total: number;
  totalPages: number;
  page: number;
}

type LoadingAction = {
  id: string;
  action: "Approved" | "Rejected";
};

// ------------------------
// AVATAR HELPER
// ------------------------

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const palettes = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
  ];
  const color = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <span
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0 ${color}`}
    >
      {initials}
    </span>
  );
};

// ------------------------
// STATUS BADGE
// ------------------------

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { cls: string; dot: string; label: string }> = {
    PENDING: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      dot: "bg-amber-500",
      label: "Pending",
    },
    APPROVED: {
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
      label: "Approved",
    },
    REJECTED: {
      cls: "bg-rose-50 text-rose-700 border border-rose-200",
      dot: "bg-rose-500",
      label: "Rejected",
    },
  };
  const s = map[status?.toUpperCase()] || {
    cls: "bg-slate-50 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    label: status,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${s.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ------------------------
// COMPONENT
// ------------------------

const EmployeeApproval: React.FC = () => {
  const [users, setUsers] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  // ------------------------
  // FETCH USERS (UNCHANGED)
  // ------------------------

  const fetchEmployees = async (pageNo: number = 1) => {
    try {
      const res = await axios.get<{ success: boolean; data: PaginationResponse }>(
        "/api/users",
        { params: { page: pageNo, limit, search } }
      );
      setUsers(res.data.data.users || []);
      setTotalPages(res.data.data.totalPages || 1);
      setPage(res.data.data.page || 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchEmployees(1);
    }, 800);
    return () => clearTimeout(delay);
  }, [search]);

  // ------------------------
  // APPROVE / REJECT (UNCHANGED)
  // ------------------------

  const handleAccept = async (id: string) => {
    try {
      setLoadingAction({ id, action: "Approved" });
      const res = await axios.post(`/api/users/approve/${id}`);
      if (res.data.success) {
        toast.success("User approved");
        fetchEmployees(page);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoadingAction({ id, action: "Rejected" });
      const res = await axios.post(`/api/users/reject/${id}`);
      if (res.data.success) {
        toast.success("User rejected");
        fetchEmployees(page);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  // ------------------------
  // UI
  // ------------------------

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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Employee Approvals
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Review and manage pending employee registration requests
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name…"
              className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Employee List ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Applicants</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {users.length} {users.length === 1 ? "record" : "records"}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Page <span className="font-medium text-slate-600">{page}</span> of{" "}
              <span className="font-medium text-slate-600">{totalPages}</span>
            </span>
          </div>

          {/* Empty state */}
          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="text-sm font-medium text-slate-500">No employees found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {users.map((user) => {
                const isActing = loadingAction?.id === user._id;
                return (
                  <li
                    key={user._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Left: Avatar + Info */}
                    <div className="flex items-center gap-4">
                      <Avatar name={`${user.firstName} ${user.lastName}`} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-800 text-sm">
                            {user.firstName} {user.lastName}
                          </span>
                          <StatusBadge status={user.status} />
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                          <MdEmail className="text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                        {user.position && (
                          <span className="inline-block mt-1 text-xs text-slate-400">
                            {user.position}
                            {user.experience ? ` · ${user.experience} yrs exp` : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {user.status === "PENDING" && (
                        <>
                          {/* Approve */}
                          <button
                            onClick={() => handleAccept(user._id)}
                            disabled={isActing}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                              isActing && loadingAction?.action === "Approved"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white hover:shadow-md"
                            }`}
                          >
                            {isActing && loadingAction?.action === "Approved" ? (
                              <>
                                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Approving…
                              </>
                            ) : (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Approve
                              </>
                            )}
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => handleReject(user._id)}
                            disabled={isActing}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                              isActing && loadingAction?.action === "Rejected"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 hover:shadow-md"
                            }`}
                          >
                            {isActing && loadingAction?.action === "Rejected" ? (
                              <>
                                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Rejecting…
                              </>
                            ) : (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Reject
                              </>
                            )}
                          </button>
                        </>
                      )}

                      {/* View Details */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all shadow-sm"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* ── Pagination footer ── */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
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
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Employee Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Full profile information</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5">
              {/* Profile row */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                <Avatar name={`${selectedUser.firstName} ${selectedUser.lastName}`} />
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedUser.email}</p>
                  <div className="mt-1.5">
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <dl className="grid grid-cols-2 gap-4">
                {[
                  { label: "Position", value: selectedUser.position || "—" },
                  {
                    label: "Experience",
                    value: selectedUser.experience
                      ? `${selectedUser.experience} year${selectedUser.experience !== 1 ? "s" : ""}`
                      : "—",
                  },
                  { label: "Status", value: selectedUser.status },
                  { label: "Email", value: selectedUser.email },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                      {label}
                    </dt>
                    <dd className="text-sm font-medium text-slate-800 truncate">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeApproval;