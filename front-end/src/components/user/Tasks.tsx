
// import React, { useContext, useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import { AlertCircle, Loader2 } from "lucide-react";
// import Layout from "../Layout";

// // ✅ Types
// interface User {
//   _id?: string;
//   firstName?: string;
//   lastName?: string;
//   role?: "Admin" | "HR" | "Employee" | string;
// }

// interface Task {
//   _id: string;
//   title: string;
//   description?: string;
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
//   dueDate?: string; // ISO date
//   status?: "PENDING" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "DELAYED" | string;
//   createdBy?: {
//     firstName?: string;
//     lastName?: string;
//   };
// }

// const Tasks: React.FC = () => {
//   const { user } = useContext<{ user?: User }>(UserInfoContext);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [updatingTask, setUpdatingTask] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);           // current page
// const [totalPages, setTotalPages] = useState<number>(1); // total pages from API
// const limit = 4; // items per page
// const [filterStatus, setFilterStatus] = useState<string>("");
// const [filterPriority, setFilterPriority] = useState<string>("");


//   // ✅ Fetch tasks for logged-in employee
//   // const fetchTasks = async () => {
//   //   if (!user?._id) return;
//   //   console.log("the api context user is ", user);
//   //   try {
//   //     setLoading(true);
//   //     const res = await axios.get<{ data: Task[] }>(`/api/task/${user._id}`);
//   //     setTasks(res.data?.data || []);
//   //   } catch (err: any) {
//   //     console.error("Error fetching tasks:", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchTasks = async (
//     currentPage = page,
//     statusValue: string = filterStatus,
//     priorityValue: string = filterPriority
//   ) => {
//     if (!user?._id) return;
//     setLoading(true);
  
//     const params: any = { page: currentPage, limit };
//     if (statusValue) params.status = statusValue;
//     if (priorityValue) params.priority = priorityValue;
  
//     try {
//       const res = await axios.get(`/api/task/${user._id}`, { params });
//       const data = res.data.data;
//       setTasks(data.tasks);
//       setPage(data.page);
//       setTotalPages(data.totalPages);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
//   useEffect(() => {
//     fetchTasks(page);
//   }, [user?._id,page,filterStatus,filterPriority]);
  

//   // ✅ Status badge helper
//   const getStatusStyle = (status?: Task["status"]) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-700 border border-yellow-300";
//       case "IN_PROGRESS":
//         return "bg-blue-100 text-blue-700 border border-blue-300";
//       case "DONE":
//         return "bg-green-100 text-green-700 border border-green-300";
//       case "BLOCKED":
//         return "bg-red-100 text-red-700 border border-red-300";
//       case "DELAYED":
//         return "bg-purple-100 text-purple-700 border border-purple-300";
//       default:
//         return "bg-gray-100 text-gray-700 border border-gray-300";
//     }
//   };

//   // ✅ Update task status
//   const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
//     try {
//       setUpdatingTask(taskId);
//       await axios.put(`/api/task/${taskId}`, { status: newStatus });
//       await fetchTasks();
//     } catch (err: any) {
//       console.error("Error updating task:", err);
//     } finally {
//       setUpdatingTask(null);
//     }
//   };

//   return (
    
//       <div className="p-6 text-gray-800 space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-gray-800">📋 My Tasks</h1>
//         </div>
//         <div className="flex gap-4 mb-4">
//   <select
//     value={filterStatus}
//     onChange={(e) => { setFilterStatus(e.target.value); 
//       fetchTasks(1, e.target.value, filterPriority); // pass updated status

    
//     }}
    
//     className="border rounded px-2 py-1"
//   >
//     <option value="">All Status</option>
//     <option value="PENDING">PENDING</option>
//     <option value="IN_PROGRESS">IN_PROGRESS</option>
//     <option value="DONE">DONE</option>
//     <option value="BLOCKED">BLOCKED</option>
//     <option value="DELAYED">DELAYED</option>
//   </select>

