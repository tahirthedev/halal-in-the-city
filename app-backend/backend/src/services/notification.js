const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a notification for a user
 * @param {string} userId - User ID to send notification to
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} data - Additional data
 */
const createNotification = async (userId, type, title, message, data = null) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Send notification to all admins
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} data - Additional data
 */
const notifyAdmins = async (type, title, message, data = null) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', isActive: true },
    });

    const notifications = await Promise.all(
      admins.map((admin) =>
        createNotification(admin.id, type, title, message, data)
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error notifying admins:', error);
    throw error;
  }
};

/**
 * Notify restaurant owner
 * @param {string} restaurantId - Restaurant ID
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} data - Additional data
 */
const notifyRestaurantOwner = async (restaurantId, type, title, message, data = null) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { owner: true },
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const notification = await createNotification(
      restaurant.ownerId,
      type,
      title,
      message,
      data
    );

    return notification;
  } catch (error) {
    console.error('Error notifying restaurant owner:', error);
    throw error;
  }
};

/**
 * Get user notifications
 * @param {string} userId - User ID
 * @param {boolean} unreadOnly - Return only unread notifications
 */
const getUserNotifications = async (userId, unreadOnly = false) => {
  try {
    const where = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID (for authorization)
 */
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 */
const markAllAsRead = async (userId) => {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Get unread notification count
 * @param {string} userId - User ID
 */
const getUnreadCount = async (userId) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  notifyAdmins,
  notifyRestaurantOwner,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
