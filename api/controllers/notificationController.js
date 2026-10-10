import { Notification } from "../models/Notification.js";




export const createNotification = async (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      relatedId,
    } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, type, title and message are required",
      });
    }

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Error in createNotification:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user;

    const notifications = await Notification.find({
      userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error in getMyNotifications:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// MARK NOTIFICATION AS READ


export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// MARK ALL NOTIFICATIONS AS READ


export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user;

    const result = await Notification.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "Error in markAllNotificationsAsRead:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};