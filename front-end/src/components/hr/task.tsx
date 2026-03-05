

// import { useEffect, useState, useContext, FormEvent } from "react";
// import axios from "../../util/axiosInstance";
// import { UserInfoContext } from "../../context/contextApi";
// import { Plus, Trash2, Edit3 } from "lucide-react";
// import toast from "react-hot-toast";
// import { debounce } from "../../util/debounce";
// import { useMemo } from "react";


// // -------------------------------------
// // Interfaces
// // -------------------------------------
// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
//   dueDate?: string;
//   status: "PENDING" | "IN_PROGRESS" | "DONE" | "COMPLETED" | "BLOCKED" | "DELAYED";
//   assignTo?: Employee | null; // now backend sends full object
// }

// interface UserInfo {
//   id: string;
//   email: string;
//   role: string;
// }
// interface TaskFormErrors {
//   title?: string;
//   description?: string;
//   dueDate?: string;
//   assignTo?: string;
// }




// // -------------------------------------
// // Component
// // -------------------------------------
// const TaskManagement = () => {
//   const { user } = useContext(UserInfoContext) as { user: UserInfo };

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const [limit] = useState<number>(5);
//   const [totalPages, setTotalPages] = useState<number>(1);

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [editTask, setEditTask] = useState<Task | null>(null);

//   // Filters
//   const [filterStatus, setFilterStatus] = useState<string>("");
//   const [filterPriority, setFilterPriority] = useState<string>("");
//   const [filterAssignTo, setFilterAssignTo] = useState<string>("");

//   // Form fields
//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [priority, setPriority] = useState<Task["priority"]>("LOW");
//   const [dueDate, setDueDate] = useState<string>("");
//   const [assignTo, setAssignTo] = useState<string>("");
//   const [formErrors, setFormErrors] = useState<TaskFormErrors>({});

//   // -------------------------------------
//   // Fetch tasks with filters
//   // -------------------------------------
//   const fetchTasks = async (currentPage = page) => {
//     try {
//       setLoading(true);

//       const params: any = {
//         page: currentPage,
//         limit,
//       };
//       if (filterStatus) params.status = filterStatus;
//       if (filterPriority) params.priority = filterPriority;
//       if (filterAssignTo) params.assignTo = filterAssignTo;

//       const res = await axios.get("/api/task/allTasks", { params });

//       setTasks(res.data.data.tasks);
//       setTotalPages(res.data.data.totalPages);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------------
//   // Fetch employees
//   // -------------------------------------
//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("/api/employee/");
//       setEmployees(res.data.data?.employees || []);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };
 
 
//   const debouncedAssignToChange = useMemo(
//     () =>
//       debounce((value: string) => {
//         setFilterAssignTo(value);
//         setPage(1); // reset pagination on search
//       }, 800),
//     []
//   );
  
//   useEffect(() => {
//     fetchTasks(page);
//   }, [page, filterStatus, filterPriority, filterAssignTo]);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // -------------------------------------
//   // Create / Update task
//   // -------------------------------------
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

    

//     try {
//       if (editTask) {
//         // UPDATE
//         await axios.put(`/api/task/${editTask._id}`, {
//           title,
//           description,
//           priority,
//           dueDate,
//           assignTo,
//         });
//         toast.success("Task updated!");
//       } else {
//         // CREATE
//         await axios.post("/api/task/createTasks", {
//           title,
//           description,
//           priority,
//           dueDate,
//           assignTo,
//           createdBy: user.id,
//         });
//         toast.success("Task created!");
//       }

//       // Reset form
//       setTitle("");
//       setDescription("");
//       setPriority("LOW");
//       setDueDate("");
//       setAssignTo("");
//       setEditTask(null);
//       setShowForm(false);

//       fetchTasks(1);
//       setPage(1);
//     } catch (error: any) {
//       console.log("the error on frontend is", error);
    
//       const data = error?.response?.data?.message;
    
//       const newErrors: TaskFormErrors = {};
    
//       if (data?.errors?.length) {
//         data.errors.forEach((e: any) => {
//           if (e.field) {
//             newErrors[e.field as keyof TaskFormErrors] = e.message;
//           }
//         });
//       } 
      
//       else   {
//         toast.error(error?.response?.data?.message) // fallback global error
//       }
    
