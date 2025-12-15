// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";

// const TaskModal = ({ task, onClose, user }) => {
//   const [title, setTitle] = useState(task?.title || "");
//   const [description, setDescription] = useState(task?.description || "");
//   const [priority, setPriority] = useState(task?.priority || "MEDIUM");
//   const [dueDate, setDueDate] = useState(
//     task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
//   );
//   const [assignTo, setAssignTo] = useState(task?.assignTo?._id || "");
//   const [status, setStatus] = useState(task?.status || "PENDING");
//   const [loading, setLoading] = useState(false);
//   const [employees, setEmployees] = useState([]);

//   // ✅ Fetch employees list
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("/api/employee", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         setEmployees(res.data?.employees || []);
//       } catch (err) {
//         console.error("Error fetching employees", err);
//         toast.error("Failed to load employees");
//       }
//     };
//     fetchEmployees();
//   }, [user.token]);

//   // ✅ Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !assignTo) {
//       return toast.error("Title and Assign To are required");
//     }

//     setLoading(true);
//     try {
//       if (task) {
//         // Update task
//         await axios.put(
//           `/api/task/${task._id}`,
//           { title, description, priority, dueDate, assignTo, status },
//           { headers: { Authorization: `Bearer ${user.token}` } }
//         );
//         toast.success("Task updated successfully");
//       } else {
//         // Create task
//         await axios.post(
//           "/api/task/createTasks",
//           { title, description, priority, dueDate, assignTo },
//           { headers: { Authorization: `Bearer ${user.token}` } }
//         );
//         toast.success("Task created successfully");
//       }
//       onClose();
//     } catch (err) {
//       console.error("Error saving task", err);
//       toast.error(err?.response?.data?.message || "Failed to save task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           {task ? "Edit Task" : "Create New Task"}
//         </h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Title*
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               rows="3"
//             />
//           </div>

//           {/* Priority */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Priority
//             </label>
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//             >
//               <option value="LOW">LOW</option>
//               <option value="MEDIUM">MEDIUM</option>
//               <option value="HIGH">HIGH</option>
//               <option value="CRITICAL">CRITICAL</option>
//             </select>
//           </div>

//           {/* Due Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Due Date
//             </label>
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//             />
//           </div>

//           {/* Assign To */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Assign To*
//             </label>
//             <select
//               value={assignTo}
//               onChange={(e) => setAssignTo(e.target.value)}
//               className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               required
//             >
//               <option value="">Select Employee</option>
//               {employees.map((emp) => (
//                 <option key={emp._id} value={emp._id}>
//                   {emp.firstName} {emp.lastName} ({emp.email})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Status (only in edit mode) */}
//           {task && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Status
//               </label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//               >
//                 <option value="PENDING">PENDING</option>
//                 <option value="IN_PROGRESS">IN_PROGRESS</option>
//                 <option value="DONE">DONE</option>
//                 <option value="BLOCKED">BLOCKED</option>
//                 <option value="DELAYED">DELAYED</option>
//               </select>
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading
//               ? "Saving..."
//               : task
//               ? "Update Task"
//               : "Create Task"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaskModal;
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";

const TaskModal = ({ task, onClose, user }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "MEDIUM");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [assignTo, setAssignTo] = useState(task?.assignTo?._id || "");
  const [status, setStatus] = useState(task?.status || "PENDING");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  // ✅ Fetch employees list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employee", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEmployees(res.data?.employees || []);
      } catch (err) {
        console.error("Error fetching employees", err);
        toast.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, [user.token]);

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !assignTo) {
      return toast.error("Title and Assign To are required");
    }

    setLoading(true);
    try {
      if (task) {
        // Update task
        await axios.put(
          `/api/task/${task._id}`,
          { title, description, priority, dueDate, assignTo, status },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success("Task updated successfully");
      } else {
        // Create task
        await axios.post(
          "/api/task/createTasks",
          { title, description, priority, dueDate, assignTo },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success("Task created successfully");
      }
      onClose();
    } catch (err) {
      console.error("Error saving task", err);
      toast.error(err?.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {task ? "Edit Task" : "Create New Task"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign To*
            </label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          {/* Status (only in edit mode) */}
          {task && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="DELAYED">DELAYED</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : task
              ? "Update Task"
              : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

