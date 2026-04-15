import { ProjectNote } from '../models/note.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

// Helper to get Socket.IO instance
const getIo = (req) => req.app.get('io');

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const notes = await ProjectNote.find({ project: projectId }).populate("createdBy", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, notes, "Notes fetched successfully")
    );
});

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, content } = req.body;

    const note = await ProjectNote.create({
        title,
        content,
        project: projectId,
        createdBy: req.user._id
    });

    // Broadcast note creation to project room
    const io = getIo(req);
    if (io) {
        const populatedNote = await ProjectNote.findById(note._id).populate("createdBy", "username avatar");
        io.to(`project:${projectId}`).emit('note-created', {
            note: populatedNote,
            createdBy: {
                _id: req.user._id,
                username: req.user.username
            },
            timestamp: new Date().toISOString()
        });
    }

    return res.status(201).json(
        new ApiResponse(201, note, "Note created successfully")
    );
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await ProjectNote.findById(noteId).populate("createdBy", "username avatar");
    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(200, note, "Note details fetched successfully")
    );
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;

    const note = await ProjectNote.findByIdAndUpdate(
        noteId,
        { $set: { title, content } },
        { new: true }
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // Broadcast note update to project room
    const io = getIo(req);
    if (io) {
        io.to(`project:${note.project}`).emit('note-updated', {
            noteId: note._id,
            updates: { title, content },
            updatedBy: {
                _id: req.user._id,
                username: req.user.username
            },
            timestamp: new Date().toISOString()
        });
    }

    return res.status(200).json(
        new ApiResponse(200, note, "Note updated successfully")
    );
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await ProjectNote.findByIdAndDelete(noteId);
    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    // Broadcast note deletion to project room
    const io = getIo(req);
    if (io) {
        io.to(`project:${note.project}`).emit('note-deleted', {
            noteId: note._id,
            deletedBy: {
                _id: req.user._id,
                username: req.user.username
            },
            timestamp: new Date().toISOString()
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Note deleted successfully")
    );
});

export {
    getNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote
};
