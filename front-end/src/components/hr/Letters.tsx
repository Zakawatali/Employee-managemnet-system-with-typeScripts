
// import React, { useState, useEffect, ChangeEvent } from "react";
// import axios from "../../util/axiosInstance"; // Node backend
// import axiosPython from "../../util/axiosPython"; // Python backend
// import { FileText, Download, Send, Search } from "lucide-react";
// import toast from "react-hot-toast";

// // ------------------------
// // TYPES
// // ------------------------
// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   position?: string;
//   department?: string;
// }

// type LetterType =
//   | "offer"
//   | "termination"
//   | "certificate"
//   | "experience_ai"
//   | "experience_web"
//   | "experience_graphic"
//   | "";

// interface DownloadLinks {
//   docx?: string;
//   pdf?: string;
// }

// interface FormDataType {
//   [key: string]: string;
// }

// // ------------------------
// // COMPONENT
// // ------------------------
// const Letters: React.FC = () => {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [letterType, setLetterType] = useState<LetterType>("");
//   const [formData, setFormData] = useState<FormDataType>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);
//   const [search, setSearch] = useState<string>("");

//   // 🔹 Fields required for each letter type
//   const fieldsMap: Record<LetterType, string[]> = {
//     offer: [
//       "REF",
//       "DATE",
//       "NAME",
//       "POSITION",
//       "DEPARTMENT",
//       "DURATION",
//       "STARTDATE",
//       "SUPNAME",
//       "TASKS",
//       "FROMANDTODATE",
//       "TYPE",
//       "RESPONSEDATE",
//     ],
//     termination: ["REF", "DATE", "NAME", "POSITION", "TERMDATE", "LASTDAY"],
//     certificate: ["NAME", "POSITION", "DURATION"],
//     experience_ai: ["REF", "DATE", "NAME", "DURATION", "STARTDATE", "ENDDATE"],
//     experience_web: ["REF", "DATE", "NAME", "DURATION", "STARTDATE", "ENDDATE"],
//     experience_graphic: [
//       "REF",
//       "DATE",
//       "NAME",
//       "DURATION",
//       "STARTDATE",
//       "ENDDATE",
//     ],
//     "": [],
//   };

//   // 🔹 Backend endpoint mapping
//   const endpointMap: Record<LetterType, string> = {
//     offer: "http://127.0.0.1:8000/generate/offer-letter",
//     termination: "http://127.0.0.1:8000/generate/termination-letter",
//     certificate: "http://127.0.0.1:8000/generate/certificate",
//     experience_ai: "http://127.0.0.1:8000/generate/experience-letter/aiml",
//     experience_web: "http://127.0.0.1:8000/generate/experience-letter/webdev",
//     experience_graphic: "http://127.0.0.1:8000/generate/experience-letter/graphic-design",
//     "": "",
//   };

//   // ✅ Fetch employees (Node backend)
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("/api/employee/");
//         setEmployees(res.data.data?.employees || []);
//         setFilteredEmployees(res.data.data?.employees || []);
//       } catch (error: any) {
//         toast.error(error?.response?.data?.message || "Failed to fetch employees!");
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // ✅ Search filter
//   useEffect(() => {
//     if (!search) {
//       setFilteredEmployees(employees);
//     } else {
//       const lower = search.toLowerCase();
//       setFilteredEmployees(
//         employees.filter(
//           (emp) =>
//             emp.firstName?.toLowerCase().includes(lower) ||
//             emp.lastName?.toLowerCase().includes(lower) ||
//             emp.email?.toLowerCase().includes(lower)
//         )
//       );
//     }
//   }, [search, employees]);

//   // ✅ Employee selection
//   const handleEmployeeSelect = (empId: string) => {
//     const emp = employees.find((e) => e._id === empId);
//     if (emp) {
//       setSelectedEmployee(emp);
//       setFormData((prev) => ({
//         ...prev,
//         NAME: `${emp.firstName} ${emp.lastName}`,
//         EMAIL: emp.email,
//         POSITION: emp.position || "",
//         DEPARTMENT: emp.department || "",
//       }));
//     }
//   };

