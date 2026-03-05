

// import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import { FiUpload, FiDownload, FiTrash2, FiEye } from "react-icons/fi";
// import Sidebar from "../sideBar";

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
// interface FormErrors {
//   employee?: string;
//   kind?: string;
//   title?: string;
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
//    // Pagination
//   const [page, setPage] = useState(1);
//    const [totalPages, setTotalPages] = useState(1);
//   const limit = 5; // Items per page
//   const [search, setSearch] = useState(""); // for text search (name/kind)
//   const [errors, setErrors] = useState<FormErrors>({});

//   // const [typeFilter, setTypeFilter] = useState(""); // for kind dropdown filter
  
//   // // Fetch all documents
//   // const fetchDocuments = async (page:number=1) => {
//   //   try {
//   //     const res = await axios.get(`/api/documents?page=${page}&limit=${limit}`);
//   //     setDocuments(res.data.data.documents || []);
//   //     setTotalPages(res.data.data.totalPages || 1);
//   //      setPage(res.data.data.page || 1);
//   //      setTotalPages(res.data.data.totalPages || 1);

//   //   } catch (error: any) {
//   //     toast.error("Failed to fetch documents");
//   //     console.error(error);
//   //   }
//   // };
//   const fetchDocuments = async (p: number = 1) => {
//     try {
//       const res = await axios.get(
//         `/api/documents?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
//       );
//       setDocuments(res.data.data.documents || []);
//       setTotalPages(res.data.data.totalPages || 1);
//       setPage(res.data.data.page || 1);
//     } catch (error: any) {
//       toast.error("Failed to fetch documents");
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
//     const timer = setTimeout(() => {
//       fetchDocuments(1);
//     }, 800);
  
//     return () => clearTimeout(timer);
//   }, [search]);
  
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
    
//     setErrors({});

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
//       fetchDocuments();
//     } catch (error: any) {
//       const data = error?.response?.data?.message;
    
//       if (data?.errors && Array.isArray(data.errors)) {
//         const newErrors: FormErrors = {};
    
//         data.errors.forEach((e: any) => {
//           if (e.field) {
//             newErrors[e.field as keyof FormErrors] = e.message;
//           }
//         });
    
//         setErrors(newErrors);
//       } else {
//        toast.error(error?.response?.data?.message || "Upload failed");
//       }
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
//       fetchDocuments();
//     } catch (error: any) {
//       toast.error("Delete failed");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
     

//       {/* Main content */}
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
//         <div className="flex gap-2 mb-4">
//   <input
//     type="text"
//     placeholder="Search by Employee Name or Kind"
//     value={search}
//     onChange={(e) => setSearch(e.target.value)}
//     className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 flex-1"
//   />
// </div>


//         {/* Upload Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
//             <div className="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-md shadow-xl">
//               <h3 className="text-lg sm:text-xl font-semibold mb-4">
//                 Upload New Report
//               </h3>
//               <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//                 <select
//                   name="employee"
//                   value={form.employee}
//                   onChange={handleChange}
                 
//                   className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Employee</option>
//                   {employees.map((emp) => (
//                     <option key={emp._id} value={emp._id}>
//                       {emp.firstName} {emp.lastName} ({emp.email})
//                     </option>
//                   ))}
//                 </select>
//                 {errors.employee && (
//                        <p className="text-red-500 text-xs mt-1">{errors.employee}</p>
//                      )}


//                 <select
//                   name="kind"
//                   value={form.kind}
//                   onChange={handleChange}
                 
//                   className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Kind</option>
//                   <option value="CONTRACT">CONTRACT</option>
//                   <option value="LETTER">LETTER</option>
//                   <option value="PAYSLIP">PAYSLIP</option>
//                   <option value="POLICY">POLICY</option>
//                   <option value="OTHER">OTHER</option>
//                 </select>
//                 {errors.kind && (
//                   <p className="text-red-500 text-xs mt-1">{errors.kind}</p>
//                    )}


//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Document Title"
//                   value={form.title}
//                   onChange={handleChange}
//                   className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                 />
//                 {errors.title && (
//                       <p className="text-red-500 text-xs mt-1">{errors.title}</p>
//                          )}


//                 <input
//                   type="file"
//                   name="file"
//                   onChange={handleChange}
//                   required
//                   className="border rounded-lg px-3 py-2"
//                 />

