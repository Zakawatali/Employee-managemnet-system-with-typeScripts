"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskService = exports.updateTaskService = exports.getTaskByIdService = exports.getAllTaskService = exports.CreatetaskService = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const taskRepositories_1 = require("../repositories/taskRepositories");
const CreatetaskService = async (task) => {
    const { userid, title, description, priority, dueDate, assignTo } = task;
    const createTask = new Task_1.default({
        title,
        description,
        createdBy: userid,
        priority,
        dueDate,
        assignTo,
    });
    return (0, taskRepositories_1.CreatetaskRepo)(createTask);
};
exports.CreatetaskService = CreatetaskService;
const getAllTaskService = async () => {
    return (0, taskRepositories_1.getalltaskRepo)();
};
exports.getAllTaskService = getAllTaskService;
const getTaskByIdService = async (id) => {
    return (0, taskRepositories_1.getTaskByIdRepo)(id);
};
exports.getTaskByIdService = getTaskByIdService;
const taskRepository = __importStar(require("../repositories/taskRepositories"));
const updateTaskService = async (taskId, updatePayload, user) => {
    // 1. Fetch Task from Repository
    const task = await taskRepository.findTaskById(taskId);
    if (!task) {
        throw new Error("Task not found");
    }
    // 2. Apply Business Logic and Authorization Checks
    if (user.role === "Employee") {
        // Check if the Employee is authorized (assigned to this task)
        if (task.assignTo.toString() !== user._id.toString()) {
            throw new Error("Not authorized to update this task");
        }
        // Employees are only allowed to update the 'status' field
        if (updatePayload.status) {
            task.status = updatePayload.status;
        }
    }
    else {
        // Manager/Admin roles can update any field via Object.assign
        Object.assign(task, updatePayload);
    }
    // 3. Save updated task via Repository
    const updatedTask = await taskRepository.saveTask(task);
    return updatedTask;
};
exports.updateTaskService = updateTaskService;
// Delete Task
const deleteTaskService = async (taskId) => {
    // Database interaction via Repository
    const deletedTask = await (0, taskRepositories_1.deleteTaskById)(taskId);
    if (!deletedTask) {
        // Business logic: Task must exist to be deleted
        throw new Error("Task not found");
    }
    return deletedTask;
};
exports.deleteTaskService = deleteTaskService;
