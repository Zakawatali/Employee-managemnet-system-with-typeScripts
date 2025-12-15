// import React, { useState, useEffect } from "react";
// import axios from "../../util/axiosInstance"; // Node backend
// import axiosPython from "../../util/axiosPython"; // Python backend
// import { FileText, Download, Send, Search } from "lucide-react";
// import toast from "react-hot-toast";

// export default function Letters() {
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [letterType, setLetterType] = useState("");
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [downloadLinks, setDownloadLinks] = useState(null);
//   const [search, setSearch] = useState("");

//   // 🔹 Fields required for each letter type
//   const fieldsMap = {
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
//   };

//   // 🔹 Backend endpoint mapping
//   const endpointMap = {
//     offer: "http://127.0.0.1:8000/generate/offer-letter",
//     termination: "http://127.0.0.1:8000/generate/termination-letter",
//     certificate: "http://127.0.0.1:8000/generate/certificate",
//     experience_ai: "http://127.0.0.1:8000/generate/experience-letter/aiml",
//     experience_web: "http://127.0.0.1:8000/generate/experience-letter/webdev",
//     experience_graphic: "http://127.0.0.1:8000/generate/experience-letter/graphic-design",
//   };

//   // ✅ Fetch employees (Node backend)
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("/api/employee/");
//         setEmployees(res.data.data?.employees || []);
//         setFilteredEmployees(res.data.data?.employees|| []);
//       } catch (error) {
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
//   const handleEmployeeSelect = (empId) => {
//     const emp = employees.find((e) => e._id === empId);
//     if (emp) {
//       setSelectedEmployee(emp);
//       setFormData((prev) => ({
//         ...prev,
//         NAME: `${emp.firstName} ${emp.lastName}`,
//         EMAIL: emp.email,
//         POSITION: emp.position,
//         DEPARTMENT: emp.department,
//       }));
//     }
//   };

//   // ✅ Letter type selection
//   const handleLetterTypeChange = (type) => {
//     setLetterType(type);
//     if (!selectedEmployee) return;

//     let initialFields = {};
//     fieldsMap[type].forEach((f) => {
//       if (f === "NAME")
//         initialFields[f] = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
//       else if (f === "EMAIL") initialFields[f] = selectedEmployee.email;
//       else if (f === "POSITION") initialFields[f] = selectedEmployee.position;
//       else if (f === "DEPARTMENT") initialFields[f] = selectedEmployee.department;
//       else if (f === "DATE")
//         initialFields[f] = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
//       else initialFields[f] = "";
//     });

//     setFormData(initialFields);
//   };