//   // ✅ Letter type selection
//   const handleLetterTypeChange = (type: LetterType) => {
//     setLetterType(type);
//     if (!selectedEmployee) return;

//     let initialFields: FormDataType = {};
//     fieldsMap[type].forEach((f) => {
//       switch (f) {
//         case "NAME":
//           initialFields[f] = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
//           break;
//         case "EMAIL":
//           initialFields[f] = selectedEmployee.email;
//           break;
//         case "POSITION":
//           initialFields[f] = selectedEmployee.position || "";
//           break;
//         case "DEPARTMENT":
//           initialFields[f] = selectedEmployee.department || "";
//           break;
//         case "DATE":
//           initialFields[f] = new Date().toISOString().split("T")[0];
//           break;
//         default:
//           initialFields[f] = "";
//       }
//     });

//     setFormData(initialFields);
//   };

//   // ✅ Handle field change
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Detect input type dynamically
//   const detectInputType = (field: string): string => {
//     const lower = field.toLowerCase();
//     if (letterType === "offer" && field === "FROMANDTODATE") return "text";
//     if (lower.includes("date")) return "date";
//     if (lower.includes("email")) return "email";
//     if (lower.includes("number") || lower.includes("phone") || lower.includes("cnic"))
//       return "number";
//     return "text";
//   };

//   // ✅ Generate Letter (Python backend with mapping)
//   const handleGenerate = async () => {
//     if (!letterType || !selectedEmployee) {
//       toast.error("Please select employee and letter type!");
//       return;
//     }
//     setLoading(true);
//     setDownloadLinks(null);

//     try {
//       const endpoint = endpointMap[letterType];
//       if (!endpoint) {
//         toast.error("Invalid letter type!");
//         setLoading(false);
//         return;
//       }

//       const { data } = await axiosPython.post(endpoint, formData);
//       setDownloadLinks({
//         docx: data.docx_url ? `http://127.0.0.1:8000${data.docx_url}` : undefined,
//         pdf: data.pdf_url ? `http://127.0.0.1:8000${data.pdf_url}` : undefined,
//       });
//       toast.success("Letter generated successfully!");
//     } catch (error: any) {
//       toast.error(error?.response?.data?.detail || "Failed to generate letter!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------------
//   // JSX
//   // ------------------------
//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       {/* Page Title */}
//       <div className="flex items-center gap-3 mb-8">
//         <FileText className="w-8 h-8 text-blue-600" />
//         <h1 className="text-3xl font-bold text-gray-800">Letter Generator</h1>
//       </div>

//       {/* 🔎 Searchbar */}
//       <div className="relative mb-6">
//         <div className="flex items-center border rounded-xl shadow-sm px-4 py-2 bg-white">
//           <Search className="text-gray-400 mr-2" />
//           <input
//             type="text"
//             placeholder="Search employee by name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full outline-none text-gray-700"
//           />
//         </div>
//         {search && (
//           <div className="absolute z-10 bg-white border mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-y-auto">
//             {filteredEmployees.map((emp) => (
//               <div
//                 key={emp._id}
//                 onClick={() => {
//                   handleEmployeeSelect(emp._id);
//                   setSearch("");
//                 }}
//                 className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
//               >
//                 {emp.firstName} {emp.lastName} - {emp.email}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Employee + Letter Type */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Select Employee
//           </label>
//           <select
//             value={selectedEmployee?._id || ""}
//             onChange={(e) => handleEmployeeSelect(e.target.value)}
//             className="w-full border px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
//           >
//             <option value="">-- Select Employee --</option>
//             {employees.map((emp) => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.firstName} {emp.lastName} ({emp.position})
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Select Letter Type
//           </label>
//           <select
//             value={letterType}
//             onChange={(e) => handleLetterTypeChange(e.target.value as LetterType)}
//             className="w-full border px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
//           >
//             <option value="">-- Select Letter Type --</option>
//             <option value="offer">📄 Offer Letter</option>
//             <option value="termination">❌ Termination Letter</option>
//             <option value="certificate">🎓 Certificate</option>
//             <option value="experience_ai">🤖 AI/ML Experience Letter</option>
//             <option value="experience_web">💻 Web Dev Experience Letter</option>
//             <option value="experience_graphic">🎨 Graphic Design Experience Letter</option>
//           </select>
//         </div>
//       </div>

