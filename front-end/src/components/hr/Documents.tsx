

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import { FiUpload, FiDownload, FiTrash2, FiEye } from "react-icons/fi";
import Sidebar from "../sideBar";

// Types
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface Document {
  _id: string;
  title: string;
  kind: string;
  employee?: Employee;
  uploadedBy?: User;
  createdAt: string;
}

interface FormState {
  employee: string;
  kind: string;
  title: string;
  file: File | null;
}
interface FormErrors {
  employee?: string;
  kind?: string;
  title?: string;
}


const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [form, setForm] = useState<FormState>({
    employee: "",
    kind: "",
    title: "",
    file: null,
  });
   // Pagination
  const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Items per page
  const [search, setSearch] = useState(""); // for text search (name/kind)
  const [errors, setErrors] = useState<FormErrors>({});

  // const [typeFilter, setTypeFilter] = useState(""); // for kind dropdown filter
  
  // // Fetch all documents
  // const fetchDocuments = async (page:number=1) => {
  //   try {
  //     const res = await axios.get(`/api/documents?page=${page}&limit=${limit}`);
  //     setDocuments(res.data.data.documents || []);
  //     setTotalPages(res.data.data.totalPages || 1);
  //      setPage(res.data.data.page || 1);
  //      setTotalPages(res.data.data.totalPages || 1);

  //   } catch (error: any) {
  //     toast.error("Failed to fetch documents");
  //     console.error(error);
  //   }
  // };
  const fetchDocuments = async (p: number = 1) => {
    try {
      const res = await axios.get(
        `/api/documents?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      setDocuments(res.data.data.documents || []);
      setTotalPages(res.data.data.totalPages || 1);
      setPage(res.data.data.page || 1);
    } catch (error: any) {
      toast.error("Failed to fetch documents");
    }
  };
  
  
  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/Employee/");
      setEmployees(res.data.data?.employees || []);
    } catch (error: any) {
      toast.error("Failed to fetch employees");
      console.error(error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments(1);
    }, 800);
  
    return () => clearTimeout(timer);
  }, [search]);
  
  useEffect(() => {
    fetchDocuments();
    fetchEmployees();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "file" && files) {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setErrors({});

    const data = new FormData();
    data.append("employee", form.employee);
    data.append("kind", form.kind);
    data.append("title", form.title);
    data.append("file", form.file);

    try {
      await axios.post("/api/documents/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded!");
      setShowForm(false);
      setForm({ employee: "", kind: "", title: "", file: null });
      fetchDocuments();
    } catch (error: any) {
      const data = error?.response?.data?.message;
    
      if (data?.errors && Array.isArray(data.errors)) {
        const newErrors: FormErrors = {};
    
        data.errors.forEach((e: any) => {
          if (e.field) {
            newErrors[e.field as keyof FormErrors] = e.message;
          }
        });
    
        setErrors(newErrors);
      } else {
       toast.error(error?.response?.data?.message || "Upload failed");
      }
    }
    
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await axios.get(`/api/documents/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = res.headers["content-disposition"];
      let fileName = "document";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = match[1];
      }
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Download failed");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/documents/${id}`);
      toast.success("Document deleted!");
      fetchDocuments();
    } catch (error: any) {
      toast.error("Delete failed");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
     

      {/* Main content */}
      <div className="flex-1 p-4 mt-12 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Reports Management
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-md text-sm sm:text-base"
          >
            <FiUpload /> Upload Report
          </button>
        </div>
        <div className="flex gap-2 mb-4">
  <input
    type="text"
    placeholder="Search by Employee Name or Kind"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 flex-1"
  />
</div>


        {/* Upload Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
            <div className="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-md shadow-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Upload New Report
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <select
                  name="employee"
                  value={form.employee}
                  onChange={handleChange}
                 
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} ({emp.email})
                    </option>
                  ))}
                </select>
                {errors.employee && (
                       <p className="text-red-500 text-xs mt-1">{errors.employee}</p>
                     )}


                <select
                  name="kind"
                  value={form.kind}
                  onChange={handleChange}
                 
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Kind</option>
                  <option value="CONTRACT">CONTRACT</option>
                  <option value="LETTER">LETTER</option>
                  <option value="PAYSLIP">PAYSLIP</option>
                  <option value="POLICY">POLICY</option>
                  <option value="OTHER">OTHER</option>
                </select>
                {errors.kind && (
                  <p className="text-red-500 text-xs mt-1">{errors.kind}</p>
                   )}


                <input
                  type="text"
                  name="title"
                  placeholder="Document Title"
                  value={form.title}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                      <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                         )}


                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  required
                  className="border rounded-lg px-3 py-2"
                />

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 shadow-md text-sm"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewDoc && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
            <div className="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-lg shadow-xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Report Details
              </h3>
              <div className="space-y-2 text-gray-700 text-sm sm:text-base">
                <p>
                  <strong>Title:</strong> {viewDoc.title}
                </p>
                <p>
                  <strong>Kind:</strong> {viewDoc.kind}
                </p>
                <p>
                  <strong>Employee:</strong> {viewDoc.employee?.firstName}{" "}
                  {viewDoc.employee?.lastName} ({viewDoc.employee?.email})
                </p>
                <p>
                  <strong>Uploaded By:</strong>{" "}
                  {viewDoc.uploadedBy?.firstName} {viewDoc.uploadedBy?.lastName}{" "}
                  ({viewDoc.uploadedBy?.email})
                </p>
                <p>
                  <strong>Uploaded On:</strong>{" "}
                  {new Date(viewDoc.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setViewDoc(null)}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents Table */}
        <div className="bg-white shadow rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 sm:px-6 py-3">Title</th>
                  <th className="px-4 sm:px-6 py-3">Kind</th>
                  <th className="px-4 sm:px-6 py-3">Employee</th>
                  <th className="px-4 sm:px-6 py-3">Uploaded By</th>
                  <th className="px-4 sm:px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 sm:px-6 py-3 truncate max-w-[120px] sm:max-w-[200px]">
                        {doc.title}
                      </td>
                      <td className="px-4 sm:px-6 py-3">{doc.kind}</td>
                      <td className="px-4 sm:px-6 py-3">
                        {doc.employee?.firstName} {doc.employee?.lastName}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
                      </td>
                      <td className="px-4 sm:px-6 py-3 flex justify-center gap-2 sm:gap-3">
                        <button
                          onClick={() => setViewDoc(doc)}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <FiEye className="text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc._id)}
                          className="p-2 rounded-lg hover:bg-blue-100"
                        >
                          <FiDownload className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="p-2 rounded-lg hover:bg-red-100"
                        >
                          <FiTrash2 className="text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-500 px-4 sm:px-6 py-6"
                    >
                      No Reports Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
            <div className="flex justify-between items-center  mt-5">
              <button
  disabled={page === 1}
  onClick={() => fetchDocuments(page - 1)}
  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
>
  Prev
</button>
<span> {page} of {totalPages}</span>
<button
  disabled={page === totalPages}
  onClick={() => fetchDocuments(page + 1)}
  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
>
  Next
</button>

            </div>
          )}
      </div>
     
    </div>
  );
};

