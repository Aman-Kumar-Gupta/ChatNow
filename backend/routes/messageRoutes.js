import express from 'express';
import { protectRoutes } from '../middleware/auth.js';
import { getUsersForSidebar } from '../controllers/messageController.js';
import { getMessages, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';


const messageRouter = express.Router();


messageRouter.get('/users',protectRoutes, getUsersForSidebar);
messageRouter.get('/:id',protectRoutes, getMessages);
messageRouter.put('/mark/:id',protectRoutes, markMessageAsSeen);
messageRouter.post('/send/:id',protectRoutes, sendMessage);

export default messageRouter;