//       setFormErrors(newErrors);
//     }
    
//   };

//   // -------------------------------------
//   // Edit Task
//   // -------------------------------------
//   const handleEdit = (task: Task) => {
//     setEditTask(task);
//     setTitle(task.title);
//     setDescription(task.description);
//     setPriority(task.priority);
//     setDueDate(task.dueDate?.split("T")[0] || "");
//     setAssignTo(task.assignTo?._id || "");
//     setShowForm(true);
//   };

//   // -------------------------------------
//   // Delete Task
//   // -------------------------------------
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;

//     try {
//       await axios.delete(`/api/task/${id}`);
//       setTasks((prev) => prev.filter((t) => t._id !== id));
//       toast.success("Task deleted");
//       fetchTasks(page);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || error.message);
//     }
//   };

//   // -------------------------------------
//   // Update status
//   // -------------------------------------
//   const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
//     try {
//       await axios.put(`/api/task/${taskId}`, { status: newStatus });

//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
//       );

//       toast.success("Status updated");
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Error updating status");
//     }
//   };

//   // -------------------------------------
//   // JSX
//   // -------------------------------------
//   return (
//     <div className="p-4 sm:p-6 font-sans text-gray-800">
     

//       {/* Create Task Button */}
//       <div className="flex sm:flex-row justify-end sm:items-center mb-6 gap-3">
//         <button
//           onClick={() => {
//             setShowForm(true);
//             setEditTask(null);
//           }}
//           className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700"
//         >
//           <Plus size={18} /> Create Task
//         </button>
//       </div>
//        {/* Filters */}
//        <div className="flex flex-wrap gap-3 mb-4">
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border rounded px-2 py-1"
//         >
//           <option value="">All Status</option>
//           <option value="PENDING">PENDING</option>
//           <option value="IN_PROGRESS">IN_PROGRESS</option>
//           <option value="DONE">DONE</option>
//           <option value="COMPLETED">COMPLETED</option>
//           <option value="BLOCKED">BLOCKED</option>
//           <option value="DELAYED">DELAYED</option>
//         </select>

//         <select
//           value={filterPriority}
//           onChange={(e) => setFilterPriority(e.target.value)}
//           className="border rounded px-2 py-1"
//         >
//           <option value="">All Priority</option>
//           <option value="LOW">LOW</option>
//           <option value="MEDIUM">MEDIUM</option>
//           <option value="HIGH">HIGH</option>
//           <option value="CRITICAL">CRITICAL</option>
//         </select>

//         {/* Employee Filter as Input */}
//               <div>
//               <input
//                 type="text"
//                 placeholder="Filter by employee name"
//                 onChange={(e) => debouncedAssignToChange(e.target.value)}
//                 className="border rounded px-2 py-1"
//               />

//               </div>

//                     </div>

//       {/* Modal Form */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-lg font-bold mb-4">
//               {editTask ? "Edit Task" : "Create Task"}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Title */}
// <div>
//   <label className="block text-sm font-medium mb-1">Title</label>
//   <input
//     type="text"
//     value={title}
//     onChange={(e) => {
//       setTitle(e.target.value);
//       setFormErrors((prev) => ({ ...prev, title: undefined })); // clear error on change
//     }}
//     className="w-full border rounded-md px-3 py-2 text-sm"
//   />
//   {formErrors.title && (
//     <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
//   )}
// </div>

// {/* Description */}
// <div>
//   <label className="block text-sm font-medium mb-1">Description</label>
//   <textarea
//     value={description}
//     onChange={(e) => {
//       setDescription(e.target.value);
//       setFormErrors((prev) => ({ ...prev, description: undefined }));
//     }}
//     className="w-full border rounded-md px-3 py-2 text-sm"
//   />
//   {formErrors.description && (
//     <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
//   )}
// </div>

// {/* Due Date */}
// <div>
//   <label className="block text-sm font-medium mb-1">Due Date</label>
//   <input
//     type="date"
//     value={dueDate}
//     onChange={(e) => {
//       setDueDate(e.target.value);
//       setFormErrors((prev) => ({ ...prev, dueDate: undefined }));
//     }}
//     className="w-full border rounded-md px-3 py-2 text-sm"
//   />
//   {formErrors.dueDate && (
//     <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>
//   )}
// </div>