//                 <div className="flex justify-end gap-3 mt-3">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-3 py-2 border rounded-lg hover:bg-gray-100 text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 shadow-md text-sm"
//                   >
//                     Upload
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* View Modal */}
//         {viewDoc && (
//           <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
//             <div className="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-lg shadow-xl">
//               <h3 className="text-lg sm:text-xl font-semibold mb-4">
//                 Report Details
//               </h3>
//               <div className="space-y-2 text-gray-700 text-sm sm:text-base">
//                 <p>
//                   <strong>Title:</strong> {viewDoc.title}
//                 </p>
//                 <p>
//                   <strong>Kind:</strong> {viewDoc.kind}
//                 </p>
//                 <p>
//                   <strong>Employee:</strong> {viewDoc.employee?.firstName}{" "}
//                   {viewDoc.employee?.lastName} ({viewDoc.employee?.email})
//                 </p>
//                 <p>
//                   <strong>Uploaded By:</strong>{" "}
//                   {viewDoc.uploadedBy?.firstName} {viewDoc.uploadedBy?.lastName}{" "}
//                   ({viewDoc.uploadedBy?.email})
//                 </p>
//                 <p>
//                   <strong>Uploaded On:</strong>{" "}
//                   {new Date(viewDoc.createdAt).toLocaleString()}
//                 </p>
//               </div>
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={() => setViewDoc(null)}
//                   className="px-3 py-2 border rounded-lg hover:bg-gray-100 text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

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
//                 {documents.length > 0 ? (
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
//                     <td
//                       colSpan={5}
//                       className="text-center text-gray-500 px-4 sm:px-6 py-6"
//                     >
//                       No Reports Found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         {totalPages > 1 && (
//             <div className="flex justify-between items-center  mt-5">
//               <button
//   disabled={page === 1}
//   onClick={() => fetchDocuments(page - 1)}
//   className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
// >
//   Prev
// </button>
// <span> {page} of {totalPages}</span>
// <button
//   disabled={page === totalPages}
//   onClick={() => fetchDocuments(page + 1)}
//   className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
// >
//   Next
// </button>

//             </div>
//           )}
//       </div>
     
//     </div>
//   );
// };

// export default DocumentManagement;
// // import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
// // import axios from "../../util/axiosInstance";
// // import toast from "react-hot-toast";
// // import { FiUpload, FiDownload, FiTrash2, FiEye } from "react-icons/fi";

// // // Types
// // interface Employee {
// //   _id: string;
// //   firstName: string;
// //   lastName: string;
// //   email?: string;
// // }

// // interface User {
// //   _id: string;
// //   firstName: string;
// //   lastName: string;
// //   email?: string;
// // }

// // interface Document {
// //   _id: string;
// //   title: string;
// //   kind: string;
// //   employee?: Employee;
// //   uploadedBy?: User;
// //   createdAt: string;
// // }

// // interface FormState {
// //   employee: string;
// //   kind: string;
// //   title: string;
// //   file: File | null;
// // }

// // const DocumentManagement: React.FC = () => {
// //   const [documents, setDocuments] = useState<Document[]>([]);
// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [showForm, setShowForm] = useState(false);
// //   const [viewDoc, setViewDoc] = useState<Document | null>(null);
// //   const [form, setForm] = useState<FormState>({
// //     employee: "",
// //     kind: "",
// //     title: "",
// //     file: null,
// //   });
// //   const [loading, setLoading] = useState(false);

// //   // Pagination
// //   const [page, setPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const limit = 5; // Items per page

// //   // Fetch all documents with pagination
// //   const fetchDocuments = async (p = 1) => {
// //     try {
// //       setLoading(true);
// //       const res = await axios.get(`/api/documents?page=${p}&limit=${limit}`);
// //       setDocuments(res.data.data.documents || []);
// //       setTotalPages(res.data.data.totalPages || 1);
// //       setPage(res.data.data.page || 1);
// //     } catch (error: any) {
// //       toast.error("Failed to fetch documents");
// //       console.error(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fetch employees
// //   const fetchEmployees = async () => {
// //     try {
// //       const res = await axios.get("/api/Employee/");
// //       setEmployees(res.data.data?.employees || []);
// //     } catch (error: any) {
// //       toast.error("Failed to fetch employees");
// //       console.error(error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchDocuments();
// //     fetchEmployees();
// //   }, []);

