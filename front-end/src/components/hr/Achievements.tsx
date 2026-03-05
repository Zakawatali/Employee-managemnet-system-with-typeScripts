
// import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import axios from "../../util/axiosInstance";
// import toast, { Toaster } from "react-hot-toast";
// import { Plus, Edit, Trash, Award, Loader2 } from "lucide-react";
// import Sidebar from "../sideBar";

// // 🔹 TypeScript interfaces
// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email?: string;
// }

// interface Achievement {
//   _id: string;
//   title: string;
//   body: string;
//   user?: Employee;
// }

// interface FormData {
//   title: string;
//   body: string;
//   user: string;
// }
// interface FormErrors {
//   title?: string;
//   body?: string;
//   user?: string;
// }



// export default function Achievements() {
//   const [achievements, setAchievements] = useState<Achievement[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const [editing, setEditing] = useState<Achievement | null>(null);
//   const [formData, setFormData] = useState<FormData>({ title: "", body: "", user: "" });
//   const [page, setPage] = useState<number>(1);
// const [limit] = useState<number>(3);
// const [totalPages, setTotalPages] = useState<number>(1);
// const [search, setSearch] = useState<string>("");
// const [errors, setErrors] = useState<FormErrors>({});



//   const fetchAll = async (currentPage = page) => {
//     try {
//       setLoading(true);
//       const [achRes, empRes] = await Promise.all([
//         axios.get(`/api/achievements`, {
//           params: {
//             page: currentPage,
//             limit,
//             search,
//           },
//         }),
//         axios.get("/api/employee/"),
//       ]);

//       const achievementsData: Achievement[] =
//         achRes.data?.data?.achievements ||
//         achRes.data?.achievements ||
//         achRes.data?.data ||
//         [];

//       const employeesData: Employee[] =
//         empRes.data?.data?.employees ||
//         empRes.data?.employees ||
//         empRes.data?.data ||
//         [];

//       setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
//       setEmployees(Array.isArray(employeesData) ? employeesData : []);
//       setTotalPages(achRes.data?.data?.totalPages || 1);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || error.message || "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchAll(1);
//     }, 800); // 500ms delay
  
//     return () => clearTimeout(delay);
//   }, [search]);
  
//   useEffect(() => {
//     fetchAll(page);
//   }, [page]);
  

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//      // 🔥 clear error of this field
//   setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

   

//     try {
//       setSubmitting(true);

//       if (editing) {
//         const res = await axios.put(`/api/achievements/${editing._id}`, formData);
//         toast.success(res.data?.message || "Achievement updated successfully");
//       } else {
//         const res = await axios.post("/api/achievements", formData);
//         toast.success(res.data?.message || "Achievement created successfully");
//       }

//       setFormData({ title: "", body: "", user: "" });
//       setErrors({});
//       setEditing(null);
//       setShowForm(false);
//       await fetchAll();
//     } catch (error: any) {
//       const apiError = error?.response?.data?.message;

//   if (apiError?.errors && Array.isArray(apiError.errors)) {
//     const newErrors: FormErrors = {};

//     apiError.errors.forEach((e: any) => {
//       if (e.field) {
//         newErrors[e.field as keyof FormErrors] = e.message;
//       }
//     });
//     setErrors(newErrors);
    
//   } else {
//     toast.error(error?.response?.data?.message || error.message || "Operation failed");
//   }
  
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this achievement?")) return;

//     try {
//       const res = await axios.delete(`/api/achievements/${id}`);
//       toast.success(res.data?.message || "Achievement deleted successfully");
//       await fetchAll();
      
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || error.message || "Failed to delete achievement");
//     }
//   };

//   const handleEdit = (ach: Achievement) => {
//     setEditing(ach);
//     setFormData({
//       title: ach.title || "",
//       body: ach.body || "",
//       user: ach.user?._id || "",
//     });
//     setShowForm(true);
//   };

//   const handleCloseForm = () => {
//     setShowForm(false);
//     setEditing(null);
//     setFormData({ title: "", body: "", user: "" });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading achievements & employees...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
//       <Toaster position="top-right" reverseOrder={false} />
      
