import { prisma } from '@/lib/prisma'
import type { MedicationReminder, DayOfWeek } from '@prisma/client' // Assuming DayOfWeek is an enum/type

export interface MedicationReminderData {
  userTreatmentId: string
  reminderTime: string // e.g., "HH:mm" format (string for simplicity, can be Date)
  daysOfWeek: DayOfWeek[] // Prisma enum DayOfWeek: MONDAY, TUESDAY, etc.
  isActive?: boolean      // Default to true
  // userId is not directly in here as it's passed as a separate param to functions
}

export interface MedicationReminderWithDetails extends MedicationReminder {
  userTreatment: {
    id: string
    treatment: {
      name: string
    }
    // Add other fields from userTreatment if needed
  }
}

// Get all medication reminders for a user
export async function getUserMedicationReminders(userId: string): Promise<MedicationReminderWithDetails[]> {
  try {
    const reminders = await prisma.medicationReminder.findMany({
      where: {
        userTreatment: {
          userId: userId
        }
      },
      include: {
        userTreatment: {
          select: {
            id: true,
            treatment: { // Assuming relation from UserTreatment to Treatment
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        reminderTime: 'asc' // Ensure reminderTime is stored in a sortable format (e.g., "HH:mm")
      }
    })
    return reminders as MedicationReminderWithDetails[] // Cast if Prisma type doesn't fully match
  } catch (error) {
    console.error(`Error fetching medication reminders for user ${userId}:`, error)
    throw new Error('Failed to fetch medication reminders')
  }
}

// Create a new medication reminder
export async function createMedicationReminder(userId: string, data: MedicationReminderData): Promise<MedicationReminder> {
  try {
    // Validate userTreatmentId belongs to userId
    const userTreatment = await prisma.userTreatment.findFirst({
      where: {
        id: data.userTreatmentId,
        userId: userId
      }
    })
    if (!userTreatment) {
      throw new Error('User treatment not found or does not belong to the user')
    }

    // Validate daysOfWeek if it's an enum array
    if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
        throw new Error('Days of week must be provided for the reminder.')
    }
    // Potentially validate values against DayOfWeek enum if not automatically handled by Prisma/TS

    const newReminder = await prisma.medicationReminder.create({
      data: {
        userTreatmentId: data.userTreatmentId,
        reminderTime: data.reminderTime, // Ensure this is a string like "HH:mm" or a proper Date object
        daysOfWeek: data.daysOfWeek,     // Prisma expects enum values if DayOfWeek is an enum
        isActive: data.isActive !== undefined ? data.isActive : true, // Default to true
      }
    })
    return newReminder
  } catch (error) {
    console.error('Error creating medication reminder:', error)
    if (error instanceof Error && error.message.includes('User treatment not found')) {
        throw error;
    }
    throw new Error('Failed to create medication reminder')
  }
}

// Update an existing medication reminder
export async function updateMedicationReminder(
  reminderId: string,
  userId: string, // To verify ownership
  data: Partial<MedicationReminderData>
): Promise<MedicationReminder | null> {
  try {
    // Ensure reminder belongs to userId
    const existingReminder = await prisma.medicationReminder.findFirst({
      where: {
        id: reminderId,
        userTreatment: {
          userId: userId
        }
      }
    })

    if (!existingReminder) {
      throw new Error('Medication reminder not found or user not authorized')
    }

    // If userTreatmentId is being updated, validate the new one also belongs to the user
    if (data.userTreatmentId && data.userTreatmentId !== existingReminder.userTreatmentId) {
        const userTreatment = await prisma.userTreatment.findFirst({
            where: {
                id: data.userTreatmentId,
                userId: userId
            }
        });
        if (!userTreatment) {
            throw new Error('New user treatment not found or does not belong to the user');
        }
    }


    const updatedReminder = await prisma.medicationReminder.update({
      where: {
        id: reminderId
      },
      data: {
        ...(data.userTreatmentId && { userTreatmentId: data.userTreatmentId }),
        ...(data.reminderTime && { reminderTime: data.reminderTime }),
        ...(data.daysOfWeek && { daysOfWeek: data.daysOfWeek }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      }
    })
    return updatedReminder
  } catch (error) {
    console.error(`Error updating medication reminder ${reminderId}:`, error)
     if (error instanceof Error && (error.message.includes('not found or user not authorized') || error.message.includes('New user treatment not found'))) {
        throw error;
    }
    throw new Error('Failed to update medication reminder')
  }
}

// Delete a medication reminder
export async function deleteMedicationReminder(reminderId: string, userId: string): Promise<void> {
  try {
    // Ensure reminder belongs to userId before deleting
    const reminder = await prisma.medicationReminder.findFirst({
      where: {
        id: reminderId,
        userTreatment: {
          userId: userId
        }
      }
    })

    if (!reminder) {
      throw new Error('Medication reminder not found or user not authorized')
    }

    await prisma.medicationReminder.delete({
      where: {
        id: reminderId
      }
    })
  } catch (error) {
    console.error(`Error deleting medication reminder ${reminderId}:`, error)
    if (error instanceof Error && error.message.includes('not found or user not authorized')) {
        throw error;
    }
    throw new Error('Failed to delete medication reminder')
  }
}
