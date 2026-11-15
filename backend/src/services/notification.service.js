import { Notification } from "../models/notification.model.js";

export const getNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

export const markAsRead = async (notificationId, userId) => {
  // IDOR Protection: Verify notification belongs to caller
  const query = userId ? { _id: notificationId, userId } : { _id: notificationId };
  return await Notification.findOneAndUpdate(query, { read: true }, { new: true });
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany({ userId }, { read: true });
};

export const clearNotifications = async (userId) => {
  return await Notification.deleteMany({ userId });
};
