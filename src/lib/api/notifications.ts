import { prisma } from '@/lib/prisma'
import type { Notification, NotificationType } from '@prisma/client'

export interface NotificationData {
  userId: string
  title: string
  content: string
  type: NotificationType // Assuming NotificationType is an enum in your Prisma schema
  referenceId?: string // Optional: e.g., ID of related message, appointment, etc.
  // isRead is typically false by default on creation, handled by Prisma schema
}

export interface NotificationWithDetails extends Notification {
  // Define if you need to include related data when fetching notifications
  // For example, if referenceId points to a User or Appointment, you might want to include that.
}

// Get notifications for a user
export async function getUserNotifications(
  userId: string,
  filters?: {
    isRead?: boolean
    type?: NotificationType
  }
): Promise<Notification[]> {
  try {
    const whereClause: any = { userId }

    if (filters?.isRead !== undefined) {
      whereClause.isRead = filters.isRead
    }
    if (filters?.type) {
      whereClause.type = filters.type
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
      // Add includes here if NotificationWithDetails needs related data
    })
    return notifications
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error)
    throw new Error('Failed to fetch notifications')
  }
}

// Create a new notification
export async function createNotification(data: NotificationData): Promise<Notification> {
  try {
    // Ensure user exists (optional, depends on how userId is sourced)
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
        throw new Error(`User with ID ${data.userId} not found.`);
    }

    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        type: data.type,
        referenceId: data.referenceId,
        isRead: false, // Default to unread
      }
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    // Check for specific Prisma errors if needed, e.g., foreign key constraint
    throw new Error('Failed to create notification')
  }
}

// Mark a specific notification as read
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<Notification | null> {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId // Ensure the notification belongs to the user
      }
    })

    if (!notification) {
      // Can throw an error or return null based on desired behavior for "not found or not authorized"
      throw new Error('Notification not found or user not authorized')
    }

    if (notification.isRead) {
      return notification; // Already read, no update needed
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId
        // userId check already done above
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })
    return updatedNotification
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error)
    if (error instanceof Error && error.message.includes('Notification not found or user not authorized')) {
        throw error;
    }
    throw new Error('Failed to mark notification as read')
  }
}

// Mark all unread notifications for a user as read
export async function markAllNotificationsAsRead(userId: string): Promise<{ count: number }> {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })
    return result // result contains a 'count' of updated records
  } catch (error) {
    console.error(`Error marking all notifications as read for user ${userId}:`, error)
    throw new Error('Failed to mark all notifications as read')
  }
}