// {/* Assign To */}
// <div>
//   <label className="block text-sm font-medium mb-1">Assign To</label>
//   <select
//     value={assignTo}
//     onChange={(e) => {
//       setAssignTo(e.target.value);
//       setFormErrors((prev) => ({ ...prev, assignTo: undefined }));
//     }}
//     className="w-full border rounded-md px-3 py-2 text-sm"
//   >
//     <option value="">Select Employee</option>
//     {employees.map((emp) => (
//       <option key={emp._id} value={emp._id}>
//         {emp.firstName} {emp.lastName} ({emp.email})
//       </option>
//     ))}
//   </select>
//   {formErrors.assignTo && (
//     <p className="text-red-500 text-sm mt-1">{formErrors.assignTo}</p>
//   )}
// </div>


//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     setEditTask(null);
//                   }}
//                   className="px-4 py-2 rounded-lg border hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   {editTask ? "Update Task" : "Create Task"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="p-4 sm:p-6 border rounded-lg shadow-sm bg-white">
//         <h2 className="text-lg sm:text-xl font-bold mb-4">All Tasks</h2>

//         {loading ? (
//           <p className="text-gray-500">Loading tasks...</p>
//         ) : tasks.length === 0 ? (
//           <p>No tasks found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-gray-100 text-gray-600">
//                   <th className="p-3">Title</th>
//                   <th className="p-3">Priority</th>
//                   <th className="p-3">Due Date</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Assigned To</th>
//                   <th className="p-3">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {tasks.map((task) => (
//                   <tr key={task._id} className="border-b hover:bg-gray-50">
//                     <td className="p-3">{task.title}</td>

//                     <td
//                       className={`p-3 font-medium ${
//                         task.priority === "LOW"
//                           ? "text-green-600"
//                           : task.priority === "MEDIUM"
//                           ? "text-yellow-600"
//                           : task.priority === "HIGH"
//                           ? "text-orange-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {task.priority}
//                     </td>

//                     <td className="p-3">
//                       {task.dueDate ? task.dueDate.split("T")[0] : "No date"}
//                     </td>

//                     <td className="p-3">
//                       <select
//                         value={task.status}
//                         onChange={(e) =>
//                           handleStatusChange(task._id, e.target.value as Task["status"])
//                         }
//                         className="border rounded-md px-2 py-1"
//                       >
//                         <option value="PENDING">PENDING</option>
//                         <option value="IN_PROGRESS">IN_PROGRESS</option>
//                         <option value="DONE">DONE</option>
//                         <option value="COMPLETED">COMPLETED</option>
//                         <option value="BLOCKED">BLOCKED</option>
//                         <option value="DELAYED">DELAYED</option>
//                       </select>
//                     </td>

//                     <td className="p-3">
//                       {task.assignTo
//                         ? `${task.assignTo.firstName} ${task.assignTo.lastName} (${task.assignTo.email})`
//                         : "Unassigned"}
//                     </td>

//                     <td className="p-3 flex gap-2">
//                       <button
//                         onClick={() => handleEdit(task)}
//                         className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
//                       >
//                         <Edit3 size={14} /> Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(task._id)}
//                         className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
//                       >
//                         <Trash2 size={14} /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Previous
//         </button>

//         <span className="text-sm">
//           Page {page} of {totalPages}
//         </span>

//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-4 py-2 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskManagement;
import { useEffect, useState, useContext, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import { Plus, Trash2, Edit3, ClipboardList, Search, X, ChevronLeft, ChevronRight, AlertCircle, Clock, User, Flag } from "lucide-react";
import toast from "react-hot-toast";
import { debounce } from "../../util/debounce";
import { useMemo } from "react";

// -------------------------------------
// Interfaces
// -------------------------------------
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE" | "COMPLETED" | "BLOCKED" | "DELAYED";
  assignTo?: Employee | null;
}

interface UserInfo {
  id: string;
  email: string;
  role: string;
}

interface TaskFormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  assignTo?: string;
}

