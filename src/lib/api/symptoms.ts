import { prisma } from '@/lib/prisma'
import type { Symptom, UserSymptom } from '@prisma/client'

export interface SymptomLogData {
  symptomId: string
  severity: number
  notes?: string
  triggers?: string[]
  durationMinutes?: number
  loggedAt: string
}

export interface SymptomWithLogs extends Symptom {
  userSymptoms: UserSymptom[]
}

// Get all available symptoms
export async function getSymptoms() {
  try {
    const symptoms = await prisma.symptom.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return symptoms
  } catch (error) {
    console.error('Error fetching symptoms:', error)
    throw new Error('Failed to fetch symptoms')
  }
}

// Get user's symptom logs
export async function getUserSymptomLogs(userId: string, limit = 20) {
  try {
    const logs = await prisma.userSymptom.findMany({
      where: {
        userId: userId
      },
      include: {
        symptom: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        loggedAt: 'desc'
      },
      take: limit
    })
    return logs
  } catch (error) {
    console.error('Error fetching user symptom logs:', error)
    throw new Error('Failed to fetch symptom logs')
  }
}

// Log a new symptom
export async function logSymptom(userId: string, symptomData: SymptomLogData) {
  try {
    const log = await prisma.userSymptom.create({
      data: {
        userId,
        symptomId: symptomData.symptomId,
        severity: symptomData.severity,
        notes: symptomData.notes || null,
        triggers: symptomData.triggers || [],
        durationMinutes: symptomData.durationMinutes || null,
        loggedAt: new Date(symptomData.loggedAt),
      },
      include: {
        symptom: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })
    return log
  } catch (error) {
    console.error('Error logging symptom:', error)
    throw new Error('Failed to log symptom')
  }
}

// Update a symptom log
export async function updateSymptomLog(logId: string, updates: Partial<{
  severity: number
  notes: string | null
  triggers: string[]
  durationMinutes: number | null
  loggedAt: Date
}>) {
  try {
    const log = await prisma.userSymptom.update({
      where: {
        id: logId
      },
      data: updates,
      include: {
        symptom: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })
    return log
  } catch (error) {
    console.error('Error updating symptom log:', error)
    throw new Error('Failed to update symptom log')
  }
}

// Delete a symptom log
export async function deleteSymptomLog(logId: string) {
  try {
    await prisma.userSymptom.delete({
      where: {
        id: logId
      }
    })
  } catch (error) {
    console.error('Error deleting symptom log:', error)
    throw new Error('Failed to delete symptom log')
  }
}

// Get symptom statistics for a user
export async function getSymptomStats(userId: string, days = 30) {
  try {
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)

    const logs = await prisma.userSymptom.findMany({
      where: {
        userId: userId,
        loggedAt: {
          gte: dateFrom
        }
      },
      include: {
        symptom: {
          select: {
            name: true
          }
        }
      }
    })

    // Calculate statistics
    const stats = {
      totalLogs: logs.length,
      averageSeverity: logs.length > 0 ?
        logs.reduce((sum, log) => sum + log.severity, 0) / logs.length : 0,
      mostCommonSymptom: '',
      topTrigger: '',
      todayCount: 0,
    }

    // Find most common symptom
    const symptomCounts: Record<string, number> = {}
    logs.forEach(log => {
      const symptomName = log.symptom?.name || 'Unknown'
      symptomCounts[symptomName] = (symptomCounts[symptomName] || 0) + 1
    })

    stats.mostCommonSymptom = Object.keys(symptomCounts).reduce((a, b) =>
      symptomCounts[a] > symptomCounts[b] ? a : b, '') || 'None'

    // Find most common trigger
    const triggerCounts: Record<string, number> = {}
    logs.forEach(log => {
      log.triggers?.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1
      })
    })

    stats.topTrigger = Object.keys(triggerCounts).reduce((a, b) =>
      triggerCounts[a] > triggerCounts[b] ? a : b, '') || 'None'

    // Count today's logs
    const today = new Date().toDateString()
    stats.todayCount = logs.filter(log =>
      new Date(log.loggedAt).toDateString() === today
    ).length

    return stats
  } catch (error) {
    console.error('Error fetching symptom stats:', error)
    throw new Error('Failed to fetch symptom statistics')
  }
}

// Create a new symptom (admin only)
export async function createSymptom(symptomData: {
  name: string
  description?: string
  severityScale?: string
  measurementUnit?: string
}) {
  try {
    const symptom = await prisma.symptom.create({
      data: {
        name: symptomData.name,
        description: symptomData.description || null,
        severityScale: symptomData.severityScale || '1-10',
        measurementUnit: symptomData.measurementUnit || null,
      }
    })
    return symptom
  } catch (error) {
    console.error('Error creating symptom:', error)
    throw new Error('Failed to create symptom')
  }
}
