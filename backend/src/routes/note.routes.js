import { Router } from "express";
import { 
    getNotes, 
    createNote, 
    getNoteById, 
    updateNote, 
    deleteNote 
} from '../controllers/note.controllers.js';
import { verifyJWT, checkProjectRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createNoteValidator } from "../validators/index.js";

const router = Router();

router.use(verifyJWT);

router.route("/:projectId")
    .get(checkProjectRole(["admin", "project-admin", "member"]), getNotes)
    .post(checkProjectRole(["admin"]), createNoteValidator(), validate, createNote);

router.route("/:projectId/n/:noteId")
    .get(checkProjectRole(["admin", "project-admin", "member"]), getNoteById)
    .put(checkProjectRole(["admin"]), createNoteValidator(), validate, updateNote)
    .delete(checkProjectRole(["admin"]), deleteNote);

export default router;