//       {/* Dynamic Fields */}
//       {letterType && (
//         <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Fill Required Details
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {fieldsMap[letterType].map((field) => (
//               <div key={field}>
//                 <label className="block text-gray-600 font-medium mb-1">{field}</label>
//                 <input
//                   type={detectInputType(field)}
//                   name={field}
//                   value={formData[field] || ""}
//                   placeholder={`Enter ${field}`}
//                   onChange={handleChange}
//                   className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-blue-500 text-gray-700"
//                   required
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Generate Button */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleGenerate}
//           disabled={loading}
//           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition"
//         >
//           {loading ? "Generating..." : "Generate Letter"} <Send size={18} />
//         </button>
//       </div>

//       {/* Download Links */}
//       {downloadLinks && (
//         <div className="mt-10 bg-gray-50 p-6 rounded-2xl border shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">Download Your Letter</h2>
//           <div className="flex gap-4 flex-wrap">
//             {downloadLinks.docx && (
//               <a
//                 href={downloadLinks.docx}
//                 className="px-5 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 flex items-center gap-2"
//                 download
//               >
//                 <Download size={18} /> DOCX
//               </a>
//             )}
//             {downloadLinks.pdf && (
//               <a
//                 href={downloadLinks.pdf}
//                 className="px-5 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 flex items-center gap-2"
//                 download
//               >
//                 <Download size={18} /> PDF
//               </a>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Letters;
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "../../util/axiosInstance";
import axiosPython from "../../util/axiosPython";
import { Download, Search, X, Sparkles, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

// ------------------------
// TYPES
// ------------------------
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  department?: string;
}

type LetterType =
  | "offer"
  | "termination"
  | "certificate"
  | "experience_ai"
  | "experience_web"
  | "experience_graphic"
  | "";

interface DownloadLinks {
  docx?: string;
  pdf?: string;
}

interface FormDataType {
  [key: string]: string;
}

// ------------------------
// DESIGN TOKENS
// ------------------------
const letterMeta: Record<string, { icon: string; label: string; color: string; bg: string; border: string }> = {
  offer:             { icon: "📄", label: "Offer Letter",                    color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"    },
  termination:       { icon: "❌", label: "Termination Letter",              color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"     },
  certificate:       { icon: "🎓", label: "Certificate",                     color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  experience_ai:     { icon: "🤖", label: "AI/ML Experience Letter",         color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200"  },
  experience_web:    { icon: "💻", label: "Web Dev Experience Letter",       color: "text-sky-700",     bg: "bg-sky-50",     border: "border-sky-200"     },
  experience_graphic:{ icon: "🎨", label: "Graphic Design Experience Letter",color: "text-pink-700",   bg: "bg-pink-50",    border: "border-pink-200"    },
};

const fieldLabels: Record<string, string> = {
  REF: "Reference No.", DATE: "Date", NAME: "Full Name", POSITION: "Position",
  DEPARTMENT: "Department", DURATION: "Duration", STARTDATE: "Start Date",
  SUPNAME: "Supervisor Name", TASKS: "Tasks / Responsibilities",
  FROMANDTODATE: "From & To Date", TYPE: "Type", RESPONSEDATE: "Response Date",
  TERMDATE: "Termination Date", LASTDAY: "Last Working Day",
  ENDDATE: "End Date", EMAIL: "Email",
};

// ------------------------
// COMPONENT
// ------------------------
const Letters: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [letterType, setLetterType] = useState<LetterType>("");
  const [formData, setFormData] = useState<FormDataType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedLinks, setGeneratedLinks] = useState<DownloadLinks | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const fieldsMap: Record<LetterType, string[]> = {
    offer: ["REF","DATE","NAME","POSITION","DEPARTMENT","DURATION","STARTDATE","SUPNAME","TASKS","FROMANDTODATE","TYPE","RESPONSEDATE"],
    termination: ["REF","DATE","NAME","POSITION","TERMDATE","LASTDAY"],
    certificate: ["NAME","POSITION","DURATION"],
    experience_ai: ["REF","DATE","NAME","DURATION","STARTDATE","ENDDATE"],
    experience_web: ["REF","DATE","NAME","DURATION","STARTDATE","ENDDATE"],
    experience_graphic: ["REF","DATE","NAME","DURATION","STARTDATE","ENDDATE"],
    "": [],
  };

  const endpointMap: Record<LetterType, string> = {
    offer: "http://127.0.0.1:8000/generate/offer-letter",
    termination: "http://127.0.0.1:8000/generate/termination-letter",
    certificate: "http://127.0.0.1:8000/generate/certificate",
    experience_ai: "http://127.0.0.1:8000/generate/experience-letter/aiml",
    experience_web: "http://127.0.0.1:8000/generate/experience-letter/webdev",
    experience_graphic: "http://127.0.0.1:8000/generate/experience-letter/graphic-design",
    "": "",
  };

  // ── ALL ORIGINAL LOGIC UNTOUCHED ─────────────────────────────────────────
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employee/");
        setEmployees(res.data.data?.employees || []);
        setFilteredEmployees(res.data.data?.employees || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch employees!");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredEmployees(employees);
    } else {
      const lower = search.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (emp) =>
            emp.firstName?.toLowerCase().includes(lower) ||
            emp.lastName?.toLowerCase().includes(lower) ||
            emp.email?.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, employees]);

  const handleEmployeeSelect = (empId: string) => {
    const emp = employees.find((e) => e._id === empId);
    if (emp) {
      setSelectedEmployee(emp);
      setFormData((prev) => ({
        ...prev,
        NAME: `${emp.firstName} ${emp.lastName}`,
        EMAIL: emp.email,
        POSITION: emp.position || "",
        DEPARTMENT: emp.department || "",
      }));
    }
  };

  const handleLetterTypeChange = (type: LetterType) => {
    setLetterType(type);
    if (!selectedEmployee) return;
    const initialFields: FormDataType = {};
    fieldsMap[type].forEach((f) => {
      switch (f) {
        case "NAME":       initialFields[f] = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`; break;
        case "EMAIL":      initialFields[f] = selectedEmployee.email; break;
        case "POSITION":   initialFields[f] = selectedEmployee.position || ""; break;
        case "DEPARTMENT": initialFields[f] = selectedEmployee.department || ""; break;
        case "DATE":       initialFields[f] = new Date().toISOString().split("T")[0]; break;
        default:           initialFields[f] = "";
      }
    });
    setFormData(initialFields);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const detectInputType = (field: string): string => {
    const lower = field.toLowerCase();
    if (letterType === "offer" && field === "FROMANDTODATE") return "text";
    if (lower.includes("date")) return "date";
    if (lower.includes("email")) return "email";
    if (lower.includes("number") || lower.includes("phone") || lower.includes("cnic")) return "number";
    return "text";
  };

  const handleGenerate = async () => {
    if (!letterType || !selectedEmployee) {
      toast.error("Please select employee and letter type!");
      return;
    }
    setLoading(true);
    setGeneratedLinks(null);
    try {
      const endpoint = endpointMap[letterType];
      if (!endpoint) { toast.error("Invalid letter type!"); setLoading(false); return; }
      const { data } = await axiosPython.post(endpoint, formData);
      setGeneratedLinks({
        docx: data.docx_url ? `http://127.0.0.1:8000${data.docx_url}` : undefined,
        pdf:  data.pdf_url  ? `http://127.0.0.1:8000${data.pdf_url}`  : undefined,
      });
      toast.success("Letter generated successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to generate letter!");
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const selectedMeta = letterType ? letterMeta[letterType] : null;
  const completedFields = letterType ? fieldsMap[letterType].filter((f) => formData[f]?.trim()).length : 0;
  const totalFields     = letterType ? fieldsMap[letterType].length : 0;
  const progress        = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f4f6f9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.97);       } to { opacity:1; transform:scale(1);       } }
        .fade-up  { animation: fadeUp  0.35s ease both; }
        .scale-in { animation: scaleIn 0.15s ease-out both; }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px !important;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="mb-10 fade-up">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">HR Documents</p>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Letter Generator
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">Generate professional HR letters in seconds</p>
        </div>

        {/* ── Step 1: Employee Selection ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5 fade-up overflow-hidden" style={{ animationDelay: "60ms" }}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            <h2 className="font-semibold text-slate-800">Select Employee</h2>
            {selectedEmployee && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle size={13} /> Selected
              </span>
            )}
          </div>

          <div className="p-6">
            {/* Search input with live dropdown */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
              />
              {search && showDropdown && filteredEmployees.length > 0 && (
                <div className="absolute z-20 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto scale-in">
                  {filteredEmployees.map((emp) => (
                    <div
                      key={emp._id}
                      onClick={() => { handleEmployeeSelect(emp._id); setSearch(""); setShowDropdown(false); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition border-b border-slate-50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                      {emp.position && (
                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{emp.position}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fallback dropdown select */}
            <select
              value={selectedEmployee?._id || ""}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
            >
              <option value="">— Select Employee —</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}{emp.position ? ` · ${emp.position}` : ""}
                </option>
              ))}
            </select>

            {/* Selected employee chip */}
            {selectedEmployee && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100" style={{ animation: "fadeUp 0.2s ease both" }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                  <p className="text-xs text-slate-400 truncate">{selectedEmployee.email}</p>
                </div>
                {selectedEmployee.department && (
                  <span className="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                    {selectedEmployee.department}
                  </span>
                )}
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 transition"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Step 2: Letter Type ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5 fade-up overflow-hidden" style={{ animationDelay: "120ms" }}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
            <h2 className="font-semibold text-slate-800">Choose Letter Type</h2>
            {selectedMeta && (
              <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg border ${selectedMeta.bg} ${selectedMeta.color} ${selectedMeta.border}`}>
                {selectedMeta.icon} {selectedMeta.label}
              </span>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.entries(letterMeta) as [LetterType, typeof letterMeta[string]][]).map(([type, meta]) => (
                <button
                  key={type}
                  onClick={() => handleLetterTypeChange(type)}
                  className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    letterType === type
                      ? `${meta.bg} ${meta.border} ${meta.color} shadow-sm`
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="text-xl">{meta.icon}</span>
                  <span className="text-xs font-semibold leading-snug">{meta.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Step 3: Dynamic Fields ── */}
        {letterType && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5 fade-up overflow-hidden" style={{ animationDelay: "180ms" }}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
              <h2 className="font-semibold text-slate-800">Fill Required Details</h2>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-xs text-slate-400">{completedFields}/{totalFields} filled</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fieldsMap[letterType].map((field, i) => (
                  <div key={field} style={{ animation: "fadeUp 0.3s ease both", animationDelay: `${i * 30}ms` }}>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      {fieldLabels[field] || field}
                    </label>
                    <input
                      type={detectInputType(field)}
                      name={field}
                      value={formData[field] || ""}
                      placeholder={`Enter ${fieldLabels[field] || field}`}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Generate Button ── */}
        <div className="flex justify-end mb-6 fade-up" style={{ animationDelay: "240ms" }}>
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedEmployee || !letterType}
            className="inline-flex items-center gap-2.5 px-7 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Letter
              </>
            )}
          </button>
        </div>

        {/* ── Download Card ── */}
        {generatedLinks && (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 fade-up">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                <CheckCircle size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">Letter Ready</h2>
                <p className="text-xs text-slate-400">Choose your preferred format to download</p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {generatedLinks.docx && (
                <a
                  href={generatedLinks.docx}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition shadow-md shadow-blue-600/20"
                >
                  <Download size={15} /> Download DOCX
                </a>
              )}
              {generatedLinks.pdf && (
                <a
                  href={generatedLinks.pdf}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition shadow-md shadow-red-600/20"
                >
                  <Download size={15} /> Download PDF
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Letters;