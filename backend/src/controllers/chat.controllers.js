import { ChatMessage } from '../models/chatMessage.models.js';
import { ProjectMember } from '../models/projectmember.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

const getIo = (req) => req.app.get('io');

const getChatMessages = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { limit = 50, before } = req.query;

    const query = { project: projectId };
    if (before) {
        query.createdAt = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(query)
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(200, messages.reverse(), "Messages fetched successfully")
    );
});

const sendChatMessage = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Message content is required");
    }

    // Verify user is a member
    const member = await ProjectMember.findOne({
        project: projectId,
        user: req.user._id
    });

    if (!member) {
        throw new ApiError(403, "You are not a member of this project");
    }

    const message = await ChatMessage.create({
        project: projectId,
        sender: req.user._id,
        content: content.trim()
    });

    const populatedMessage = await ChatMessage.findById(message._id)
        .populate('sender', 'username avatar');

    // Broadcast to project room
    const io = getIo(req);
    if (io) {
        io.to(`project:${projectId}`).emit('chat-message', {
            message: populatedMessage,
            timestamp: new Date().toISOString()
        });
    }

    return res.status(201).json(
        new ApiResponse(201, populatedMessage, "Message sent successfully")
    );
});

const deleteChatMessage = asyncHandler(async (req, res) => {
    const { projectId, messageId } = req.params;

    const message = await ChatMessage.findOneAndDelete({
        _id: messageId,
        project: projectId,
        sender: req.user._id
    });

    if (!message) {
        throw new ApiError(404, "Message not found or unauthorized");
    }

    // Broadcast deletion
    const io = getIo(req);
    if (io) {
        io.to(`project:${projectId}`).emit('chat-message-deleted', {
            messageId: message._id,
            deletedBy: req.user._id,
            timestamp: new Date().toISOString()
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Message deleted successfully")
    );
});

export {
    getChatMessages,
    sendChatMessage,
    deleteChatMessage
};
