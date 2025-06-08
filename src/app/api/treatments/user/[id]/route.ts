import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateUserTreatment, deleteUserTreatment } from '@/lib/api/treatments'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userTreatment = await prisma.userTreatment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        treatment: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true
          }
        },
        condition: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    if (!userTreatment) {
      return NextResponse.json(
        { error: 'User treatment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(userTreatment)
  } catch (error) {
    console.error('Error fetching user treatment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user treatment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership
    const existingTreatment = await prisma.userTreatment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingTreatment) {
      return NextResponse.json(
        { error: 'User treatment not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { endDate, dosage, frequency, effectivenessRating, sideEffectsExperienced, notes } = body

    const updates: any = {}
    if (endDate !== undefined) updates.endDate = endDate ? new Date(endDate) : null
    if (dosage !== undefined) updates.dosage = dosage
    if (frequency !== undefined) updates.frequency = frequency
    if (effectivenessRating !== undefined) updates.effectivenessRating = effectivenessRating
    if (sideEffectsExperienced !== undefined) updates.sideEffectsExperienced = sideEffectsExperienced
    if (notes !== undefined) updates.notes = notes

    const userTreatment = await updateUserTreatment(params.id, updates)
    return NextResponse.json(userTreatment)
  } catch (error) {
    console.error('Error updating user treatment:', error)
    return NextResponse.json(
      { error: 'Failed to update user treatment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership
    const existingTreatment = await prisma.userTreatment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingTreatment) {
      return NextResponse.json(
        { error: 'User treatment not found' },
        { status: 404 }
      )
    }

    await deleteUserTreatment(params.id)
    return NextResponse.json({ message: 'User treatment deleted successfully' })
  } catch (error) {
    console.error('Error deleting user treatment:', error)
    return NextResponse.json(
      { error: 'Failed to delete user treatment' },
      { status: 500 }
    )
  }
}
