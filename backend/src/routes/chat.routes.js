import { Router } from 'express';
import {
    getChatMessages,
    sendChatMessage,
    deleteChatMessage
} from '../controllers/chat.controllers.js';
import { verifyJWT, checkProjectRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/:projectId')
    .get(getChatMessages)
    .post(checkProjectRole(['admin', 'project-admin', 'member']), sendChatMessage);

router.delete('/:projectId/:messageId', checkProjectRole(['admin', 'project-admin', 'member']), deleteChatMessage);

export default router;