//       <div className="flex-1 p-4 mt-12 md:p-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Award className="text-indigo-600" size={28} /> Achievements
//           </h1>
//           <button
//             onClick={() => {
//               setShowForm(true);
//               setEditing(null);
//               setFormData({ title: "", body: "", user: "" });
//             }}
//             className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={employees.length === 0}
//             title={employees.length === 0 ? "No employees available to assign" : "Create Achievement"}
//           >
//             <Plus size={18} /> New Achievement
//           </button>
//         </div>
        
//                     <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 placeholder="Search by title or employee name..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//               />
//             </div>

//         {employees.length > 0 && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
//             <p className="text-blue-800 text-sm">
//               📊 {employees.length} employee{employees.length !== 1 ? 's' : ''} available
//             </p>
//           </div>
//         )}

//         {employees.length === 0 && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//             <p className="text-yellow-800 text-sm">
//               ⚠️ No employees found. Please add employees first before creating achievements.
//             </p>
//           </div>
//         )}

//         {showForm && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//             <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
//               <button
//                 onClick={handleCloseForm}
//                 className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
//                 disabled={submitting}
//               >
//                 ×
//               </button>

//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 {editing ? "Update Achievement" : "Create New Achievement"}
//               </h2>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Achievement Title *
//                   </label>
//                   <input
//                          type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleChange}
//                           className={`w-full border px-4 py-2 rounded-lg ${
//                             errors.title ? "border-red-500" : "border-gray-300"
//                           }`}
//                             />
//                              {errors.title && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.title}</p>
//                               )}

//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description *
//                   </label>
//                   <textarea
//                           name="body"
//                           value={formData.body}
//                           onChange={handleChange}
//                           className={`w-full border px-4 py-2 rounded-lg ${
//                             errors.body ? "border-red-500" : "border-gray-300"
//                           }`}
//                         />

//                         {errors.body && (
//                           <p className="text-red-500 text-xs mt-1">{errors.body}</p>
//                         )}

//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Assign To Employee *
//                   </label>
//                   <select
//                     name="user"
//                     value={formData.user}
//                          onChange={handleChange}
//                          className={`w-full border px-4 py-2 rounded-lg ${
//                             errors.user ? "border-red-500" : "border-gray-300"
//                                              }`}
// >                                {errors.user && (
//                       <p className="text-red-500 text-xs mt-1">{errors.user}</p>
//                                  )}


