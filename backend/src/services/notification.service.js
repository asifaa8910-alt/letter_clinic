import { Notification } from "../models/notification.model.js";

export const getNotifications = async (userId) => {
  return await Notification.find({ userId });
};

export const markAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany({ userId }, { read: true });
};

export const clearNotifications = async (userId) => {
  return await Notification.deleteMany({ userId });
};
