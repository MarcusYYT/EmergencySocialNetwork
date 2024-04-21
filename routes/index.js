import express from 'express';
import pageRoutes from "./pageRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import statusRoutes from "./statusRoutes.js";
import privatePostRoutes from "./privatePostRoutes.js";
import announcementRoutes from "./announcementRoutes.js";
import threadRoutes from "./threadRoutes.js";
import threadPostRoutes from "./threadPostRoutes.js";
import emergencyContactRoutes from "./emergencyContactRoutes.js";
import searchRoutes from "./searchRoutes.js";
import testRoute from "./testRoutes.js";
import preferenceRoute from "./preferenceRoutes.js";
import subscriberRoutes from "./subscriberRoutes.js";
import resourceRoutes from "./resourceRoutes.js";
import socketRoutes from "./socketRoutes.js";
const router = express.Router();

router.use('', pageRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/status', statusRoutes)
router.use('/privatePosts', privatePostRoutes)
router.use('/announcements', announcementRoutes)
router.use('/threads', threadRoutes)
router.use('/threadPosts', threadPostRoutes)
router.use('/emergencyContacts', emergencyContactRoutes);
router.use('/search', searchRoutes)
router.use('/test', testRoute);
router.use('/preference', preferenceRoute);
router.use('/subscribers', subscriberRoutes);
router.use('/resource', resourceRoutes);
router.use('/sockets', socketRoutes);

export default router;