//                     <option value="">-- Select an employee --</option>
//                     {employees.map((emp) => (
//                       <option key={emp._id} value={emp._id}>
//                         {emp.firstName} {emp.lastName} {emp.email ? `(${emp.email})` : ''}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.user && (
//                     <p className="text-red-500 text-xs mt-1">{errors.user}</p>
//                      )}
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="submit"
//                     className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={submitting}
//                   >
//                     {submitting ? (
//                       <>
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                         {editing ? "Updating..." : "Creating..."}
//                       </>
//                     ) : (
//                       editing ? "Update Achievement" : "Create Achievement"
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleCloseForm}
//                     className="flex-1 bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-400 transition"
//                     disabled={submitting}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {achievements.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Achievements Yet</h3>
//             <p className="text-gray-500 mb-6">
//               Start recognizing your team's accomplishments by creating achievements.
//             </p>
//             {employees.length > 0 && (
//               <button
//                 onClick={() => {
//                   setShowForm(true);
//                   setEditing(null);
//                   setFormData({ title: "", body: "", user: "" });
//                 }}
//                 className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
//               >
//                 <Plus size={18} /> Create First Achievement
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {achievements.map((ach) => (
//               <div
//                 key={ach._id}
//                 className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow border border-gray-100"
//               >
//                 <div className="flex items-start justify-between mb-3">
//                   <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 flex-1">
//                     <Award className="text-yellow-500 flex-shrink-0" size={20} /> 
//                     <span className="line-clamp-2">{ach.title}</span>
//                   </h2>
//                 </div>

//                 <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
//                   {ach.body}
//                 </p>

//                 <div className="bg-gray-50 rounded-lg p-3 mb-4">
//                   <p className="text-xs text-gray-500 mb-1">Awarded To:</p>
//                   <p className="text-sm font-medium text-gray-800">
//                     👤 {ach.user?.firstName || 'N/A'} {ach.user?.lastName || ''}
//                   </p>
//                   {ach.user?.email && (
//                     <p className="text-xs text-gray-500 mt-1">{ach.user.email}</p>
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleEdit(ach)}
//                     className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
//                   >
//                     <Edit size={14} /> Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(ach._id)}
//                     className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
//                   >
//                     <Trash size={14} /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         {totalPages > 1 && (
//   <div className="flex justify-center gap-2 mt-10">
//     <button
//       disabled={page === 1}
//       onClick={() => setPage(page - 1)}
//       className="px-4 py-2 border rounded disabled:opacity-50"
//     >
//       Prev
//     </button>

//     {Array.from({ length: totalPages }).map((_, i) => (
//       <button
//         key={i}
//         onClick={() => setPage(i + 1)}
//         className={`px-4 py-2 border rounded ${
//           page === i + 1
//             ? "bg-indigo-600 text-white"
//             : "bg-white"
//         }`}
//       >
//         {i + 1}
//       </button>
//     ))}

//     <button
//       disabled={page === totalPages}
//       onClick={() => setPage(page + 1)}
//       className="px-4 py-2 border rounded disabled:opacity-50"
//     >
//       Next
//     </button>
//   </div>
// )}

//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useCallback, useRef, ChangeEvent, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Edit, Trash, Award, Loader2, Search, Trophy, Star, Calendar, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
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
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  title: string;
  body: string;
  user: string;
}

interface FormErrors {
  title?: string;
  body?: string;
  user?: string;
}

interface AchievementsResponse {
  success: boolean;
  data: {
    achievements: Achievement[];
    total: number;
    totalPages: number;
    page: number;
  };
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
const formatDate = (iso?: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const getInitials = (first?: string, last?: string) =>
  `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`.toUpperCase();

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-700",
];

const getAvatarColor = (name: string) => {
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
};

// ─────────────────────────────────────────
// ACHIEVEMENT CARD
// ─────────────────────────────────────────
const AchievementCard: React.FC<{
  achievement: Achievement;
  index: number;
  onEdit: (a: Achievement) => void;
  onDelete: (id: string) => void;
}> = ({ achievement, index, onEdit, onDelete }) => {
  const { user, title, body, createdAt } = achievement;
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const color = getAvatarColor(user?.firstName ?? "A");

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 60}ms`, animation: "fadeSlideUp 0.4s ease both" }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
            <Trophy size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-slate-900 transition-colors">
              {title}
            </h3>
            {createdAt && (
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(createdAt)}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-5">{body}</p>

        {user && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-5">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{fullName}</p>
              {user.email && <p className="text-xs text-slate-400 truncate">{user.email}</p>}
            </div>
            <div className="ml-auto">
              <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium flex items-center gap-1">
                <Star size={9} fill="currentColor" /> Awarded
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(achievement)}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Edit size={13} /> Edit
          </button>
          <button
            onClick={() => onDelete(achievement._id)}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all"
          >
            <Trash size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// FORM MODAL
// ─────────────────────────────────────────
const AchievementFormModal: React.FC<{
  editing: Achievement | null;
  formData: FormData;
  errors: FormErrors;
  submitting: boolean;
  employees: Employee[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}> = ({ editing, formData, errors, submitting, employees, onChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

    <div
      className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style={{ animation: "scaleIn 0.2s ease-out" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
            <Sparkles size={18} className="text-slate-900" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">
              {editing ? "Edit Achievement" : "New Achievement"}
            </h2>
            <p className="text-slate-400 text-xs">
              {editing ? "Update the details below" : "Recognize outstanding work"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Achievement Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="e.g. Best Performance Q1 2026"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-300 outline-none transition focus:ring-2 focus:ring-slate-900/20 ${
              errors.title ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400"
            }`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={onChange}
            rows={4}
            placeholder="Describe what was accomplished..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-300 outline-none resize-none transition focus:ring-2 focus:ring-slate-900/20 ${
              errors.body ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400"
            }`}
          />
          {errors.body && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.body}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Assign To <span className="text-red-400">*</span>
          </label>
          <select
            name="user"
            value={formData.user}
            onChange={onChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-slate-900/20 ${
              errors.user ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400"
            }`}
          >
            <option value="">— Select an employee —</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}{emp.email ? ` · ${emp.email}` : ""}
              </option>
            ))}
          </select>
          {errors.user && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.user}</p>}
          {employees.length === 0 && (
            <p className="text-amber-600 text-xs mt-1.5 flex items-center gap-1">
              <Loader2 size={11} className="animate-spin" /> Loading employees...
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit as any}
          disabled={submitting}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <><Loader2 size={15} className="animate-spin" />{editing ? "Saving..." : "Creating..."}</>
          ) : (
            editing ? "Save Changes" : "Create Achievement"
          )}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  // ✅ Separate employees state — fetched once on mount from /api/employee
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState<FormData>({ title: "", body: "", user: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const LIMIT = 3;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ Fetch ALL employees once on mount only — never re-fetched
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employee/", {
          params: { limit: 1000 }, // get all employees for the dropdown
        });
        const data =
          res.data?.data?.employees ||
          res.data?.employees ||
          res.data?.data ||
          [];
        setEmployees(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, []); // ← empty deps: runs once only, completely independent

  // ✅ Fetch achievements — paginated + searchable
  const fetchAchievements = useCallback(async (currentPage: number, currentSearch: string) => {
    try {
      setLoading(true);
      const res = await axios.get<AchievementsResponse>("/api/achievements", {
        params: { page: currentPage, limit: LIMIT, search: currentSearch },
      });
      const data = res.data?.data;
      setAchievements(data?.achievements ?? []);
      setTotalPages(data?.totalPages ?? 1);
      setTotal(data?.total ?? 0);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Single debounced effect — one API call per change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAchievements(page, search);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [page, search]);

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editing) {
        const res = await axios.put(`/api/achievements/${editing._id}`, formData);
        toast.success(res.data?.message || "Achievement updated");
      } else {
        const res = await axios.post("/api/achievements", formData);
        toast.success(res.data?.message || "Achievement created");
      }
      setFormData({ title: "", body: "", user: "" });
      setErrors({});
      setEditing(null);
      setShowForm(false);
      fetchAchievements(page, search);
    } catch (error: any) {
      const apiError = error?.response?.data?.message;
      if (apiError?.errors && Array.isArray(apiError.errors)) {
        const newErrors: FormErrors = {};
        apiError.errors.forEach((e: any) => {
          if (e.field) newErrors[e.field as keyof FormErrors] = e.message;
        });
        setErrors(newErrors);
      } else {
        toast.error(error?.response?.data?.message || error.message || "Operation failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this achievement? This action cannot be undone.")) return;
    try {
      const res = await axios.delete(`/api/achievements/${id}`);
      toast.success(res.data?.message || "Achievement deleted");
      fetchAchievements(page, search);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to delete");
    }
  };

  const handleEdit = (ach: Achievement) => {
    setEditing(ach);
    setFormData({ title: ach.title, body: ach.body, user: ach.user?._id ?? "" });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: "", body: "", user: "" });
    setErrors({});
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">Recognition Hub</p>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Achievements
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">
              {total > 0 ? `${total} achievement${total !== 1 ? "s" : ""} recorded` : "No achievements yet"}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
          >
            <Plus size={16} /> New Achievement
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or employee..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition shadow-sm"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">
              <Loader2 size={22} className="text-white animate-spin" />
            </div>
            <p className="text-slate-500 text-sm">Loading achievements...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Award size={28} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-slate-700 font-semibold text-lg">No achievements found</h3>
              <p className="text-slate-400 text-sm mt-1">
                {search ? "Try a different search term" : "Create your first achievement to get started"}
              </p>
            </div>
            {!search && (
              <button onClick={openCreate} className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition">
                <Plus size={15} /> Create Achievement
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((ach, i) => (
              <AchievementCard
                key={ach._id}
                achievement={ach}
                index={i}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-400">
              Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                    page === p ? "bg-slate-900 text-white shadow-md" : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <AchievementFormModal
          editing={editing}
          formData={formData}
          errors={errors}
          submitting={submitting}
          employees={employees}        // ✅ full list, always complete
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null); setErrors({}); }}
        />
      )}
    </div>
  );
}