export default DocumentManagement;
// import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { FiUpload, FiDownload, FiTrash2, FiEye } from "react-icons/fi";

// // Types
// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email?: string;
// }

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email?: string;
// }

// interface Document {
//   _id: string;
//   title: string;
//   kind: string;
//   employee?: Employee;
//   uploadedBy?: User;
//   createdAt: string;
// }

// interface FormState {
//   employee: string;
//   kind: string;
//   title: string;
//   file: File | null;
// }

// const DocumentManagement: React.FC = () => {
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [viewDoc, setViewDoc] = useState<Document | null>(null);
//   const [form, setForm] = useState<FormState>({
//     employee: "",
//     kind: "",
//     title: "",
//     file: null,
//   });
//   const [loading, setLoading] = useState(false);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 5; // Items per page

//   // Fetch all documents with pagination
//   const fetchDocuments = async (p = 1) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/documents?page=${p}&limit=${limit}`);
//       setDocuments(res.data.data.documents || []);
//       setTotalPages(res.data.data.totalPages || 1);
//       setPage(res.data.data.page || 1);
//     } catch (error: any) {
//       toast.error("Failed to fetch documents");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch employees
//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("/api/Employee/");
//       setEmployees(res.data.data?.employees || []);
//     } catch (error: any) {
//       toast.error("Failed to fetch employees");
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//     fetchEmployees();
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, files } = e.target as HTMLInputElement;
//     if (name === "file" && files) {
//       setForm({ ...form, file: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!form.file) return toast.error("Please select a file");