//   // ✅ Handle field change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Detect input type dynamically
//   const detectInputType = (field) => {
//     const lower = field.toLowerCase();
//     if (letterType === "offer" && field === "FROMANDTODATE") return "text";
//     if (lower.includes("date")) return "date";
//     if (lower.includes("email")) return "email";
//     if (
//       lower.includes("number") ||
//       lower.includes("phone") ||
//       lower.includes("cnic")
//     )
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
//       setDownloadLinks({ docx: `http://127.0.0.1:8000${data.docx_url}` ,pdf: `http://127.0.0.1:8000${data.pdf_url }`});
//       toast.success("Letter generated successfully!");
//     } catch (error) {
//       toast.error(error?.response?.data?.detail || "Failed to generate letter!");
//     } finally {
//       setLoading(false);
//     }
//   };

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
//             onChange={(e) => handleLetterTypeChange(e.target.value)}
//             className="w-full border px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
//           >
//             <option value="">-- Select Letter Type --</option>
//             <option value="offer">📄 Offer Letter</option>
//             <option value="termination">❌ Termination Letter</option>
//             <option value="certificate">🎓 Certificate</option>
//             <option value="experience_ai">🤖 AI/ML Experience Letter</option>
//             <option value="experience_web">💻 Web Dev Experience Letter</option>
//             <option value="experience_graphic">
//               🎨 Graphic Design Experience Letter
//             </option>
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
//                 <label className="block text-gray-600 font-medium mb-1">
//                   {field}
//                 </label>
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
//                href={downloadLinks.docx}
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
// }
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "../../util/axiosInstance"; // Node backend
import axiosPython from "../../util/axiosPython"; // Python backend
import { FileText, Download, Send, Search } from "lucide-react";
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
// COMPONENT
// ------------------------
const Letters: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [letterType, setLetterType] = useState<LetterType>("");
  const [formData, setFormData] = useState<FormDataType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);
  const [search, setSearch] = useState<string>("");

  // 🔹 Fields required for each letter type
  const fieldsMap: Record<LetterType, string[]> = {
    offer: [
      "REF",
      "DATE",
      "NAME",
      "POSITION",
      "DEPARTMENT",
      "DURATION",
      "STARTDATE",
      "SUPNAME",
      "TASKS",
      "FROMANDTODATE",
      "TYPE",
      "RESPONSEDATE",
    ],
    termination: ["REF", "DATE", "NAME", "POSITION", "TERMDATE", "LASTDAY"],
    certificate: ["NAME", "POSITION", "DURATION"],
    experience_ai: ["REF", "DATE", "NAME", "DURATION", "STARTDATE", "ENDDATE"],
    experience_web: ["REF", "DATE", "NAME", "DURATION", "STARTDATE", "ENDDATE"],
    experience_graphic: [
      "REF",
      "DATE",
      "NAME",
      "DURATION",
      "STARTDATE",
      "ENDDATE",
    ],
    "": [],
  };

  // 🔹 Backend endpoint mapping
  const endpointMap: Record<LetterType, string> = {
    offer: "http://127.0.0.1:8000/generate/offer-letter",
    termination: "http://127.0.0.1:8000/generate/termination-letter",
    certificate: "http://127.0.0.1:8000/generate/certificate",
    experience_ai: "http://127.0.0.1:8000/generate/experience-letter/aiml",
    experience_web: "http://127.0.0.1:8000/generate/experience-letter/webdev",
    experience_graphic: "http://127.0.0.1:8000/generate/experience-letter/graphic-design",
    "": "",
  };

  // ✅ Fetch employees (Node backend)
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

  // ✅ Search filter
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

  // ✅ Employee selection
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

  // ✅ Letter type selection
  const handleLetterTypeChange = (type: LetterType) => {
    setLetterType(type);
    if (!selectedEmployee) return;

    let initialFields: FormDataType = {};
    fieldsMap[type].forEach((f) => {
      switch (f) {
        case "NAME":
          initialFields[f] = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
          break;
        case "EMAIL":
          initialFields[f] = selectedEmployee.email;
          break;
        case "POSITION":
          initialFields[f] = selectedEmployee.position || "";
          break;
        case "DEPARTMENT":
          initialFields[f] = selectedEmployee.department || "";
          break;
        case "DATE":
          initialFields[f] = new Date().toISOString().split("T")[0];
          break;
        default:
          initialFields[f] = "";
      }
    });

    setFormData(initialFields);
  };

  // ✅ Handle field change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Detect input type dynamically
  const detectInputType = (field: string): string => {
    const lower = field.toLowerCase();
    if (letterType === "offer" && field === "FROMANDTODATE") return "text";
    if (lower.includes("date")) return "date";
    if (lower.includes("email")) return "email";
    if (lower.includes("number") || lower.includes("phone") || lower.includes("cnic"))
      return "number";
    return "text";
  };

  // ✅ Generate Letter (Python backend with mapping)
  const handleGenerate = async () => {
    if (!letterType || !selectedEmployee) {
      toast.error("Please select employee and letter type!");
      return;
    }
    setLoading(true);
    setDownloadLinks(null);

    try {
      const endpoint = endpointMap[letterType];
      if (!endpoint) {
        toast.error("Invalid letter type!");
        setLoading(false);
        return;
      }

      const { data } = await axiosPython.post(endpoint, formData);
      setDownloadLinks({
        docx: data.docx_url ? `http://127.0.0.1:8000${data.docx_url}` : undefined,
        pdf: data.pdf_url ? `http://127.0.0.1:8000${data.pdf_url}` : undefined,
      });
      toast.success("Letter generated successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to generate letter!");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // JSX
  // ------------------------
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Letter Generator</h1>
      </div>

      {/* 🔎 Searchbar */}
      <div className="relative mb-6">
        <div className="flex items-center border rounded-xl shadow-sm px-4 py-2 bg-white">
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search employee by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>
        {search && (
          <div className="absolute z-10 bg-white border mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {filteredEmployees.map((emp) => (
              <div
                key={emp._id}
                onClick={() => {
                  handleEmployeeSelect(emp._id);
                  setSearch("");
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {emp.firstName} {emp.lastName} - {emp.email}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employee + Letter Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Employee
          </label>
          <select
            value={selectedEmployee?._id || ""}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            className="w-full border px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName} ({emp.position})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Letter Type
          </label>
          <select
            value={letterType}
            onChange={(e) => handleLetterTypeChange(e.target.value as LetterType)}
            className="w-full border px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">-- Select Letter Type --</option>
            <option value="offer">📄 Offer Letter</option>
            <option value="termination">❌ Termination Letter</option>
            <option value="certificate">🎓 Certificate</option>
            <option value="experience_ai">🤖 AI/ML Experience Letter</option>
            <option value="experience_web">💻 Web Dev Experience Letter</option>
            <option value="experience_graphic">🎨 Graphic Design Experience Letter</option>
          </select>
        </div>
      </div>

      {/* Dynamic Fields */}
      {letterType && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Fill Required Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fieldsMap[letterType].map((field) => (
              <div key={field}>
                <label className="block text-gray-600 font-medium mb-1">{field}</label>
                <input
                  type={detectInputType(field)}
                  name={field}
                  value={formData[field] || ""}
                  placeholder={`Enter ${field}`}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-blue-500 text-gray-700"
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Generating..." : "Generate Letter"} <Send size={18} />
        </button>
      </div>

      {/* Download Links */}
      {downloadLinks && (
        <div className="mt-10 bg-gray-50 p-6 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Download Your Letter</h2>
          <div className="flex gap-4 flex-wrap">
            {downloadLinks.docx && (
              <a
                href={downloadLinks.docx}
                className="px-5 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 flex items-center gap-2"
                download
              >
                <Download size={18} /> DOCX
              </a>
            )}
            {downloadLinks.pdf && (
              <a
                href={downloadLinks.pdf}
                className="px-5 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 flex items-center gap-2"
                download
              >
                <Download size={18} /> PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Letters;
