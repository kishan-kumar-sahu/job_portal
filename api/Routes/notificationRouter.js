import express from "express";

import {
  createNotification,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";


import { userAuth } from "../Middleware/userAuth.js";
import { requireRole } from "../Middleware/requireRole.js";

const  router = express.Router();


// Get logged-in user's notifications
router.get("/my", userAuth,getMyNotifications );


// Mark one notification as read
router.patch("/:id/read", userAuth, markNotificationAsRead);


// Mark all notifications as read
router.patch( "/read-all",userAuth, markAllNotificationsAsRead);


// Create notification
router.post("/", userAuth, requireRole("admin"), createNotification);

export default  router;



