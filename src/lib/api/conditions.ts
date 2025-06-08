import { prisma } from '@/lib/prisma'
import type { Condition, UserCondition } from '@prisma/client'

export interface ConditionData {
  name: string
  description?: string
  category: string
  symptoms?: string[]
}

export interface UserConditionData {
  conditionId: string
  diagnosedDate?: string
  severity?: string
  notes?: string
  isActive?: boolean
}

export interface ConditionWithUserData extends Condition {
  userConditions: UserCondition[]
}

// Get all available conditions
export async function getConditions() {
  try {
    const conditions = await prisma.condition.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return conditions
  } catch (error) {
    console.error('Error fetching conditions:', error)
    throw new Error('Failed to fetch conditions')
  }
}

// Get conditions by category
export async function getConditionsByCategory(category: string) {
  try {
    const conditions = await prisma.condition.findMany({
      where: {
        category: category
      },
      orderBy: {
        name: 'asc'
      }
    })
    return conditions
  } catch (error) {
    console.error('Error fetching conditions by category:', error)
    throw new Error('Failed to fetch conditions by category')
  }
}

// Get user's conditions
export async function getUserConditions(userId: string) {
  try {
    const userConditions = await prisma.userCondition.findMany({
      where: {
        userId: userId
      },
      include: {
        condition: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            symptoms: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return userConditions
  } catch (error) {
    console.error('Error fetching user conditions:', error)
    throw new Error('Failed to fetch user conditions')
  }
}

// Add a condition for a user
export async function addUserCondition(userId: string, conditionData: UserConditionData) {
  try {
    const userCondition = await prisma.userCondition.create({
      data: {
        userId,
        conditionId: conditionData.conditionId,
        diagnosedDate: conditionData.diagnosedDate ? new Date(conditionData.diagnosedDate) : null,
        severity: conditionData.severity || null,
        notes: conditionData.notes || null,
        isActive: conditionData.isActive ?? true,
      },
      include: {
        condition: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            symptoms: true
          }
        }
      }
    })
    return userCondition
  } catch (error) {
    console.error('Error adding user condition:', error)
    throw new Error('Failed to add user condition')
  }
}

// Update a user condition
export async function updateUserCondition(userConditionId: string, updates: Partial<{
  diagnosedDate: Date | null
  severity: string | null
  notes: string | null
  isActive: boolean
}>) {
  try {
    const userCondition = await prisma.userCondition.update({
      where: {
        id: userConditionId
      },
      data: updates,
      include: {
        condition: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            symptoms: true
          }
        }
      }
    })
    return userCondition
  } catch (error) {
    console.error('Error updating user condition:', error)
    throw new Error('Failed to update user condition')
  }
}

// Delete a user condition
export async function deleteUserCondition(userConditionId: string) {
  try {
    await prisma.userCondition.delete({
      where: {
        id: userConditionId
      }
    })
  } catch (error) {
    console.error('Error deleting user condition:', error)
    throw new Error('Failed to delete user condition')
  }
}

// Create a new condition (admin only)
export async function createCondition(conditionData: ConditionData) {
  try {
    const condition = await prisma.condition.create({
      data: {
        name: conditionData.name,
        description: conditionData.description || null,
        category: conditionData.category,
        symptoms: JSON.stringify(conditionData.symptoms || []),
      }
    })
    return condition
  } catch (error) {
    console.error('Error creating condition:', error)
    throw new Error('Failed to create condition')
  }
}

// Get condition statistics for a user
export async function getConditionStats(userId: string) {
  try {
    const userConditions = await prisma.userCondition.findMany({
      where: {
        userId: userId
      },
      include: {
        condition: {
          select: {
            name: true,
            category: true
          }
        }
      }
    })

    const stats = {
      totalConditions: userConditions.length,
      activeConditions: userConditions.filter(uc => uc.isActive).length,
      inactiveConditions: userConditions.filter(uc => !uc.isActive).length,
      categories: {} as Record<string, number>,
      mostRecentDiagnosis: null as string | null,
      oldestDiagnosis: null as string | null
    }

    // Count by category
    userConditions.forEach(uc => {
      const category = uc.condition?.category || 'Unknown'
      stats.categories[category] = (stats.categories[category] || 0) + 1
    })

    // Find date ranges
    const diagnosedConditions = userConditions.filter(uc => uc.diagnosedDate)
    if (diagnosedConditions.length > 0) {
      const dates = diagnosedConditions.map(uc => new Date(uc.diagnosedDate!))
      const mostRecent = new Date(Math.max(...dates.map(d => d.getTime())))
      const oldest = new Date(Math.min(...dates.map(d => d.getTime())))

      stats.mostRecentDiagnosis = mostRecent.toISOString().split('T')[0]
      stats.oldestDiagnosis = oldest.toISOString().split('T')[0]
    }

    return stats
  } catch (error) {
    console.error('Error fetching condition stats:', error)
    throw new Error('Failed to fetch condition statistics')
  }
}

// Get all condition categories
export async function getConditionCategories() {
  try {
    const categories = await prisma.condition.findMany({
      select: {
        category: true
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc'
      }
    })
    return categories.map(c => c.category)
  } catch (error) {
    console.error('Error fetching condition categories:', error)
    throw new Error('Failed to fetch condition categories')
  }
}