// //   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// //     const { name, value, files } = e.target as HTMLInputElement;
// //     if (name === "file" && files) {
// //       setForm({ ...form, file: files[0] });
// //     } else {
// //       setForm({ ...form, [name]: value });
// //     }
// //   };

// //   const handleSubmit = async (e: FormEvent) => {
// //     e.preventDefault();
// //     if (!form.file) return toast.error("Please select a file");

// //     const data = new FormData();
// //     data.append("employee", form.employee);
// //     data.append("kind", form.kind);
// //     data.append("title", form.title);
// //     data.append("file", form.file);

// //     try {
// //       await axios.post("/api/documents/upload", data, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });
// //       toast.success("Document uploaded!");
// //       setShowForm(false);
// //       setForm({ employee: "", kind: "", title: "", file: null });
// //       fetchDocuments(page); // Refresh current page
// //     } catch (error: any) {
// //       toast.error(error?.response?.data?.message || "Upload failed");
// //       console.error(error);
// //     }
// //   };

// //   const handleDownload = async (id: string) => {
// //     try {
// //       const res = await axios.get(`/api/documents/download/${id}`, {
// //         responseType: "blob",
// //       });
// //       const url = window.URL.createObjectURL(new Blob([res.data]));
// //       const link = document.createElement("a");
// //       link.href = url;

// //       const contentDisposition = res.headers["content-disposition"];
// //       let fileName = "document";
// //       if (contentDisposition) {
// //         const match = contentDisposition.match(/filename="?([^"]+)"?/);
// //         if (match?.[1]) fileName = match[1];
// //       }
// //       link.setAttribute("download", fileName);
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
// //       window.URL.revokeObjectURL(url);
// //     } catch (error: any) {
// //       toast.error("Download failed");
// //       console.error(error);
// //     }
// //   };

// //   const handleDelete = async (id: string) => {
// //     try {
// //       await axios.delete(`/api/documents/${id}`);
// //       toast.success("Document deleted!");
// //       fetchDocuments(page);
// //     } catch (error: any) {
// //       toast.error("Delete failed");
// //       console.error(error);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
// //       <div className="flex-1 p-4 mt-12 sm:p-6">
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
// //           <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
// //             Reports Management
// //           </h2>
// //           <button
// //             onClick={() => setShowForm(true)}
// //             className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-md text-sm sm:text-base"
// //           >
// //             <FiUpload /> Upload Report
// //           </button>
// //         </div>

