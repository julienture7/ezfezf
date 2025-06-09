import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  updateUserTreatment,
  deleteUserTreatment
  // UserTreatmentData is not directly used here for Partial, but good to be aware of its structure
} from '@/lib/api/treatments'

// Define a type for the expected update payload, mirroring UserTreatmentData but all optional
interface UserTreatmentUpdateData {
  treatmentId?: string; // Usually not updatable, but depends on business logic
  conditionId?: string; // Usually not updatable
  startDate?: string;
  endDate?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  effectivenessRating?: number | null;
  sideEffectsExperienced?: string[] | null;
  notes?: string | null;
}


export async function PUT(request: NextRequest, { params }: { params: { userTreatmentId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userTreatmentId } = params
    if (!userTreatmentId) {
      return NextResponse.json({ error: 'User Treatment ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const {
        // treatmentId and conditionId are typically not updated.
        // If they were, the UserTreatmentData in the lib would need to allow them in 'updates'.
        startDate,
        endDate,
        dosage,
        frequency,
        effectivenessRating,
        sideEffectsExperienced,
        notes
    } = body as UserTreatmentUpdateData

    if (Object.keys(body).length === 0) {
        return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    // Validate date formats if provided
    if (startDate) { try { new Date(startDate); } catch (e) { return NextResponse.json({ error: 'Invalid startDate format' }, { status: 400 }); } }
    if (endDate) { try { new Date(endDate); } catch (e) { return NextResponse.json({ error: 'Invalid endDate format' }, { status: 400 }); } }


    const updates: Partial<UserTreatmentUpdateData> = {};
    // Only include fields that are present in the request body
    if (startDate !== undefined) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate; // Can be null
    if (dosage !== undefined) updates.dosage = dosage; // Can be null
    if (frequency !== undefined) updates.frequency = frequency; // Can be null
    if (effectivenessRating !== undefined) updates.effectivenessRating = effectivenessRating !== null ? Number(effectivenessRating) : null;
    if (sideEffectsExperienced !== undefined) updates.sideEffectsExperienced = sideEffectsExperienced; // Can be null or empty array
    if (notes !== undefined) updates.notes = notes; // Can be null

    const updatedUserTreatment = await updateUserTreatment(userTreatmentId, session.user.id, updates)
    return NextResponse.json(updatedUserTreatment)
  } catch (error) {
    console.error(`Error updating user treatment ${params.userTreatmentId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('forbidden')) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to update this treatment.' }, { status: 403 })
    }
    if (errorMessage.toLowerCase().includes('not found')) {
      return NextResponse.json({ error: 'User treatment not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update user treatment', details: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userTreatmentId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userTreatmentId } = params
    if (!userTreatmentId) {
      return NextResponse.json({ error: 'User Treatment ID is required' }, { status: 400 })
    }

    await deleteUserTreatment(userTreatmentId, session.user.id)
    return new NextResponse(null, { status: 204 }) // Successfully deleted
  } catch (error) {
    console.error(`Error deleting user treatment ${params.userTreatmentId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('forbidden')) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this treatment.' }, { status: 403 })
    }
    if (errorMessage.toLowerCase().includes('not found')) {
      return NextResponse.json({ error: 'User treatment not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete user treatment', details: errorMessage }, { status: 500 })
  }
}
