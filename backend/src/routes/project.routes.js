import { Router } from "express";
import {
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
} from '../controllers/project.controllers.js';
import { verifyJWT, checkProjectRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator, addMemberValidator } from "../validators/index.js";

const router = Router();

// All project routes require authentication
router.use(verifyJWT);

router.route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject);

router.route("/:projectId")
    .get(getProjectById)
    .put(checkProjectRole(["admin"]), createProjectValidator(), validate, updateProject)
    .delete(checkProjectRole(["admin"]), deleteProject);

// QR code route (requires membership)
router.route("/:projectId/qr")
    .get(checkProjectRole(["admin", "project-admin", "member"]), generateProjectQRCode);

router.route("/:projectId/members")
    .get(checkProjectRole(["admin", "project-admin", "member"]), getProjectMembers)
    .post(checkProjectRole(["admin"]), addMemberValidator(), validate, addMemberToProject);

router.route("/:projectId/members/:userId")
    .put(checkProjectRole(["admin"]), addMemberValidator(), validate, updateMemberRole)
    .delete(checkProjectRole(["admin"]), removeMemberFromProject);

// Join by code (public route for QR scan)
router.post("/join/:joinCode", verifyJWT, joinProjectByCode);

export default router;
