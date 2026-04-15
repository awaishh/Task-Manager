import User from '../models/user.models.js'
import { Project } from '../models/project.models.js'
import { ProjectMember } from '../models/projectmember.models.js'
import { ApiResponse } from '../utils/api-response.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import mongoose from "mongoose"
import QRCode from 'qrcode'


const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "projectDetails"
            }
        },
        {
            $unwind: "$projectDetails"
        },
        {
            $project: {
                _id: "$projectDetails._id",
                name: "$projectDetails.name",
                description: "$projectDetails.description",
                role: 1,
                createdAt: "$projectDetails.createdAt"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, projects, "Projects fetched successfully")
    );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user is a member
    const member = await ProjectMember.findOne({
        project: projectId,
        user: req.user._id
    });

    if (!member) {
        throw new ApiError(403, "You are not a member of this project");
    }

    return res.status(200).json(
        new ApiResponse(200, { ...project.toObject(), role: member.role }, "Project details fetched successfully")
    );
});

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const existedProject = await Project.findOne({ name });
    if (existedProject) {
        throw new ApiError(409, "Project with this name already exists");
    }

    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id
    });

    await ProjectMember.create({
        user: req.user._id,
        project: project._id,
        role: "admin"
    });

    return res.status(201).json(
        new ApiResponse(201, project, "Project created successfully")
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await Project.findByIdAndUpdate(
        projectId,
        { $set: { name, description } },
        { new: true }
    );

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(200, project, "Project updated successfully")
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Delete all members and tasks associated with the project
    await ProjectMember.deleteMany({ project: projectId });
    // Note: Task deletion will be handled in task controller logic or here if preferred
    // For now, let's keep it simple and just do members.

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const members = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                _id: "$userDetails._id",
                username: "$userDetails.username",
                email: "$userDetails.email",
                role: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, members, "Members fetched successfully")
    );
});

const addMemberToProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { email, role } = req.body;

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
        throw new ApiError(404, "User with this email not found");
    }

    const existedMember = await ProjectMember.findOne({
        project: projectId,
        user: userToAdd._id
    });

    if (existedMember) {
        throw new ApiError(409, "User is already a member of this project");
    }

    const member = await ProjectMember.create({
        user: userToAdd._id,
        project: projectId,
        role: role || "member"
    });

    return res.status(201).json(
        new ApiResponse(201, member, "Member added successfully")
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const { role } = req.body;

    const member = await ProjectMember.findOneAndUpdate(
        { project: projectId, user: userId },
        { $set: { role } },
        { new: true }
    );

    if (!member) {
        throw new ApiError(404, "Member not found in this project");
    }

    return res.status(200).json(
        new ApiResponse(200, member, "Member role updated successfully")
    );
});

const removeMemberFromProject = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    const member = await ProjectMember.findOneAndDelete({
        project: projectId,
        user: userId
    });

    if (!member) {
        throw new ApiError(404, "Member not found in this project");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Member removed successfully")
    );
});

const generateProjectQRCode = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user is a member
    const member = await ProjectMember.findOne({
        project: projectId,
        user: req.user._id
    });

    if (!member) {
        throw new ApiError(403, "You are not a member of this project");
    }

    // Generate a unique join code if not exists
    if (!project.joinCode) {
        project.joinCode = `JOIN_${projectId}_${Date.now()}`;
        await project.save();
    }

    // Create join URL
    const joinUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${project.joinCode}`;

    // Generate QR code as base64
    const qrCodeDataUrl = await QRCode.toDataURL(joinUrl, {
        width: 300,
        margin: 2,
        color: {
            dark: '#5300b7',  // Your primary purple
            light: '#ffffff'
        }
    });

    return res.status(200).json(
        new ApiResponse(200, {
            qrCode: qrCodeDataUrl,
            joinCode: project.joinCode,
            joinUrl: joinUrl,
            projectName: project.name
        }, "QR code generated successfully")
    );
});

const joinProjectByCode = asyncHandler(async (req, res) => {
    const { joinCode } = req.params;

    if (!joinCode) {
        throw new ApiError(400, "Join code is required");
    }

    const project = await Project.findOne({ joinCode });
    if (!project) {
        throw new ApiError(404, "Invalid join code");
    }

    // Check if already a member
    const existingMember = await ProjectMember.findOne({
        project: project._id,
        user: req.user._id
    });

    if (existingMember) {
        throw new ApiError(409, "You are already a member of this project");
    }

    // Add user as member with default role
    const member = await ProjectMember.create({
        user: req.user._id,
        project: project._id,
        role: "member"
    });

    // Notify project room via socket
    const io = req.app.get('io');
    if (io) {
        io.to(`project:${project._id}`).emit('user-joined-project', {
            userId: req.user._id,
            username: req.user.username,
            joinedVia: 'qr-code'
        });
    }

    return res.status(201).json(
        new ApiResponse(201, {
            project: {
                _id: project._id,
                name: project.name,
                description: project.description
            },
            member
        }, "Successfully joined project")
    );
});

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectMembers,
    addMemberToProject,
    updateMemberRole,
    removeMemberFromProject,
    generateProjectQRCode,
    joinProjectByCode
};
