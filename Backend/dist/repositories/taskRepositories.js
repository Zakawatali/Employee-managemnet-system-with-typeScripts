"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskById = exports.saveTask = exports.findTaskById = exports.getTaskByIdRepo = exports.getalltaskRepo = exports.CreatetaskRepo = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const CreatetaskRepo = async (newTask) => {
    await newTask.save();
    return newTask;
};
exports.CreatetaskRepo = CreatetaskRepo;
const getalltaskRepo = async () => {
    return Task_1.default.find()
        .populate("createdBy", "firstName lastName email")
        .populate("assignTo", "firstName lastName email");
};
exports.getalltaskRepo = getalltaskRepo;
const getTaskByIdRepo = async (id) => {
    const tasks = await Task_1.default.find({ assignTo: id })
        .populate("createdBy", "firstName lastName email")
        .populate("assignTo", "firstName lastName email");
    return tasks;
};
exports.getTaskByIdRepo = getTaskByIdRepo;
const findTaskById = async (taskId) => {
    // Direct interaction with the Mongoose model
    return Task_1.default.findById(taskId);
};
exports.findTaskById = findTaskById;
const saveTask = async (task) => {
    // Direct interaction with the Mongoose document method
    return task.save();
};
exports.saveTask = saveTask;
const deleteTaskById = async (taskId) => {
    return Task_1.default.findByIdAndDelete(taskId);
};
exports.deleteTaskById = deleteTaskById;
