import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const date = searchParams.get('date')

    const whereClause: any = {
      userId: session.user.id
    }

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    let reminders = await prisma.medicationReminder.findMany({
      where: whereClause,
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by date if provided
    if (date) {
      const targetDate = new Date(date)
      reminders = reminders.filter(reminder => {
        const reminderTimes = JSON.parse(reminder.reminderTimes)
        return reminderTimes.some((time: string) => {
          const reminderDateTime = new Date(targetDate)
          const [hours, minutes] = time.split(':')
          reminderDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
          return reminderDateTime.toDateString() === targetDate.toDateString()
        })
      })
    }

    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      medicationId,
      dosage,
      frequency,
      reminderTimes,
      startDate,
      endDate,
      instructions,
      isActive = true
    } = data

    // Validate required fields
    if (!medicationId || !dosage || !frequency || !reminderTimes || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: medicationId, dosage, frequency, reminderTimes, startDate' },
        { status: 400 }
      )
    }

    // Verify medication exists
    const medication = await prisma.treatment.findUnique({
      where: { id: medicationId }
    })

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      )
    }

    // Create reminder
    const reminder = await prisma.medicationReminder.create({
      data: {
        userId: session.user.id,
        medicationId,
        dosage,
        frequency,
        reminderTimes: JSON.stringify(reminderTimes),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        instructions,
        isActive,
      },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true,
          }
        }
      }
    })

    return NextResponse.json(reminder, { status: 201 })
  } catch (error) {
    console.error('Error creating reminder:', error)
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/reminders/route.ts << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const date = searchParams.get('date')

    const whereClause: any = {
      userId: session.user.id
    }

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    let reminders = await prisma.medicationReminder.findMany({
      where: whereClause,
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by date if provided
    if (date) {
      const targetDate = new Date(date)
      reminders = reminders.filter(reminder => {
        const reminderTimes = JSON.parse(reminder.reminderTimes)
        return reminderTimes.some((time: string) => {
          const reminderDateTime = new Date(targetDate)
          const [hours, minutes] = time.split(':')
          reminderDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
          return reminderDateTime.toDateString() === targetDate.toDateString()
        })
      })
    }

    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      medicationId,
      dosage,
      frequency,
      reminderTimes,
      startDate,
      endDate,
      instructions,
      isActive = true
    } = data

    // Validate required fields
    if (!medicationId || !dosage || !frequency || !reminderTimes || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: medicationId, dosage, frequency, reminderTimes, startDate' },
        { status: 400 }
      )
    }

    // Verify medication exists
    const medication = await prisma.treatment.findUnique({
      where: { id: medicationId }
    })

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      )
    }

    // Create reminder
    const reminder = await prisma.medicationReminder.create({
      data: {
        userId: session.user.id,
        medicationId,
        dosage,
        frequency,
        reminderTimes: JSON.stringify(reminderTimes),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        instructions,
        isActive,
      },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true,
          }
        }
      }
    })

    return NextResponse.json(reminder, { status: 201 })
  } catch (error) {
    console.error('Error creating reminder:', error)
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}
