import { PrismaClient, UserRole, TreatmentType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create symptoms
  const symptoms = [
    { name: 'Headache', description: 'Pain in the head or upper neck' },
    { name: 'Fatigue', description: 'Extreme tiredness or lack of energy' },
    { name: 'Nausea', description: 'Feeling of sickness with inclination to vomit' },
    { name: 'Dizziness', description: 'Feeling unsteady or lightheaded' },
    { name: 'Joint Pain', description: 'Pain in joints and connective tissues' },
    { name: 'Anxiety', description: 'Feeling of worry or unease' },
    { name: 'Sleep Issues', description: 'Difficulty falling or staying asleep' },
    { name: 'Stomach Pain', description: 'Pain in the abdominal area' },
    { name: 'Muscle Tension', description: 'Tightness or stiffness in muscles' },
    { name: 'Mood Changes', description: 'Variations in emotional state' },
    { name: 'Back Pain', description: 'Pain in the back or spine area' },
    { name: 'Chest Pain', description: 'Pain or discomfort in the chest' },
    { name: 'Shortness of Breath', description: 'Difficulty breathing or feeling breathless' },
    { name: 'Brain Fog', description: 'Mental cloudiness or difficulty concentrating' },
    { name: 'Hot Flashes', description: 'Sudden feeling of heat in the body' }
  ]

  for (const symptom of symptoms) {
    await prisma.symptom.upsert({
      where: { name: symptom.name },
      update: {},
      create: symptom
    })
  }

  // Create conditions
  const conditions = [
    {
      name: 'Migraine',
      description: 'A type of headache characterized by severe pain',
      category: 'Neurological',
      symptoms: ['Headache', 'Nausea', 'Dizziness']
    },
    {
      name: 'Chronic Fatigue Syndrome',
      description: 'A complex disorder characterized by extreme fatigue',
      category: 'Immunological',
      symptoms: ['Fatigue', 'Sleep Issues', 'Brain Fog']
    },
    {
      name: 'Fibromyalgia',
      description: 'A disorder characterized by widespread musculoskeletal pain',
      category: 'Rheumatological',
      symptoms: ['Joint Pain', 'Muscle Tension', 'Fatigue']
    },
    {
      name: 'Anxiety Disorder',
      description: 'A mental health disorder characterized by excessive worry',
      category: 'Mental Health',
      symptoms: ['Anxiety', 'Sleep Issues', 'Mood Changes']
    },
    {
      name: 'Irritable Bowel Syndrome',
      description: 'A common disorder affecting the large intestine',
      category: 'Gastrointestinal',
      symptoms: ['Stomach Pain', 'Nausea']
    }
  ]

  for (const condition of conditions) {
    await prisma.condition.upsert({
      where: { name: condition.name },
      update: {},
      create: condition
    })
  }

  // Create treatments
  const treatments = [
    {
      name: 'Sumatriptan',
      type: TreatmentType.MEDICATION,
      description: 'Medication for migraine treatment',
      sideEffects: ['Drowsiness', 'Nausea'],
      contraindications: ['Heart disease', 'Pregnancy']
    },
    {
      name: 'Cognitive Behavioral Therapy',
      type: TreatmentType.THERAPY,
      description: 'Psychological treatment for anxiety and depression',
      sideEffects: [],
      contraindications: []
    },
    {
      name: 'Regular Exercise',
      type: TreatmentType.LIFESTYLE,
      description: 'Physical activity for overall health',
      sideEffects: [],
      contraindications: ['Severe heart conditions']
    },
    {
      name: 'Meditation',
      type: TreatmentType.ALTERNATIVE,
      description: 'Mindfulness practice for stress reduction',
      sideEffects: [],
      contraindications: []
    },
    {
      name: 'Ibuprofen',
      type: TreatmentType.MEDICATION,
      description: 'Anti-inflammatory pain reliever',
      sideEffects: ['Stomach upset', 'Drowsiness'],
      contraindications: ['Kidney disease', 'Blood thinners']
    }
  ]

  for (const treatment of treatments) {
    await prisma.treatment.upsert({
      where: { name: treatment.name },
      update: {},
      create: treatment
    })
  }

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const demoPatient = await prisma.user.upsert({
    where: { email: 'patient@demo.com' },
    update: {},
    create: {
      email: 'patient@demo.com',
      password: hashedPassword,
      name: 'Demo Patient',
      fullName: 'Demo Patient',
      role: UserRole.PATIENT,
      verified: true
    }
  })

  const demoDoctor = await prisma.user.upsert({
    where: { email: 'doctor@demo.com' },
    update: {},
    create: {
      email: 'doctor@demo.com',
      password: hashedPassword,
      name: 'Dr. Smith',
      fullName: 'Dr. Smith',
      role: UserRole.DOCTOR,
      verified: true
    }
  })

  // Create doctor profile
  await prisma.doctorProfile.upsert({
    where: { userId: demoDoctor.id },
    update: {},
    create: {
      userId: demoDoctor.id,
      specialty: 'Neurology',
      licenseNumber: 'MD123456',
      yearsExperience: 10,
      education: 'Harvard Medical School',
      bio: 'Experienced neurologist specializing in migraine and headache disorders.',
      consultationFee: 200.00,
      verifiedDoctor: true
    }
  })

  // Create forums
  const migraineCondition = await prisma.condition.findFirst({ where: { name: 'Migraine' } })
  const anxietyCondition = await prisma.condition.findFirst({ where: { name: 'Anxiety Disorder' } })

  if (migraineCondition) {
    await prisma.forum.upsert({
      where: { name: 'Migraine Support Group' },
      update: {},
      create: {
        name: 'Migraine Support Group',
        description: 'A supportive community for people dealing with migraines',
        conditionId: migraineCondition.id,
        moderatorIds: [demoDoctor.id],
        rules: 'Be respectful and supportive. Share experiences and tips.',
        memberCount: 150,
        postCount: 45
      }
    })
  }

  if (anxietyCondition) {
    await prisma.forum.upsert({
      where: { name: 'Anxiety and Mental Health' },
      update: {},
      create: {
        name: 'Anxiety and Mental Health',
        description: 'Support and discussion for anxiety and mental health',
        conditionId: anxietyCondition.id,
        moderatorIds: [demoDoctor.id],
        rules: 'Respectful discussion only. No medical advice.',
        memberCount: 89,
        postCount: 23
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
