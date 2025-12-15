
// // import React, { useEffect, useState } from "react";
// // import {
// //   PlusCircle,
// //   Edit,
// //   Trash2,
// //   Loader2,
// //   CheckCircle,
// //   Clock,
// //   AlertCircle,
// // } from "lucide-react";
// // import axios from "../../util/axiosInstance";
// // import toast from "react-hot-toast";
// // import Layout from "../../components/Layout";
// // import TaskModal from "../user/TaskModel";

// // const Tasks = () => {
// //   const [user, setUser] = useState(null);
// //   const [tasks, setTasks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [editTask, setEditTask] = useState(null);

// //   // Load user from localStorage
// //   useEffect(() => {
// //     const storedUser = JSON.parse(localStorage.getItem("user"));
// //     if (storedUser) setUser(storedUser);
// //     else setLoading(false);
// //   }, []);

// //   // Fetch tasks
// //   const fetchTasks = async () => {
// //     if (!user?.token || !user?.id) {
// //       setLoading(false);
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       const res = await axios.get(`/api/tasks/${user.id}`, {
// //         headers: { Authorization: `Bearer ${user.token}` },
// //       });
// //       setTasks(res.data?.task || []);
// //     } catch (err) {
// //       toast.error(err?.response?.data?.message || "Failed to load tasks");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (user?.id) fetchTasks();
// //   }, [user]);

// //   // Delete Task
// //   const handleDelete = async (id) => {
// //     try {
// //       await axios.delete(`/api/tasks/${id}`, {
// //         headers: { Authorization: `Bearer ${user.token}` },
// //       });
// //       toast.success("Task deleted");
// //       setTasks((prev) => prev.filter((t) => t._id !== id));
// //     } catch (err) {
// //       toast.error(err?.response?.data?.message || "Delete failed");
// //     }
// //   };

// //   // Open modal for edit
// //   const handleEdit = (task) => {
// //     setEditTask(task);
// //     setShowModal(true);
// //   };

// //   // Close modal
// //   const closeModal = () => {
// //     setEditTask(null);
// //     setShowModal(false);
// //     fetchTasks();
// //   };

// //   // Badge colors for priority
// //   const priorityColors = {
// //     LOW: "bg-green-100 text-green-700",
// //     MEDIUM: "bg-yellow-100 text-yellow-700",
// //     HIGH: "bg-orange-100 text-orange-700",
// //     CRITICAL: "bg-red-100 text-red-700",
// //   };

// //   // Badge colors for status
// //   const statusColors = {
// //     DONE: "bg-green-100 text-green-700",
// //     IN_PROGRESS: "bg-yellow-100 text-yellow-700",
// //     PENDING: "bg-gray-100 text-gray-700",
// //     BLOCKED: "bg-red-100 text-red-700",
// //     DELAYED: "bg-purple-100 text-purple-700",
// //   };

// //   if (!user) {
// //     return (
// //       <Layout>
// //         <div className="p-6 text-center text-gray-500">
// //           Please log in to view your tasks.
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout>
// //       <div className="p-6 flex-1 overflow-auto">
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
// //           <h1 className="text-3xl font-bold text-gray-900">📋 My Tasks</h1>

// //           {(user?.role === "Admin" || user?.role === "HR") && (
// //             <button
// //               onClick={() => setShowModal(true)}
// //               className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
// //             >
// //               <PlusCircle className="w-5 h-5" /> New Task
// //             </button>
// //           )}
// //         </div>

// //         {/* Tasks */}
// //         {loading ? (
// //           <div className="flex justify-center items-center h-64">
// //             <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
// //           </div>
// //         ) : tasks.length === 0 ? (
// //           <div className="bg-white rounded-2xl shadow p-12 flex flex-col items-center justify-center text-gray-500">
// //             <AlertCircle className="w-14 h-14 mb-4 text-gray-400" />
// //             <p className="text-lg font-medium">No tasks available</p>
// //             <p className="text-sm mt-1">Start by creating your first task</p>
// //             {(user?.role === "Admin" || user?.role === "HR") && (
// //               <button
// //                 onClick={() => setShowModal(true)}
// //                 className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
// //               >
// //                 <PlusCircle className="w-5 h-5" /> Create Task
// //               </button>
// //             )}
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {tasks.map((task) => (
// //               <div
// //                 key={task._id}
// //                 className="bg-white shadow rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl transition border border-gray-100"
// //               >
// //                 <div>
// //                   <h2 className="text-lg font-semibold text-gray-800 truncate">
// //                     {task.title}
// //                   </h2>
// //                   <p className="text-sm text-gray-600 mt-1 line-clamp-3">
// //                     {task.description}
// //                   </p>

// //                   {task.dueDate && (
// //                     <p className="text-xs text-gray-500 mt-2">
// //                       📅 Due: {new Date(task.dueDate).toLocaleDateString()}
// //                     </p>
// //                   )}

// //                   <div className="flex items-center gap-2 mt-2">
// //                     <span
// //                       className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
// //                     >
// //                       {task.priority}
// //                     </span>
// //                     <span
// //                       className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}
// //                     >
// //                       {task.status === "DONE" ? (
// //                         <CheckCircle className="w-3 h-3" />
// //                       ) : (
// //                         <Clock className="w-3 h-3" />
// //                       )}
// //                       {task.status}
// //                     </span>
// //                   </div>
// //                 </div>

// //                 {(user?.role === "Admin" || user?.role === "HR") && (
// //                   <div className="flex gap-2 mt-4 justify-end">
// //                     <button
// //                       onClick={() => handleEdit(task)}
// //                       className="p-2 rounded-lg hover:bg-indigo-50 transition text-indigo-600"
// //                     >
// //                       <Edit className="w-5 h-5" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(task._id)}
// //                       className="p-2 rounded-lg hover:bg-red-50 transition text-red-600"
// //                     >
// //                       <Trash2 className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Task Modal */}
// //         {showModal && (
// //           <TaskModal task={editTask} onClose={closeModal} user={user} />
// //         )}
// //       </div>
// //     </Layout>
// //   );
// // };

// import React, { useContext, useEffect, useState } from "react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import { AlertCircle, Loader2 } from "lucide-react";
// import Layout from "../Layout";

// const Tasks = () => {
//   const { user } = useContext(UserInfoContext);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingTask, setUpdatingTask] = useState(null);

//   // ✅ Fetch tasks for logged-in employee
//   const fetchTasks = async () => {
//     if (!user?._id) return;
//     console.log("the api context user is ",user)
//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/task/${user._id}`);
//     console.log(res.data?.data)
//       setTasks(res.data?.data|| []);
//     } catch (err) {
//       console.error("Error fetching tasks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [user?._id]);

//   // ✅ Status badge helper
//   const getStatusStyle = (status) => {
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
//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       setUpdatingTask(taskId);
//       await axios.put(`/api/task/${taskId}`, { status: newStatus });
//       await fetchTasks();
//     } catch (err) {
//       console.error("Error updating task:", err);
//     } finally {
//       setUpdatingTask(null);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6 text-gray-800 space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-gray-800">📋 My Tasks</h1>
//         </div>

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
//                           handleStatusChange(task._id, e.target.value)
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
//                         ? `${task.createdBy.firstName} ${task.createdBy.lastName}`
//                         : "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Tasks;
import React, { useContext, useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import { AlertCircle, Loader2 } from "lucide-react";
import Layout from "../Layout";

// ✅ Types
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
  dueDate?: string; // ISO date
  status?: "PENDING" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "DELAYED" | string;
  createdBy?: {
    firstName?: string;
    lastName?: string;
  };
}

const Tasks: React.FC = () => {
  const { user } = useContext<{ user?: User }>(UserInfoContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);

  // ✅ Fetch tasks for logged-in employee
  const fetchTasks = async () => {
    if (!user?._id) return;
    console.log("the api context user is ", user);
    try {
      setLoading(true);
      const res = await axios.get<{ data: Task[] }>(`/api/task/${user._id}`);
      setTasks(res.data?.data || []);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user?._id]);

  // ✅ Status badge helper
  const getStatusStyle = (status?: Task["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "DONE":
        return "bg-green-100 text-green-700 border border-green-300";
      case "BLOCKED":
        return "bg-red-100 text-red-700 border border-red-300";
      case "DELAYED":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  // ✅ Update task status
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

  return (
    <Layout>
      <div className="p-6 text-gray-800 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">📋 My Tasks</h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-10 text-indigo-600">
            <Loader2 className="animate-spin w-10 h-10" />
          </div>
        ) : tasks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-gray-500 py-16 bg-gray-50 rounded-xl shadow-inner">
            <AlertCircle size={50} className="mb-4 text-gray-400" />
            <p className="text-lg font-medium">No tasks assigned yet.</p>
          </div>
        ) : (
          /* Tasks Table */
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 font-semibold">
                  <th className="p-4">Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created By</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-semibold text-gray-800">
                      {task.title}
                    </td>
                    <td className="p-4 text-gray-600">
                      {task.description || "—"}
                    </td>
                    <td className="p-4 capitalize">
                      <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                        {task.priority || "—"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4">
                      <select
                        value={task.status || "PENDING"}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value as Task["status"])
                        }
                        disabled={updatingTask === task._id}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          task.status
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="DELAYED">DELAYED</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-700">
                      {task.createdBy
                        ? `${task.createdBy.firstName || ""} ${task.createdBy.lastName || ""}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