// //         {/* Documents Table */}
// //         <div className="bg-white shadow rounded-2xl overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full text-xs sm:text-sm text-left">
// //               <thead className="bg-gray-50 text-gray-600 uppercase">
// //                 <tr>
// //                   <th className="px-4 sm:px-6 py-3">Title</th>
// //                   <th className="px-4 sm:px-6 py-3">Kind</th>
// //                   <th className="px-4 sm:px-6 py-3">Employee</th>
// //                   <th className="px-4 sm:px-6 py-3">Uploaded By</th>
// //                   <th className="px-4 sm:px-6 py-3 text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200">
// //                 {loading ? (
// //                   <tr>
// //                     <td colSpan={5} className="text-center py-6">
// //                       Loading...
// //                     </td>
// //                   </tr>
// //                 ) : documents.length > 0 ? (
// //                   documents.map((doc) => (
// //                     <tr key={doc._id} className="hover:bg-gray-50 transition">
// //                       <td className="px-4 sm:px-6 py-3 truncate max-w-[120px] sm:max-w-[200px]">
// //                         {doc.title}
// //                       </td>
// //                       <td className="px-4 sm:px-6 py-3">{doc.kind}</td>
// //                       <td className="px-4 sm:px-6 py-3">
// //                         {doc.employee?.firstName} {doc.employee?.lastName}
// //                       </td>
// //                       <td className="px-4 sm:px-6 py-3">
// //                         {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
// //                       </td>
// //                       <td className="px-4 sm:px-6 py-3 flex justify-center gap-2 sm:gap-3">
// //                         <button
// //                           onClick={() => setViewDoc(doc)}
// //                           className="p-2 rounded-lg hover:bg-gray-100"
// //                         >
// //                           <FiEye className="text-gray-700" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleDownload(doc._id)}
// //                           className="p-2 rounded-lg hover:bg-blue-100"
// //                         >
// //                           <FiDownload className="text-blue-600" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(doc._id)}
// //                           className="p-2 rounded-lg hover:bg-red-100"
// //                         >
// //                           <FiTrash2 className="text-red-600" />
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan={5} className="text-center text-gray-500 px-4 sm:px-6 py-6">
// //                       No Reports Found
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           {totalPages > 1 && (
// //             <div className="flex justify-center items-center gap-2 p-3">
// //               <button
// //                 disabled={page === 1}
// //                 onClick={() => fetchDocuments(page - 1)}
// //                 className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
// //               >
// //                 Prev
// //               </button>
// //               <span>
// //                 Page {page} of {totalPages}
// //               </span>
// //               <button
// //                 disabled={page === totalPages}
// //                 onClick={() => fetchDocuments(page + 1)}
// //                 className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DocumentManagement;
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import { FiUpload, FiDownload, FiTrash2, FiEye } from "react-icons/fi";
import Sidebar from "../sideBar";

// ------------------------
// TYPES (UNCHANGED)
// ------------------------
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

// ------------------------
// KIND BADGE
// ------------------------
const kindMeta: Record<string, { cls: string; dot: string }> = {
  CONTRACT: { cls: "bg-violet-50 text-violet-700 border border-violet-200",   dot: "bg-violet-500"  },
  LETTER:   { cls: "bg-sky-50 text-sky-700 border border-sky-200",             dot: "bg-sky-500"     },
  PAYSLIP:  { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  POLICY:   { cls: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-500"   },
  OTHER:    { cls: "bg-slate-100 text-slate-600 border border-slate-200",      dot: "bg-slate-400"   },
};

const KindBadge: React.FC<{ kind: string }> = ({ kind }) => {
  const m = kindMeta[kind?.toUpperCase()] || kindMeta.OTHER;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {kind}
    </span>
  );
};

// ------------------------
// FORM FIELD WRAPPER
// ------------------------
const FieldWrap: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    {children}
    {error && <p className="text-rose-500 text-xs mt-0.5">{error}</p>}
  </div>
);

// ------------------------
// MAIN COMPONENT
// ------------------------
const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [form, setForm] = useState<FormState>({ employee: "", kind: "", title: "", file: null });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // ------------------------
  // FETCH LOGIC (UNCHANGED)
  // ------------------------
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
    const timer = setTimeout(() => { fetchDocuments(1); }, 800);
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
          if (e.field) newErrors[e.field as keyof FormErrors] = e.message;
        });
        setErrors(newErrors);
      } else {
        toast.error(error?.response?.data?.message || "Upload failed");
      }
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await axios.get(`/api/documents/download/${id}`, { responseType: "blob" });
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

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-slate-50 font-sans">

      {/* Main content */}
      <div className="flex-1 px-6 py-8 mt-12 sm:mt-0 max-w-screen-xl mx-auto w-full">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1 h-5 rounded-full bg-blue-600" />
              <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">Human Resources</p>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Upload, view and manage employee documents</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <FiUpload size={15} />
            Upload Report
          </button>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-5">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by employee name or kind…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* ── Documents Table Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">Document Records</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {documents.length} {documents.length === 1 ? "record" : "records"}
              </span>
            </div>
            {totalPages > 1 && (
              <span className="text-xs text-slate-400">
                Page <span className="font-medium text-slate-600">{page}</span> of{" "}
                <span className="font-medium text-slate-600">{totalPages}</span>
              </span>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Title", "Kind", "Employee", "Uploaded By", "Uploaded On", "Actions"].map((h, i) => (
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
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="shrink-0 w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </span>
                          <span className="font-medium text-slate-800 truncate max-w-[140px] sm:max-w-[200px]">
                            {doc.title}
                          </span>
                        </div>
                      </td>

                      {/* Kind */}
                      <td className="px-5 py-3.5">
                        <KindBadge kind={doc.kind} />
                      </td>

                      {/* Employee */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {doc.employee ? (
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {doc.employee.firstName} {doc.employee.lastName}
                            </p>
                            {doc.employee.email && (
                              <p className="text-xs text-slate-400">{doc.employee.email}</p>
                            )}
                          </div>
                        ) : <span className="text-slate-400 text-sm">—</span>}
                      </td>

                      {/* Uploaded By */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {doc.uploadedBy ? (
                          <div>
                            <p className="font-medium text-slate-700 text-sm">
                              {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                            </p>
                            {doc.uploadedBy.email && (
                              <p className="text-xs text-slate-400">{doc.uploadedBy.email}</p>
                            )}
                          </div>
                        ) : <span className="text-slate-400 text-sm">—</span>}
                      </td>

                      {/* Uploaded On */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(doc.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewDoc(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
                            title="View"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            onClick={() => handleDownload(doc._id)}
                            className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition"
                            title="Download"
                          >
                            <FiDownload size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <p className="text-sm font-medium text-slate-500">No reports found</p>
                        <p className="text-xs text-slate-400">Try adjusting your search or upload a new report</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination footer ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
              <button
                disabled={page === 1}
                onClick={() => fetchDocuments(page - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchDocuments(p)}
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
                onClick={() => fetchDocuments(page + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Upload Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            style={{ animation: "scaleIn 0.2s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-block w-1 h-4 rounded-full bg-blue-600" />
                  <p className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase">Document</p>
                </div>
                <h3 className="text-base font-bold text-slate-900">Upload New Report</h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              <FieldWrap label="Employee" error={errors.employee}>
                <select
                  name="employee"
                  value={form.employee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="">Select employee…</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} ({emp.email})
                    </option>
                  ))}
                </select>
              </FieldWrap>

              <FieldWrap label="Document Kind" error={errors.kind}>
                <select
                  name="kind"
                  value={form.kind}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="">Select kind…</option>
                  <option value="CONTRACT">CONTRACT</option>
                  <option value="LETTER">LETTER</option>
                  <option value="PAYSLIP">PAYSLIP</option>
                  <option value="POLICY">POLICY</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </FieldWrap>

              <FieldWrap label="Document Title" error={errors.title}>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Q3 Payslip – John Doe"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </FieldWrap>

              <FieldWrap label="File">
                <label className="flex flex-col items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition cursor-pointer">
                  <FiUpload size={20} className="text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">
                    {form.file ? form.file.name : "Click to browse or drag & drop"}
                  </span>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    required
                    className="hidden"
                  />
                </label>
              </FieldWrap>

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition"
                >
                  <FiUpload size={13} />
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Details Modal ── */}
      {viewDoc && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setViewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            style={{ animation: "scaleIn 0.2s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-block w-1 h-4 rounded-full bg-blue-600" />
                  <p className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase">Document</p>
                </div>
                <h3 className="text-base font-bold text-slate-900">Report Details</h3>
              </div>
              <button
                onClick={() => setViewDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Doc title row */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{viewDoc.title}</p>
                  <div className="mt-1"><KindBadge kind={viewDoc.kind} /></div>
                </div>
              </div>

              {/* Details grid */}
              <dl className="grid grid-cols-2 gap-3">
                {[
                  { label: "Employee",       value: viewDoc.employee   ? `${viewDoc.employee.firstName} ${viewDoc.employee.lastName}`     : "—" },
                  { label: "Employee Email", value: viewDoc.employee?.email || "—" },
                  { label: "Uploaded By",    value: viewDoc.uploadedBy ? `${viewDoc.uploadedBy.firstName} ${viewDoc.uploadedBy.lastName}` : "—" },
                  { label: "Uploader Email", value: viewDoc.uploadedBy?.email || "—" },
                  { label: "Uploaded On",    value: new Date(viewDoc.createdAt).toLocaleString(), span: true },
                ].map(({ label, value, span }) => (
                  <div key={label} className={`bg-slate-50 rounded-lg px-3 py-2.5 ${span ? "col-span-2" : ""}`}>
                    <dt className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</dt>
                    <dd className="text-sm font-medium text-slate-800 truncate">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end gap-2.5">
              <button
                onClick={() => handleDownload(viewDoc._id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              >
                <FiDownload size={13} />
                Download
              </button>
              <button
                onClick={() => setViewDoc(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DocumentManagement;