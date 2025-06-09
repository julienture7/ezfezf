import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getUserMedicationReminders,
  createMedicationReminder,
  MedicationReminderData
} from '@/lib/api/reminders'
import type { DayOfWeek } from '@prisma/client' // Import DayOfWeek if it's an enum

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reminders = await getUserMedicationReminders(session.user.id)
    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Error fetching medication reminders:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: 'Failed to fetch medication reminders', details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // Ensure body matches MedicationReminderData from src/lib/api/reminders.ts
    const { userTreatmentId, reminderTime, daysOfWeek, isActive } = body as MedicationReminderData

    // Basic validation
    if (!userTreatmentId || !reminderTime || !daysOfWeek || !Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid required fields: userTreatmentId (string), reminderTime (string HH:mm), daysOfWeek (array)' }, { status: 400 })
    }

    if (!/^\d{2}:\d{2}$/.test(reminderTime)) {
        return NextResponse.json({ error: 'Invalid reminderTime format. Use HH:mm.' }, { status: 400 });
    }

    // Optional: Validate elements of daysOfWeek against DayOfWeek enum if not automatically handled
    // For example:
    // const validDays = Object.values(DayOfWeek);
    // if (!daysOfWeek.every(day => validDays.includes(day))) {
    //    return NextResponse.json({ error: 'Invalid values in daysOfWeek array' }, { status: 400 });
    // }


    const reminderData: MedicationReminderData = {
      userTreatmentId,
      reminderTime,
      daysOfWeek, // Prisma will validate enum values
      isActive: isActive !== undefined ? isActive : true
    }

    const newReminder = await createMedicationReminder(session.user.id, reminderData)
    return NextResponse.json(newReminder, { status: 201 })
  } catch (error) {
    console.error('Error creating medication reminder:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('user treatment not found')) {
      return NextResponse.json({ error: 'User treatment not found or does not belong to the user' }, { status: 404 })
    }
    if (errorMessage.toLowerCase().includes('days of week must be provided')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
    // Handle Prisma validation errors for enum if they occur, e.g. P2003 or specific validation errors
    return NextResponse.json({ error: 'Failed to create medication reminder', details: errorMessage }, { status: 500 })
  }
}