//   <select
//     value={filterPriority}
//     onChange={(e) => { setFilterPriority(e.target.value); fetchTasks(1); }}
//     className="border rounded px-2 py-1"
//   >
//     <option value="">All Priority</option>
//     <option value="LOW">LOW</option>
//     <option value="MEDIUM">MEDIUM</option>
//     <option value="HIGH">HIGH</option>
//     <option value="CRITICAL">CRITICAL</option>
//   </select>
// </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center py-10 text-indigo-600">
//             <Loader2 className="animate-spin w-10 h-10" />
//           </div>
//         ) : tasks.length === 0 ? (
//           /* Empty State */
//           <div className="flex flex-col items-center justify-center text-gray-500 py-16 bg-gray-50 rounded-xl shadow-inner">
//             <AlertCircle size={50} className="mb-4 text-gray-400" />
//             <p className="text-lg font-medium">No tasks assigned yet.</p>
//           </div>
//         ) : (
//           /* Tasks Table */
//           <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
//             <table className="w-full border-collapse text-sm sm:text-base">
//               <thead>
//                 <tr className="bg-gray-100 text-left text-gray-700 font-semibold">
//                   <th className="p-4">Title</th>
//                   <th className="p-4">Description</th>
//                   <th className="p-4">Priority</th>
//                   <th className="p-4">Due Date</th>
//                   <th className="p-4">Status</th>
//                   <th className="p-4">Created By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task) => (
//                   <tr
//                     key={task._id}
//                     className="border-t hover:bg-gray-50 transition"
//                   >
//                     <td className="p-4 font-semibold text-gray-800">
//                       {task.title}
//                     </td>
//                     <td className="p-4 text-gray-600">
//                       {task.description || "—"}
//                     </td>
//                     <td className="p-4 capitalize">
//                       <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
//                         {task.priority || "—"}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {task.dueDate
//                         ? new Date(task.dueDate).toLocaleDateString()
//                         : "—"}
//                     </td>
//                     <td className="p-4">
//                       <select
//                         value={task.status || "PENDING"}
//                         onChange={(e) =>
//                           handleStatusChange(task._id, e.target.value as Task["status"])
//                         }
//                         disabled={updatingTask === task._id}
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
//                           task.status
//                         )}`}
//                       >
//                         <option value="PENDING">PENDING</option>
//                         <option value="IN_PROGRESS">IN PROGRESS</option>
//                         <option value="DONE">DONE</option>
//                         <option value="BLOCKED">BLOCKED</option>
//                         <option value="DELAYED">DELAYED</option>
//                       </select>
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {task.createdBy
//                         ? `${task.createdBy.firstName || ""} ${task.createdBy.lastName || ""}`
//                         : "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         <div className="flex justify-between items-center  gap-4 mt-4">
//   <button
//     disabled={page === 1}
//     onClick={() => fetchTasks(page - 1)}
//     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//   >
//     Previous
//   </button>

//   <span>
//     Page {page} of {totalPages}
//   </span>

//   <button
//     disabled={page === totalPages}
//     onClick={() => fetchTasks(page + 1)}
//     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//   >
//     Next
//   </button>
// </div>

//       </div>
  
//   );
// };

// export default Tasks;
import React, { useContext, useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import { AlertCircle, Loader2 } from "lucide-react";
import Layout from "../Layout";

// ✅ Types (UNCHANGED)
interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  role?: "Admin" | "HR" | "Employee" | string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  dueDate?: string;
  status?: "PENDING" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "DELAYED" | string;
  createdBy?: {
    firstName?: string;
    lastName?: string;
  };
}

// ------------------------
// BADGE CONFIGS
// ------------------------
const statusMeta: Record<string, { cls: string; dot: string }> = {
  PENDING:     { cls: "bg-amber-50 text-amber-700 border border-amber-200",     dot: "bg-amber-500"    },
  IN_PROGRESS: { cls: "bg-sky-50 text-sky-700 border border-sky-200",           dot: "bg-sky-500"      },
  DONE:        { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",dot: "bg-emerald-500" },
  BLOCKED:     { cls: "bg-rose-50 text-rose-700 border border-rose-200",         dot: "bg-rose-500"    },
  DELAYED:     { cls: "bg-violet-50 text-violet-700 border border-violet-200",   dot: "bg-violet-500"  },
};

const priorityMeta: Record<string, { cls: string; dot: string }> = {
  LOW:      { cls: "bg-slate-100 text-slate-600 border border-slate-200",       dot: "bg-slate-400"    },
  MEDIUM:   { cls: "bg-amber-50 text-amber-700 border border-amber-200",        dot: "bg-amber-400"    },
  HIGH:     { cls: "bg-orange-50 text-orange-700 border border-orange-200",     dot: "bg-orange-500"   },
  CRITICAL: { cls: "bg-rose-50 text-rose-700 border border-rose-200",           dot: "bg-rose-500"     },
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const m = statusMeta[status || ""] || { cls: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {status?.replace("_", " ") || "—"}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority?: string }> = ({ priority }) => {
  const m = priorityMeta[priority || ""] || { cls: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {priority || "—"}
    </span>
  );
};

// ── getStatusStyle kept for the select coloring (UNCHANGED logic)
const getStatusStyle = (status?: Task["status"]) => {
  switch (status) {
    case "PENDING":     return "bg-amber-50 text-amber-700 border border-amber-200";
    case "IN_PROGRESS": return "bg-sky-50 text-sky-700 border border-sky-200";
    case "DONE":        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "BLOCKED":     return "bg-rose-50 text-rose-700 border border-rose-200";
    case "DELAYED":     return "bg-violet-50 text-violet-700 border border-violet-200";
    default:            return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

// ------------------------
// MAIN COMPONENT
// ------------------------
const Tasks: React.FC = () => {
  const { user } = useContext<{ user?: User }>(UserInfoContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 4;
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");

  // ✅ FETCH (UNCHANGED)
  const fetchTasks = async (
    currentPage = page,
    statusValue: string = filterStatus,
    priorityValue: string = filterPriority
  ) => {
    if (!user?._id) return;
    setLoading(true);
    const params: any = { page: currentPage, limit };
    if (statusValue) params.status = statusValue;
    if (priorityValue) params.priority = priorityValue;
    try {
      const res = await axios.get(`/api/task/${user._id}`, { params });
      const data = res.data.data;
      setTasks(data.tasks);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [user?._id, page, filterStatus, filterPriority]);

  // ✅ STATUS UPDATE (UNCHANGED)
  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      setUpdatingTask(taskId);
      await axios.put(`/api/task/${taskId}`, { status: newStatus });
      await fetchTasks();
    } catch (err: any) {
      console.error("Error updating task:", err);
    } finally {
      setUpdatingTask(null);
    }
  };

  // ── Due date urgency helper
  const isDueUrgent = (dueDate?: string) => {
    if (!dueDate) return false;
    const diff = (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  };
  const isOverdue = (dueDate?: string, status?: string) => {
    if (!dueDate || status === "DONE") return false;
    return new Date(dueDate) < new Date();
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Tasks</h1>
            <p className="text-sm text-slate-500 mt-0.5">View and update your assigned tasks</p>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Task List</h2>
              {!loading && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {/* Status filter */}
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                </span>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    fetchTasks(1, e.target.value, filterPriority);
                  }}
                  className="pl-7 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="DELAYED">DELAYED</option>
                </select>
              </div>

              {/* Priority filter */}
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </span>
                <select
                  value={filterPriority}
                  onChange={(e) => { setFilterPriority(e.target.value); fetchTasks(1); }}
                  className="pl-7 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
                >
                  <option value="">All Priority</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 className="animate-spin w-7 h-7 text-blue-600" />
              <p className="text-sm text-slate-500">Loading tasks…</p>
            </div>

          ) : tasks.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <AlertCircle size={22} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No tasks assigned yet</p>
              <p className="text-xs text-slate-400">Tasks assigned to you will appear here</p>
            </div>

          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Title", "Priority", "Due Date", "Status", "Created By", "Update"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${i === 5 ? "text-center" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tasks.map((task) => {
                    const urgent  = isDueUrgent(task.dueDate);
                    const overdue = isOverdue(task.dueDate, task.status);
                    return (
                      <tr key={task._id} className="hover:bg-slate-50/80 transition-colors group">

                        {/* Title + description */}
                        <td className="px-5 py-3.5 max-w-[220px]">
                          <p className="font-semibold text-slate-800 truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="px-5 py-3.5">
                          <PriorityBadge priority={task.priority} />
                        </td>

                        {/* Due Date */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {task.dueDate ? (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-medium ${overdue ? "text-rose-600" : urgent ? "text-amber-600" : "text-slate-600"}`}>
                                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                              {overdue && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-600">
                                  Overdue
                                </span>
                              )}
                              {urgent && !overdue && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-600">
                                  Soon
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Status badge (read display) */}
                        <td className="px-5 py-3.5">
                          <StatusBadge status={task.status} />
                        </td>

                        {/* Created By */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {task.createdBy ? (
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                                {(task.createdBy.firstName?.[0] || "") + (task.createdBy.lastName?.[0] || "")}
                              </span>
                              <span className="text-xs text-slate-600 font-medium">
                                {task.createdBy.firstName} {task.createdBy.lastName}
                              </span>
                            </div>
                          ) : <span className="text-slate-400 text-xs">—</span>}
                        </td>

                        {/* Status select (action) */}
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {updatingTask === task._id ? (
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <svg className="animate-spin w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Saving…
                              </div>
                            ) : (
                              <select
                                value={task.status || "PENDING"}
                                onChange={(e) => handleStatusChange(task._id, e.target.value as Task["status"])}
                                disabled={updatingTask === task._id}
                                className={`text-xs border rounded-lg px-2 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer ${getStatusStyle(task.status)}`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                                <option value="BLOCKED">BLOCKED</option>
                                <option value="DELAYED">DELAYED</option>
                              </select>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination footer ── */}
          {!loading && tasks.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
              <button
                disabled={page === 1}
                onClick={() => fetchTasks(page - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchTasks(p)}
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
                onClick={() => fetchTasks(page + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;