// -------------------------------------
// Design Tokens
// -------------------------------------
const priorityConfig = {
  LOW:      { label: "Low",      bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  MEDIUM:   { label: "Medium",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   },
  HIGH:     { label: "High",     bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-500"  },
  CRITICAL: { label: "Critical", bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500"     },
};

const statusConfig = {
  PENDING:     { label: "Pending",     bg: "bg-slate-100",   text: "text-slate-600"   },
  IN_PROGRESS: { label: "In Progress", bg: "bg-blue-100",    text: "text-blue-700"    },
  DONE:        { label: "Done",        bg: "bg-teal-100",    text: "text-teal-700"    },
  COMPLETED:   { label: "Completed",   bg: "bg-emerald-100", text: "text-emerald-700" },
  BLOCKED:     { label: "Blocked",     bg: "bg-red-100",     text: "text-red-700"     },
  DELAYED:     { label: "Delayed",     bg: "bg-orange-100",  text: "text-orange-700"  },
};

// -------------------------------------
// Component
// -------------------------------------
const TaskManagement = () => {
  const { user } = useContext(UserInfoContext) as { user: UserInfo };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterAssignTo, setFilterAssignTo] = useState<string>("");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<Task["priority"]>("LOW");
  const [dueDate, setDueDate] = useState<string>("");
  const [assignTo, setAssignTo] = useState<string>("");
  const [formErrors, setFormErrors] = useState<TaskFormErrors>({});

  // -------------------------------------
  // ALL ORIGINAL LOGIC — UNTOUCHED
  // -------------------------------------
  const fetchTasks = async (currentPage = page) => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit };
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (filterAssignTo) params.assignTo = filterAssignTo;
      const res = await axios.get("/api/task/allTasks", { params });
      setTasks(res.data.data.tasks);
      setTotalPages(res.data.data.totalPages);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/employee/");
      console.log("they response is employee",res)
      setEmployees(res.data.data?.employees || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const debouncedAssignToChange = useMemo(
    () => debounce((value: string) => { setFilterAssignTo(value); setPage(1); }, 800),
    []
  );

  useEffect(() => { fetchTasks(page); }, [page, filterStatus, filterPriority, filterAssignTo]);
  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editTask) {
        await axios.put(`/api/task/${editTask._id}`, { title, description, priority, dueDate, assignTo });
        toast.success("Task updated!");
      } else {
        await axios.post("/api/task/createTasks", { title, description, priority, dueDate, assignTo, createdBy: user.id });
        toast.success("Task created!");
      }
      setTitle(""); setDescription(""); setPriority("LOW"); setDueDate(""); setAssignTo("");
      setEditTask(null); setShowForm(false);
      fetchTasks(1); setPage(1);
    } catch (error: any) {
      const data = error?.response?.data?.message;
      const newErrors: TaskFormErrors = {};
      if (data?.errors?.length) {
        data.errors.forEach((e: any) => { if (e.field) newErrors[e.field as keyof TaskFormErrors] = e.message; });
      } else {
        toast.error(error?.response?.data?.message);
      }
      setFormErrors(newErrors);
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task); setTitle(task.title); setDescription(task.description);
    setPriority(task.priority); setDueDate(task.dueDate?.split("T")[0] || "");
    setAssignTo(task.assignTo?._id || ""); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/api/task/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
      fetchTasks(page);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      await axios.put(`/api/task/${taskId}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      toast.success("Status updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating status");
    }
  };

  // -------------------------------------
  // JSX — ENTERPRISE REDESIGN
  // -------------------------------------
  return (
    <div className="min-h-screen bg-[#f4f6f9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .scale-in { animation: scaleIn 0.2s ease-out both; }
        .row-hover:hover { background: #f8faff; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 fade-up">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Workspace</p>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Task Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {tasks.length > 0 ? `${tasks.length} task${tasks.length !== 1 ? "s" : ""} on this page` : "No tasks found"}
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditTask(null); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/20 whitespace-nowrap"
          >
            <Plus size={16} /> Create Task
          </button>
        </div>

        {/* ── Filters Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 fade-up" style={{ animationDelay: "60ms" }}>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status */}
            <div className="flex items-center gap-2 min-w-[160px]">
              <Flag size={13} className="text-slate-400 flex-shrink-0" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2 min-w-[150px]">
              <AlertCircle size={13} className="text-slate-400 flex-shrink-0" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="flex-1 text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Employee search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by employee name..."
                onChange={(e) => debouncedAssignToChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
              />
            </div>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden fade-up" style={{ animationDelay: "120ms" }}>
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <ClipboardList size={15} className="text-white" />
            </div>
            <h2 className="font-semibold text-slate-800 text-base">All Tasks</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center animate-pulse">
                <ClipboardList size={18} className="text-white" />
              </div>
              <p className="text-slate-400 text-sm">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <ClipboardList size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-600 font-medium">No tasks found</p>
              <p className="text-slate-400 text-sm">Adjust your filters or create a new task</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Title", "Priority", "Due Date", "Status", "Assigned To", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tasks.map((task, i) => {
                    const p = priorityConfig[task.priority];
                    const s = statusConfig[task.status];
                    return (
                      <tr
                        key={task._id}
                        className="row-hover transition-colors"
                        style={{ animation: `fadeUp 0.3s ease both`, animationDelay: `${i * 40}ms` }}
                      >
                        {/* Title */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800 leading-snug">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">{task.description}</p>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${p.bg} ${p.text} ${p.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                            {p.label}
                          </span>
                        </td>

                        {/* Due Date */}
                        <td className="px-5 py-4">
                          {task.dueDate ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-600 text-xs">
                              <Clock size={12} className="text-slate-400" />
                              {task.dueDate.split("T")[0]}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value as Task["status"])}
                            className={`text-xs font-semibold rounded-lg border-0 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer ${s.bg} ${s.text}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="BLOCKED">Blocked</option>
                            <option value="DELAYED">Delayed</option>
                          </select>
                        </td>

                        {/* Assigned To */}
                        <td className="px-5 py-4">
                          {task.assignTo ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                                {task.assignTo.firstName.charAt(0)}{task.assignTo.lastName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-slate-700 font-medium text-xs leading-snug truncate">
                                  {task.assignTo.firstName} {task.assignTo.lastName}
                                </p>
                                <p className="text-slate-400 text-xs truncate">{task.assignTo.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                              <User size={11} /> Unassigned
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                            >
                              <Edit3 size={11} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 fade-up" style={{ animationDelay: "180ms" }}>
            <p className="text-sm text-slate-400">
              Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Form ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditTask(null); }} />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden scale-in">
            {/* Modal Header */}
            <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                  <ClipboardList size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base">{editTask ? "Edit Task" : "New Task"}</h2>
                  <p className="text-slate-400 text-xs">{editTask ? "Update task details" : "Add a new task to the board"}</p>
                </div>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditTask(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setFormErrors((p) => ({ ...p, title: undefined })); }}
                  placeholder="e.g. Design landing page"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-300 outline-none transition focus:ring-2 focus:ring-slate-900/15 ${
                    formErrors.title ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400"
                  }`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1.5">⚠ {formErrors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setFormErrors((p) => ({ ...p, description: undefined })); }}
                  rows={3}
                  placeholder="Describe the task..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-300 outline-none resize-none transition focus:ring-2 focus:ring-slate-900/15 ${
                    formErrors.description ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400"
                  }`}
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1.5">⚠ {formErrors.description}</p>}
              </div>

              {/* Priority + Due Date row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task["priority"])}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-900/15 focus:bg-white focus:border-slate-400 transition"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => { setDueDate(e.target.value); setFormErrors((p) => ({ ...p, dueDate: undefined })); }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-slate-900/15 ${
                      formErrors.dueDate ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400"
                    }`}
                  />
                  {formErrors.dueDate && <p className="text-red-500 text-xs mt-1.5">⚠ {formErrors.dueDate}</p>}
                </div>
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Assign To <span className="text-red-400">*</span>
                </label>
                <select
                  value={assignTo}
                  onChange={(e) => { setAssignTo(e.target.value); setFormErrors((p) => ({ ...p, assignTo: undefined })); }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-slate-900/15 ${
                    formErrors.assignTo ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400"
                  }`}
                >
                  <option value="">— Select Employee —</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} ({emp.email})
                    </option>
                  ))}
                </select>
                {formErrors.assignTo && <p className="text-red-500 text-xs mt-1.5">⚠ {formErrors.assignTo}</p>}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditTask(null); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition flex items-center justify-center gap-2"
              >
                {editTask ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
