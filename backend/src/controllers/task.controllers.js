import { Task } from '../models/task.models.js';
import { Subtask } from '../models/subtask.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

// Helper to get Socket.IO instance
const getIo = (req) => req.app.get('io');

const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId }).populate("assignedTo", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks fetched successfully")
    );
});

const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    const attachments = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadedFile = await uploadToCloudinary(file.path);
            if (uploadedFile) {
                attachments.push({
                    url: uploadedFile.url,
                    mimetype: file.mimetype,
                    size: file.size
                });
            }
        }
    }

    const task = await Task.create({
        title,
        description,
        project: projectId,
        assignedTo,
        status: status || "todo",
        attachments
    });

    // Broadcast task creation to project room
    const io = getIo(req);
    if (io) {
        const populatedTask = await Task.findById(task._id).populate("assignedTo", "username avatar");
        io.to(`project:${projectId}`).emit('task-created', {
            task: populatedTask,
            createdBy: {
                _id: req.user._id,
                username: req.user.username
            },
            timestamp: new Date().toISOString()
        });
    }

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    );
});

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("assignedTo", "username avatar");
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const subtasks = await Subtask.find({ task: taskId });

    return res.status(200).json(
        new ApiResponse(200, { task, subtasks }, "Task details fetched successfully")
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: { title, description, assignedTo, status }
        },
        { new: true }
    );

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Broadcast task update to project room
    const io = getIo(req);
    if (io) {
        io.to(`project:${task.project}`).emit('task-updated', {
            taskId: task._id,
            updates: { title, description, assignedTo, status },
            updatedBy: {
                _id: req.user._id,
                username: req.user.username
            },
            timestamp: new Date().toISOString()
        });
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await Subtask.deleteMany({ task: taskId });

    // Broadcast task deletion to project room
    const io = getIo(req);
    if (io) {
        io.to(`project:${task.project}`).emit('task-deleted', {
            taskId: task._id,
            deletedBy: {
                _id: req.user._id,
                username: req.user.username
            },
            timestamp: new Date().toISOString()
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Task deleted successfully")
    );
});

const createSubtask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    const subtask = await Subtask.create({
        title,
        task: taskId,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, subtask, "Subtask created successfully")
    );
});

const updateSubtask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;
    const { title, isCompleted } = req.body;
    const role = req.projectMember?.role;

    const dataToUpdate = {};
    if (isCompleted !== undefined) dataToUpdate.isCompleted = isCompleted;

    // Only allow title updates for admin and project-admin
    if (role === "admin" || role === "project-admin") {
        if (title !== undefined) dataToUpdate.title = title;
    }

    const subtask = await Subtask.findByIdAndUpdate(
        subTaskId,
        { $set: dataToUpdate },
        { new: true }
    );

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    return res.status(200).json(
        new ApiResponse(200, subtask, "Subtask updated successfully")
    );
});

const deleteSubtask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;

    const subtask = await Subtask.findByIdAndDelete(subTaskId);
    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Subtask deleted successfully")
    );
});

export {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    deleteSubtask
};
