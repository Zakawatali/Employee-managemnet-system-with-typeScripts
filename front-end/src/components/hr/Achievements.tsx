
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Edit, Trash, Award, Loader2 } from "lucide-react";
import Sidebar from "../sideBar";

// 🔹 TypeScript interfaces
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface Achievement {
  _id: string;
  title: string;
  body: string;
  user?: Employee;
}

interface FormData {
  title: string;
  body: string;
  user: string;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState<FormData>({ title: "", body: "", user: "" });
  const [page, setPage] = useState<number>(1);
const [limit] = useState<number>(3);
const [totalPages, setTotalPages] = useState<number>(1);
const [search, setSearch] = useState<string>("");



  const fetchAll = async (currentPage = page) => {
    try {
      setLoading(true);
      const [achRes, empRes] = await Promise.all([
        axios.get(`/api/achievements`, {
          params: {
            page: currentPage,
            limit,
            search,
          },
        }),
        axios.get("/api/employee/"),
      ]);

      const achievementsData: Achievement[] =
        achRes.data?.data?.achievements ||
        achRes.data?.achievements ||
        achRes.data?.data ||
        [];

      const employeesData: Employee[] =
        empRes.data?.data?.employees ||
        empRes.data?.employees ||
        empRes.data?.data ||
        [];

      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setTotalPages(achRes.data?.data?.totalPages || 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchAll(1);
    }, 800); // 500ms delay
  
    return () => clearTimeout(delay);
  }, [search]);
  
  useEffect(() => {
    fetchAll(page);
  }, [page]);
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Please enter an achievement title.");
    if (!formData.body.trim()) return toast.error("Please enter an achievement description.");
    if (!formData.user) return toast.error("Please select an employee to assign this achievement.");

    try {
      setSubmitting(true);

      if (editing) {
        const res = await axios.put(`/api/achievements/${editing._id}`, formData);
        toast.success(res.data?.message || "Achievement updated successfully");
      } else {
        const res = await axios.post("/api/achievements", formData);
        toast.success(res.data?.message || "Achievement created successfully");
      }

      setFormData({ title: "", body: "", user: "" });
      setEditing(null);
      setShowForm(false);
      await fetchAll();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const res = await axios.delete(`/api/achievements/${id}`);
      toast.success(res.data?.message || "Achievement deleted successfully");
      await fetchAll();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to delete achievement");
    }
  };

  const handleEdit = (ach: Achievement) => {
    setEditing(ach);
    setFormData({
      title: ach.title || "",
      body: ach.body || "",
      user: ach.user?._id || "",
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ title: "", body: "", user: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading achievements & employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="flex-1 p-4 mt-12 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-indigo-600" size={28} /> Achievements
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setFormData({ title: "", body: "", user: "" });
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={employees.length === 0}
            title={employees.length === 0 ? "No employees available to assign" : "Create Achievement"}
          >
            <Plus size={18} /> New Achievement
          </button>
        </div>
        
        <div className="flex gap-2 mb-4">
  <input
    type="text"
    placeholder="Search by title or employee name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
  />
</div>

        {employees.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-800 text-sm">
              📊 {employees.length} employee{employees.length !== 1 ? 's' : ''} available
            </p>
          </div>
        )}

        {employees.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ No employees found. Please add employees first before creating achievements.
            </p>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={handleCloseForm}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                disabled={submitting}
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editing ? "Update Achievement" : "Create New Achievement"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievement Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Employee of the Month"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="body"
                    placeholder="Describe the achievement and why it was earned..."
                    value={formData.body}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    rows={4}
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To Employee *
                  </label>
                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                    disabled={submitting}
                  >
                    <option value="">-- Select an employee --</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} {emp.email ? `(${emp.email})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {editing ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editing ? "Update Achievement" : "Create Achievement"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-400 transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {achievements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Achievements Yet</h3>
            <p className="text-gray-500 mb-6">
              Start recognizing your team's accomplishments by creating achievements.
            </p>
            {employees.length > 0 && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditing(null);
                  setFormData({ title: "", body: "", user: "" });
                }}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
              >
                <Plus size={18} /> Create First Achievement
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((ach) => (
              <div
                key={ach._id}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 flex-1">
                    <Award className="text-yellow-500 flex-shrink-0" size={20} /> 
                    <span className="line-clamp-2">{ach.title}</span>
                  </h2>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {ach.body}
                </p>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Awarded To:</p>
                  <p className="text-sm font-medium text-gray-800">
                    👤 {ach.user?.firstName || 'N/A'} {ach.user?.lastName || ''}
                  </p>
                  {ach.user?.email && (
                    <p className="text-xs text-gray-500 mt-1">{ach.user.email}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(ach)}
                    className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                  >
                    <Edit size={14} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(ach._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                  >
                    <Trash size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
  <div className="flex justify-center gap-2 mt-10">
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => setPage(i + 1)}
        className={`px-4 py-2 border rounded ${
          page === i + 1
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      </div>
    </div>
  );
}
