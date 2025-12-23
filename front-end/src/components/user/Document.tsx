
// import React, { useEffect, useState,useContext } from "react";
// import axios from "../../util/axiosInstance";
// import toast from "react-hot-toast";
// import Layout from "../Layout";

// import { FileText, Trash2, Download } from "lucide-react";
// import { UserInfoContext } from "../../context/contextApi";

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [kind, setKind] = useState("OTHER");
//   const [loading, setLoading] = useState(false);
//   const { user } = useContext(UserInfoContext);
  
  

 
 


// const fetchDocuments = async () => {
//   const token =user.token;
//   if (!token) return;

//   try {
//     const res = await axios.get("/api/documents", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log("this is user",res.data)
//     setDocuments(res.data?.data || []);
//   } catch (err) {
//     console.error(err);
//     toast.error(err?.response?.data?.message || "Failed to fetch documents");
//   }
// };


//   useEffect(() => {
//     if (user) fetchDocuments();
//   }, [user]);

//   // ✅ Upload document
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file || !title) return toast.error("File and title are required");

//     const token = localStorage.getItem("accessToken");
//     const employeeId = localStorage.getItem("employeeId");
//     if (!token || !employeeId) return toast.error("User not authenticated");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("kind", kind);
//     formData.append("employee", employeeId);
//     formData.append("uploadedBy", employeeId);

//     try {
//       setLoading(true);
//       await axios.post("/api/documents/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("✅ Document uploaded successfully");
//       setFile(null);
//       setTitle("");
//       setKind("OTHER");
//       fetchDocuments();
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Download document
//   const handleDownload = async (id, title) => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) return toast.error("User not authenticated");

//     try {
//       const res = await axios.get(`/api/documents/download/${id}`, {
//         responseType: "blob",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", title);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error(err);
//       toast.error("Download failed");
//     }
//   };

//   // // ✅ Delete document
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this document?")) return;

//     const token = localStorage.getItem("accessToken");
//     if (!token) return toast.error("User not authenticated");

//     try {
//       await axios.delete(`/api/documents/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("🗑️ Document deleted");
//       fetchDocuments();
//     } catch (err) {
//       console.error(err);
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6 flex-1 overflow-auto space-y-6">
//         <h1 className="text-3xl font-bold text-gray-800">📊 Reports</h1>
//           <h2 className="text-gray-500 text-sm">view, and download reports</h2>
//         {/* Document List */}
//         <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
//           {documents.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
//               {documents.map((doc) => (
//                 <div
//                   key={doc._id}
//                   className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     <FileText className="w-8 h-8 text-indigo-500" />
//                     <div>
//                       <h4 className="text-lg font-medium text-gray-800">{doc.title}</h4>
//                       <p className="text-sm text-gray-500">{doc.kind}</p>
//                     </div>
//                   </div>

//                   <p className="text-sm text-gray-600 mb-2">
//                     Employee:{" "}
//                     {doc.employee
//                       ? `${doc.employee.firstName} ${doc.employee.lastName}`
//                       : "Global"}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-4">
//                     Uploaded By:{" "}
//                     {doc.uploadedBy
//                       ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`
//                       : "-"}
//                   </p>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleDownload(doc._id, doc.title)}
//                       className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
//                     >
//                       <Download className="w-4 h-4" /> Download
//                     </button>
//                     {/* <button
//                       onClick={() => handleDelete(doc._id)}
//                       className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
//                     >
//                       <Trash2 className="w-4 h-4" /> Delete
//                     </button> */}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No Reports found</p>
//           )}
//         </div>
       
//       </div>
//     </Layout>
//   );
// };

// export default Documents;

import React, { useEffect, useState, useContext, ChangeEvent, FormEvent } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";
import Layout from "../Layout";
import { FileText, Download } from "lucide-react";
import { UserInfoContext } from "../../context/contextApi";

// ✅ Types
interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  token?: string;
}

interface Employee {
  _id: string;
  firstName?: string;
  lastName?: string;
}

interface Document {
  _id: string;
  title: string;
  kind: string;
  employee?: Employee;
  uploadedBy?: Employee;
  fileUrl?: string;
}
interface DocumentsResponse {
  documents: Document[];
  total: number;
  totalPages: number;
  page: number;
}

interface ApiResponse<T> {
  data: T;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [kind, setKind] = useState<string>("OTHER");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useContext<{ user?: User }>(UserInfoContext);
  const [page, setPage] = useState<number>(1);
const [totalPages, setTotalPages] = useState<number>(1);
const limit = 2;

  // ✅ Fetch documents
  const fetchDocuments = async (page:number=1) => {
    const token = user?.token;
    if (!token) return;

    try {
      const res = await axios.get<ApiResponse<DocumentsResponse>>(`/api/documents?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("all doc is",res.data.data)
      setDocuments(res.data.data.documents|| []);
      setPage(res.data.data.page)
      setTotalPages(res.data.data.totalPages)
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to fetch documents");
    }
  };

  useEffect(() => {
    if (user) fetchDocuments(page);
  }, [user, page]);

  // ✅ Upload document
  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !title) return toast.error("File and title are required");

    const token = user?.token;
    const employeeId = user?._id;
    if (!token || !employeeId) return toast.error("User not authenticated");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("kind", kind);
    formData.append("employee", employeeId);
    formData.append("uploadedBy", employeeId);

    try {
      setLoading(true);
      await axios.post("/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("✅ Document uploaded successfully");
      setFile(null);
      setTitle("");
      setKind("OTHER");
      fetchDocuments();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download document
  const handleDownload = async (id: string, title: string) => {
    const token = user?.token;
    if (!token) return toast.error("User not authenticated");

    try {
      const res = await axios.get(`/api/documents/download/${id}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    }
  };

  // ✅ Delete document
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    const token = user?.token;
    if (!token) return toast.error("User not authenticated");

    try {
      await axios.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Document deleted");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
  
      <div className="p-6 flex-1 overflow-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Reports</h1>
        <h2 className="text-gray-500 text-sm">View and download reports</h2>

        {/* Document List */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8 text-indigo-500" />
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">{doc.title}</h4>
                      <p className="text-sm text-gray-500">{doc.kind}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Employee:{" "}
                    {doc.employee
                      ? `${doc.employee.firstName || ""} ${doc.employee.lastName || ""}`
                      : "Global"}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Uploaded By:{" "}
                    {doc.uploadedBy
                      ? `${doc.uploadedBy.firstName || ""} ${doc.uploadedBy.lastName || ""}`
                      : "-"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(doc._id, doc.title)}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    {/* Uncomment if delete functionality is needed
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-6">No Reports found</p>
          )}
        </div>
        <div className="flex justify-between items-center  gap-4 mt-4">
  <button
    disabled={page === 1}
    onClick={() => setPage(prev => prev - 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(prev => prev + 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>
    
  );
};

export default Documents;
