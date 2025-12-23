
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
  const [page, setPage] = useState<number>(1);           // current page
const [totalPages, setTotalPages] = useState<number>(1); // total pages from API
const limit = 4; // items per page

  // ✅ Fetch tasks for logged-in employee
  // const fetchTasks = async () => {
  //   if (!user?._id) return;
  //   console.log("the api context user is ", user);
  //   try {
  //     setLoading(true);
  //     const res = await axios.get<{ data: Task[] }>(`/api/task/${user._id}`);
  //     setTasks(res.data?.data || []);
  //   } catch (err: any) {
  //     console.error("Error fetching tasks:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchTasks = async (currentPage = page) => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get<{ data: { tasks: Task[]; page: number; totalPages: number } }>(
        `/api/task/${user._id}?page=${currentPage}&limit=${limit}`
      );
      
  
      const data = res.data.data;
      setTasks(data.tasks);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks(page);
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
        <div className="flex justify-between items-center  gap-4 mt-4">
  <button
    disabled={page === 1}
    onClick={() => fetchTasks(page - 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => fetchTasks(page + 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>
  
  );
};

export default Tasks;