//     const data = new FormData();
//     data.append("employee", form.employee);
//     data.append("kind", form.kind);
//     data.append("title", form.title);
//     data.append("file", form.file);

//     try {
//       await axios.post("/api/documents/upload", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Document uploaded!");
//       setShowForm(false);
//       setForm({ employee: "", kind: "", title: "", file: null });
//       fetchDocuments(page); // Refresh current page
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Upload failed");
//       console.error(error);
//     }
//   };

//   const handleDownload = async (id: string) => {
//     try {
//       const res = await axios.get(`/api/documents/download/${id}`, {
//         responseType: "blob",
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;

//       const contentDisposition = res.headers["content-disposition"];
//       let fileName = "document";
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="?([^"]+)"?/);
//         if (match?.[1]) fileName = match[1];
//       }
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error: any) {
//       toast.error("Download failed");
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`/api/documents/${id}`);
//       toast.success("Document deleted!");
//       fetchDocuments(page);
//     } catch (error: any) {
//       toast.error("Delete failed");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
//       <div className="flex-1 p-4 mt-12 sm:p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//             Reports Management
//           </h2>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-md text-sm sm:text-base"
//           >
//             <FiUpload /> Upload Report
//           </button>
//         </div>

//         {/* Documents Table */}
//         <div className="bg-white shadow rounded-2xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-xs sm:text-sm text-left">
//               <thead className="bg-gray-50 text-gray-600 uppercase">
//                 <tr>
//                   <th className="px-4 sm:px-6 py-3">Title</th>
//                   <th className="px-4 sm:px-6 py-3">Kind</th>
//                   <th className="px-4 sm:px-6 py-3">Employee</th>
//                   <th className="px-4 sm:px-6 py-3">Uploaded By</th>
//                   <th className="px-4 sm:px-6 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-6">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : documents.length > 0 ? (
//                   documents.map((doc) => (
//                     <tr key={doc._id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 sm:px-6 py-3 truncate max-w-[120px] sm:max-w-[200px]">
//                         {doc.title}
//                       </td>
//                       <td className="px-4 sm:px-6 py-3">{doc.kind}</td>
//                       <td className="px-4 sm:px-6 py-3">
//                         {doc.employee?.firstName} {doc.employee?.lastName}
//                       </td>
//                       <td className="px-4 sm:px-6 py-3">
//                         {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
//                       </td>
//                       <td className="px-4 sm:px-6 py-3 flex justify-center gap-2 sm:gap-3">
//                         <button
//                           onClick={() => setViewDoc(doc)}
//                           className="p-2 rounded-lg hover:bg-gray-100"
//                         >
//                           <FiEye className="text-gray-700" />
//                         </button>
//                         <button
//                           onClick={() => handleDownload(doc._id)}
//                           className="p-2 rounded-lg hover:bg-blue-100"
//                         >
//                           <FiDownload className="text-blue-600" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(doc._id)}
//                           className="p-2 rounded-lg hover:bg-red-100"
//                         >
//                           <FiTrash2 className="text-red-600" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="text-center text-gray-500 px-4 sm:px-6 py-6">
//                       No Reports Found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 p-3">
//               <button
//                 disabled={page === 1}
//                 onClick={() => fetchDocuments(page - 1)}
//                 className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <span>
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 disabled={page === totalPages}
//                 onClick={() => fetchDocuments(page + 1)}
//                 className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentManagement;
