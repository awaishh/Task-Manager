import { Router } from "express";
import { 
    getTasks, 
    createTask, 
    getTaskById, 
    updateTask, 
    deleteTask, 
    createSubtask, 
    updateSubtask, 
    deleteSubtask 
} from '../controllers/task.controllers.js';
import { verifyJWT, checkProjectRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createTaskValidator } from "../validators/index.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/:projectId")
    .get(checkProjectRole(["admin", "project-admin", "member"]), getTasks)
    .post(checkProjectRole(["admin", "project-admin"]), upload.array("attachments", 5), createTaskValidator(), validate, createTask);

router.route("/:projectId/t/:taskId")
    .get(checkProjectRole(["admin", "project-admin", "member"]), getTaskById)
    .put(checkProjectRole(["admin", "project-admin"]), createTaskValidator(), validate, updateTask)
    .delete(checkProjectRole(["admin", "project-admin"]), deleteTask);

router.route("/:projectId/t/:taskId/subtasks")
    .post(checkProjectRole(["admin", "project-admin"]), createSubtask);

router.route("/:projectId/st/:subTaskId")
    .put(checkProjectRole(["admin", "project-admin", "member"]), updateSubtask)
    .delete(checkProjectRole(["admin", "project-admin"]), deleteSubtask);

export default router;
