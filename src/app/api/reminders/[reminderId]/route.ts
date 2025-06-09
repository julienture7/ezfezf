import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  updateMedicationReminder,
  deleteMedicationReminder,
  type MedicationReminderData // For Partial type
} from '@/lib/api/reminders'
import type { DayOfWeek } from '@prisma/client' // Assuming DayOfWeek enum

export async function PUT(request: NextRequest, { params }: { params: { reminderId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reminderId } = params
    if (!reminderId) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { userTreatmentId, reminderTime, daysOfWeek, isActive } = body as Partial<MedicationReminderData>

    // Basic validation for provided fields
    if (Object.keys(body).length === 0) {
        return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }
    if (reminderTime && !/^\d{2}:\d{2}$/.test(reminderTime)) {
        return NextResponse.json({ error: 'Invalid reminderTime format. Use HH:mm.' }, { status: 400 });
    }
    if (daysOfWeek && (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0)) {
        return NextResponse.json({ error: 'daysOfWeek must be a non-empty array' }, { status: 400 });
    }
    // Optional: Validate elements of daysOfWeek against DayOfWeek enum

    const updateData: Partial<MedicationReminderData> = {};
    if (userTreatmentId !== undefined) updateData.userTreatmentId = userTreatmentId;
    if (reminderTime !== undefined) updateData.reminderTime = reminderTime;
    if (daysOfWeek !== undefined) updateData.daysOfWeek = daysOfWeek;
    if (isActive !== undefined) updateData.isActive = isActive;


    const updatedReminder = await updateMedicationReminder(reminderId, session.user.id, updateData)
    return NextResponse.json(updatedReminder)
  } catch (error) {
    console.error(`Error updating medication reminder ${params.reminderId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('not found or user not authorized')) {
      return NextResponse.json({ error: 'Medication reminder not found or access denied' }, { status: 404 })
    }
    if (errorMessage.toLowerCase().includes('new user treatment not found')) {
        return NextResponse.json({ error: 'New user treatment not found or does not belong to the user'}, { status: 404})
    }
    return NextResponse.json({ error: 'Failed to update medication reminder', details: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { reminderId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reminderId } = params
    if (!reminderId) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 })
    }

    await deleteMedicationReminder(reminderId, session.user.id)
    return new NextResponse(null, { status: 204 }) // Successfully deleted, no content
  } catch (error) {
    console.error(`Error deleting medication reminder ${params.reminderId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('not found or user not authorized')) {
      return NextResponse.json({ error: 'Medication reminder not found or access denied' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete medication reminder', details: errorMessage }, { status: 500 })
  }
}
