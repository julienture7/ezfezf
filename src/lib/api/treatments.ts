import { prisma } from '@/lib/prisma'
import type { Treatment, UserTreatment, TreatmentType } from '@prisma/client'

export interface TreatmentData {
  name: string
  type: TreatmentType
  description?: string
  sideEffects?: string[]
  contraindications?: string[]
}

export interface UserTreatmentData {
  treatmentId: string
  conditionId: string
  startDate: string
  endDate?: string
  dosage?: string
  frequency?: string
  effectivenessRating?: number
  sideEffectsExperienced?: string[]
  notes?: string
}

export interface TreatmentWithUserData extends Treatment {
  userTreatments: UserTreatment[]
}

// Get all available treatments
export async function getTreatments() {
  try {
    const treatments = await prisma.treatment.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return treatments
  } catch (error) {
    console.error('Error fetching treatments:', error)
    throw new Error('Failed to fetch treatments')
  }
}

// Get user's treatments
export async function getUserTreatments(userId: string) {
  try {
    const userTreatments = await prisma.userTreatment.findMany({
      where: {
        userId: userId
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
      },
      orderBy: {
        startDate: 'desc'
      }
    })
    return userTreatments
  } catch (error) {
    console.error('Error fetching user treatments:', error)
    throw new Error('Failed to fetch user treatments')
  }
}

// Add a treatment for a user
export async function addUserTreatment(userId: string, treatmentData: UserTreatmentData) {
  try {
    const userTreatment = await prisma.userTreatment.create({
      data: {
        userId,
        treatmentId: treatmentData.treatmentId,
        conditionId: treatmentData.conditionId,
        startDate: new Date(treatmentData.startDate),
        endDate: treatmentData.endDate ? new Date(treatmentData.endDate) : null,
        dosage: treatmentData.dosage || null,
        frequency: treatmentData.frequency || null,
        effectivenessRating: treatmentData.effectivenessRating || null,
        sideEffectsExperienced: JSON.stringify(treatmentData.sideEffectsExperienced || []),
        notes: treatmentData.notes || null,
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
    return userTreatment
  } catch (error) {
    console.error('Error adding user treatment:', error)
    throw new Error('Failed to add user treatment')
  }
}

// Update a user treatment
export async function updateUserTreatment(userTreatmentId: string, userId: string, updates: Partial<{
  endDate: Date | null
  dosage: string | null
  frequency: string | null
  effectivenessRating: number | null
  sideEffectsExperienced: string[]
  notes: string | null
}>) {
  try {
    const userTreatment = await prisma.userTreatment.findUnique({
      where: { id: userTreatmentId }
    });

    if (!userTreatment) {
      throw new Error('User treatment not found');
    }

    if (userTreatment.userId !== userId) {
      throw new Error('Forbidden: User not authorized to update this treatment');
    }

    const updatedData: any = { ...updates }
    if (updates.sideEffectsExperienced) {
      updatedData.sideEffectsExperienced = JSON.stringify(updates.sideEffectsExperienced)
    }

    const updatedUserTreatment = await prisma.userTreatment.update({
      where: {
        id: userTreatmentId
      },
      data: updatedData,
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
    return updatedUserTreatment
  } catch (error) {
    console.error('Error updating user treatment:', error)
    if (error instanceof Error && (error.message.includes('User treatment not found') || error.message.includes('Forbidden'))) {
      throw error;
    }
    throw new Error('Failed to update user treatment')
  }
}

// Delete a user treatment
export async function deleteUserTreatment(userTreatmentId: string, userId: string) {
  try {
    const userTreatment = await prisma.userTreatment.findUnique({
      where: { id: userTreatmentId }
    });

    if (!userTreatment) {
      throw new Error('User treatment not found');
    }

    if (userTreatment.userId !== userId) {
      throw new Error('Forbidden: User not authorized to delete this treatment');
    }

    await prisma.userTreatment.delete({
      where: {
        id: userTreatmentId
      }
    })
  } catch (error) {
    console.error('Error deleting user treatment:', error)
    if (error instanceof Error && (error.message.includes('User treatment not found') || error.message.includes('Forbidden'))) {
      throw error;
    }
    throw new Error('Failed to delete user treatment')
  }
}

// Create a new treatment (admin only)
export async function createTreatment(treatmentData: TreatmentData) {
  try {
    const treatment = await prisma.treatment.create({
      data: {
        name: treatmentData.name,
        type: treatmentData.type,
        description: treatmentData.description || null,
        sideEffects: JSON.stringify(treatmentData.sideEffects || []),
        contraindications: JSON.stringify(treatmentData.contraindications || []),
      }
    })
    return treatment
  } catch (error) {
    console.error('Error creating treatment:', error)
    throw new Error('Failed to create treatment')
  }
}

// Get treatment statistics for a user
export async function getTreatmentStats(userId: string) {
  try {
    const userTreatments = await prisma.userTreatment.findMany({
      where: {
        userId: userId
      },
      include: {
        treatment: {
          select: {
            name: true,
            type: true
          }
        }
      }
    })

    const stats = {
      totalTreatments: userTreatments.length,
      activeTreatments: userTreatments.filter(ut => !ut.endDate).length,
      completedTreatments: userTreatments.filter(ut => ut.endDate).length,
      averageEffectiveness: 0,
      mostEffectiveTreatment: '',
      treatmentTypes: {} as Record<string, number>
    }

    // Calculate average effectiveness
    const ratedTreatments = userTreatments.filter(ut => ut.effectivenessRating !== null)
    if (ratedTreatments.length > 0) {
      stats.averageEffectiveness = ratedTreatments.reduce((sum, ut) =>
        sum + (ut.effectivenessRating || 0), 0) / ratedTreatments.length
    }

    // Find most effective treatment
    const mostEffective = userTreatments.reduce((prev, current) =>
      (current.effectivenessRating || 0) > (prev.effectivenessRating || 0) ? current : prev,
      userTreatments[0])
    stats.mostEffectiveTreatment = mostEffective?.treatment?.name || 'None'

    // Count treatment types
    userTreatments.forEach(ut => {
      const type = ut.treatment?.type || 'UNKNOWN'
      stats.treatmentTypes[type] = (stats.treatmentTypes[type] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error('Error fetching treatment stats:', error)
    throw new Error('Failed to fetch treatment statistics')
  }
}
