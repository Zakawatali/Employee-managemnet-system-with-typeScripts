

import React, { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
type LeaveAction = "Approved" | "Rejected";

interface EmployeeInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Leave {
  _id: string;
  employee?: EmployeeInfo;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  days?: number;
  status: LeaveStatus;
  createdAt: string;
}

const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  // ✅ Fetch all leave requests
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/leaves");
      const payload = res.data?.data;
      const list: Leave[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.leaves)
        ? payload.leaves
        : [];
      setLeaves(list);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  const deleteLeave = async (id: string) => {
    try {
      const res = await axios.delete(`/api/leaves/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Leave deleted successfully");
        setLeaves((prev) => prev.filter((leave) => leave._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete leave");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Error deleting leave");
      console.error("Error deleting leave:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

 

  // ✅ Update leave status
  const updateStatus = async (id: string, status: "Approved" | "Rejected") => {
    try {
      if (status === "Approved") {
        await axios.put(`/api/leaves/approve/${id}`);
      } else if (status === "Rejected") {
        await axios.put(`/api/leaves/reject/${id}`);
      }

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status: status.toUpperCase() as Leave["status"] } : leave
        )
      );
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  // ✅ Stats
  const stats = {
    total: leaves.length,
    approved: leaves.filter((l) => l.status === "APPROVED").length,
    pending: leaves.filter((l) => l.status === "PENDING").length,
    rejected: leaves.filter((l) => l.status === "REJECTED").length,
  };

  // ✅ Sort leaves
  const sortedLeaves = [...leaves].sort((a, b) => {
    const order: Record<LeaveStatus, number> = {
      PENDING: 1,
      APPROVED: 2,
      REJECTED: 3,
      CANCELLED: 4,
    };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Leave <span className="text-blue-600">Management</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor and take actions on employee leave requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
          <FileText className="text-blue-600" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
          <CheckCircle className="text-green-600" size={32} />
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-xl font-bold">{stats.approved}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
          <Clock className="text-yellow-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold">{stats.pending}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition">
          <XCircle className="text-red-600" size={32} />
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Leave Table */}
      <div className="p-6 rounded-xl shadow-sm bg-white border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          All Leave Requests
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : sortedLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-12">
            <FileText size={50} className="mb-3 text-gray-400" />
            <p className="text-lg">No leave requests available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className={`border-b hover:bg-gray-50 transition ${
                      leave.status === "PENDING" ? "bg-yellow-50/40" : ""
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </td>
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3 text-gray-600">
                      {new Date(leave.startDate).toLocaleDateString()} →{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-600">{leave.reason}</td>
                    <td className="p-3 text-gray-600">{leave.days}</td>
                    <td
                      className={`p-3 font-semibold ${
                        leave.status === "APPROVED"
                          ? "text-green-600"
                          : leave.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => updateStatus(leave._id, "Approved")}
                        disabled={leave.status === "APPROVED"}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(leave._id, "Rejected")}
                        disabled={leave.status === "REJECTED"}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => deleteLeave(leave._id)}
                        className="px-3 py-1 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelectedLeave(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Leave Details
            </h3>

            <div className="space-y-3 text-gray-700 text-sm">
              <p>
                <strong>Employee:</strong>{" "}
                {selectedLeave.employee?.firstName}{" "}
                {selectedLeave.employee?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedLeave.employee?.email}
              </p>
              <p>
                <strong>Leave Type:</strong> {selectedLeave.leaveType}
              </p>
              <p>
                <strong>Period:</strong>{" "}
                {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
                {new Date(selectedLeave.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Days:</strong> {selectedLeave.days}
              </p>
              <p>
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    selectedLeave.status === "APPROVED"
                      ? "text-green-600"
                      : selectedLeave.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedLeave.status}
                </span>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedLeave.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedLeave(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              {selectedLeave.status !== "APPROVED" && (
                <button
                  onClick={() => {
                    updateStatus(selectedLeave._id, "Approved");
                    setSelectedLeave(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              )}
              {selectedLeave.status !== "REJECTED" && (
                <button
                  onClick={() => {
                    updateStatus(selectedLeave._id, "Rejected");
                    setSelectedLeave(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => {
                  deleteLeave(selectedLeave._id);
                  setSelectedLeave(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
