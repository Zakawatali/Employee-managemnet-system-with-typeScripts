
import { useEffect, useState, useContext, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import { Plus, Trash2, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

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
  dueDate: string;
  status: "Pending" | "IN_PROGRESS" | "DONE" | "COMPLETED" | "BLOCKED" | "DELAYED";
  assignTo: string | Employee; // sometimes backend sends ID, sometimes Object
}

interface UserInfo {
  id: string;
  email: string;
  role: string;
}

// -------------------------------------
// Component
// -------------------------------------
const TaskManagement = () => {
  const { user } = useContext(UserInfoContext) as { user: UserInfo };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1);
const [limit] = useState<number>(5); // per page tasks
const [totalPages, setTotalPages] = useState<number>(1);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Form fields
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<Task["priority"]>("LOW");
  const [dueDate, setDueDate] = useState<string>("");
  const [assignTo, setAssignTo] = useState<string>("");

  // -------------------------------------
  // Fetch tasks
  // -------------------------------------
  const fetchTasks = async (currentPage = page) => {
    try {
      setLoading(true);
  
      const res = await axios.get(
        `/api/task/allTasks?page=${currentPage}&limit=${limit}`
      );
  
      setTasks(res.data.data.tasks);
      setTotalPages(res.data.data.totalPages);
  
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  // -------------------------------------
  // Fetch employees
  // -------------------------------------
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/employee/");
      setEmployees(res.data.data?.employees || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  

  // -------------------------------------
  // Create / Update task
  // -------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !description || !priority || !dueDate || !assignTo) {
      alert("All fields are required!");
      return;
    }

    try {
      if (editTask) {
        // UPDATE
        await axios.put(`/api/task/${editTask._id}`, {
          title,
          description,
          priority,
          dueDate,
          assignTo,
        });
        toast.success("Task updated!");
      } else {
        // CREATE
        await axios.post("/api/task/createTasks", {
          title,
          description,
          priority,
          dueDate,
          assignTo,
          createdBy: user.id,
        });
        toast.success("Task created!");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("LOW");
      setDueDate("");
      setAssignTo("");
      setEditTask(null);
      setShowForm(false);

      fetchTasks();
      setPage(1);
      fetchTasks(1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
 


  // -------------------------------------
  // Edit Task
  // -------------------------------------
  const handleEdit = (task: Task) => {
    setEditTask(task);

    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate.split("T")[0]);
    setAssignTo(typeof task.assignTo === "string" ? task.assignTo : task.assignTo._id);

    setShowForm(true);
  };

  // -------------------------------------
  // Delete Task
  // -------------------------------------
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`/api/task/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
      setPage(1);
      fetchTasks(1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
 
  
  // -------------------------------------
  // Update status
  // -------------------------------------
  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      await axios.put(`/api/task/${taskId}`, { status: newStatus });

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      toast.success("Status updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating status");
    }
  };

  // -------------------------------------
  // JSX
  // -------------------------------------
  return (
    <div className="p-4 sm:p-6 font-sans text-gray-800">
      {/* Create Task Button */}
      <div className="flex sm:flex-row justify-end sm:items-center mb-6 gap-3">
        <button
          onClick={() => {
            setShowForm(true);
            setEditTask(null);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={18} /> Create Task
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {editTask ? "Edit Task" : "Create Task"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                ></textarea>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task["priority"])}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              {/* Date + Assign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assign To (Employee)
                  </label>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditTask(null);
                  }}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="p-4 sm:p-6 border rounded-lg shadow-sm bg-white">
        <h2 className="text-lg sm:text-xl font-bold mb-4">All Tasks</h2>

        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="p-3">Title</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned To</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => {
                  const assignToId =
                    typeof task.assignTo === "string"
                      ? task.assignTo
                      : task.assignTo?._id;

                  const emp = employees.find((e) => e._id === assignToId);

                  return (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{task.title}</td>

                      <td
                        className={`p-3 font-medium ${
                          task.priority === "LOW"
                            ? "text-green-600"
                            : task.priority === "MEDIUM"
                            ? "text-yellow-600"
                            : task.priority === "HIGH"
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {task.priority}
                      </td>

                      <td className="p-3">
                        {task.dueDate ? task.dueDate.split("T")[0] : "No date"}
                      </td>

                      <td className="p-3">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value as Task["status"])
                          }
                          className="border rounded-md px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="DONE">DONE</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="BLOCKED">BLOCKED</option>
                          <option value="DELAYED">DELAYED</option>
                        </select>
                      </td>

                      <td className="p-3">
                        {emp
                          ? `${emp.firstName} ${emp.lastName} (${emp.email})`
                          : "Unassigned"}
                      </td>

                      <td className="p-3 flex gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(task)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className="px-4 py-2 border rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-sm">
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
    className="px-4 py-2 border rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

    </div>
  );
};

export default TaskManagement;
