import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createSampleUserData() {
  console.log('Creating sample user data...')

  // Find the demo patient
  const demoPatient = await prisma.user.findFirst({
    where: { email: 'patient@demo.com' }
  })

  if (!demoPatient) {
    console.error('Demo patient not found')
    return
  }

  console.log('Found demo patient:', demoPatient.id)

  // Get some symptoms, treatments, and conditions
  const headacheSymptom = await prisma.symptom.findFirst({ where: { name: 'Headache' } })
  const fatigueSymptom = await prisma.symptom.findFirst({ where: { name: 'Fatigue' } })
  const anxietySymptom = await prisma.symptom.findFirst({ where: { name: 'Anxiety' } })

  const migraineCondition = await prisma.condition.findFirst({ where: { name: 'Migraine' } })
  const anxietyCondition = await prisma.condition.findFirst({ where: { name: 'Anxiety Disorder' } })

  const sumatriptanTreatment = await prisma.treatment.findFirst({ where: { name: 'Sumatriptan' } })
  const meditationTreatment = await prisma.treatment.findFirst({ where: { name: 'Meditation' } })

  if (!headacheSymptom || !migraineCondition || !sumatriptanTreatment) {
    console.error('Required data not found')
    return
  }

  // Add user conditions
  try {
    await prisma.userCondition.create({
      data: {
        userId: demoPatient.id,
        conditionId: migraineCondition.id,
        diagnosedDate: new Date('2024-01-15'),
        severity: 'Moderate',
        notes: 'Chronic migraines, mostly stress-related',
        isActive: true
      }
    })
    console.log('Added migraine condition')
  } catch (error) {
    console.log('Migraine condition already exists or error:', error)
  }

  if (anxietyCondition) {
    try {
      await prisma.userCondition.create({
        data: {
          userId: demoPatient.id,
          conditionId: anxietyCondition.id,
          diagnosedDate: new Date('2024-02-01'),
          severity: 'Mild',
          notes: 'Generalized anxiety, manageable with therapy',
          isActive: true
        }
      })
      console.log('Added anxiety condition')
    } catch (error) {
      console.log('Anxiety condition already exists or error:', error)
    }
  }

  // Add user treatments
  try {
    await prisma.userTreatment.create({
      data: {
        userId: demoPatient.id,
        treatmentId: sumatriptanTreatment.id,
        conditionId: migraineCondition.id,
        startDate: new Date('2024-02-01'),
        dosage: '50mg',
        frequency: 'As needed',
        effectivenessRating: 8,
        sideEffectsExperienced: JSON.stringify(['Mild drowsiness']),
        notes: 'Very effective for severe migraines'
      }
    })
    console.log('Added Sumatriptan treatment')
  } catch (error) {
    console.log('Sumatriptan treatment already exists or error:', error)
  }

  if (meditationTreatment && anxietyCondition) {
    try {
      await prisma.userTreatment.create({
        data: {
          userId: demoPatient.id,
          treatmentId: meditationTreatment.id,
          conditionId: anxietyCondition.id,
          startDate: new Date('2024-01-20'),
          dosage: '15 minutes',
          frequency: 'Daily',
          effectivenessRating: 7,
          sideEffectsExperienced: JSON.stringify([]),
          notes: 'Helps with daily stress management'
        }
      })
      console.log('Added Meditation treatment')
    } catch (error) {
      console.log('Meditation treatment already exists or error:', error)
    }
  }

  // Add symptom logs
  const symptomLogs = [
    {
      symptomId: headacheSymptom.id,
      severity: 7,
      triggers: JSON.stringify(['Stress', 'Screen Time']),
      durationMinutes: 120,
      notes: 'Severe headache after long work session',
      loggedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      symptomId: headacheSymptom.id,
      severity: 5,
      triggers: JSON.stringify(['Weather']),
      durationMinutes: 90,
      notes: 'Mild headache, weather change',
      loggedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ]

  if (fatigueSymptom) {
    symptomLogs.push({
      symptomId: fatigueSymptom.id,
      severity: 6,
      triggers: JSON.stringify(['Sleep', 'Work']),
      durationMinutes: 240,
      notes: 'Tired after poor sleep',
      loggedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    })
  }

  if (anxietySymptom) {
    symptomLogs.push({
      symptomId: anxietySymptom.id,
      severity: 4,
      triggers: JSON.stringify(['Social Situations']),
      durationMinutes: 60,
      notes: 'Anxiety before meeting',
      loggedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    })
  }

  for (const log of symptomLogs) {
    try {
      await prisma.userSymptom.create({
        data: {
          userId: demoPatient.id,
          ...log
        }
      })
      console.log('Added symptom log:', log.notes)
    } catch (error) {
      console.log('Symptom log already exists or error:', error)
    }
  }

  // Add an appointment
  const demoDoctor = await prisma.user.findFirst({
    where: { email: 'doctor@demo.com' }
  })

  if (demoDoctor) {
    try {
      await prisma.appointment.create({
        data: {
          patientId: demoPatient.id,
          doctorId: demoDoctor.id,
          title: 'Migraine Follow-up',
          description: 'Regular check-up for migraine treatment',
          appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          durationMinutes: 30,
          status: 'SCHEDULED',
          type: 'IN_PERSON',
          location: 'Main Office',
          notes: 'Bring medication log'
        }
      })
      console.log('Added appointment')
    } catch (error) {
      console.log('Appointment already exists or error:', error)
    }
  }

  console.log('Sample user data creation completed!')
}

createSampleUserData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
