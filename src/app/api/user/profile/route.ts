import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        emergencyContact: true,
        allergies: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: {
          select: {
            specialization: true,
            licenseNumber: true,
            verified: true,
            experience: true,
            bio: true,
            clinicAddress: true,
            consultationFee: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
      fullName, 
      dateOfBirth, 
      gender, 
      height, 
      weight, 
      emergencyContact, 
      allergies,
      image,
      doctorProfile 
    } = data

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(height && { height }),
        ...(weight && { weight }),
        ...(emergencyContact && { emergencyContact }),
        ...(allergies && { allergies }),
        ...(image && { image }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        emergencyContact: true,
        allergies: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/user/profile/route.ts << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        emergencyContact: true,
        allergies: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: {
          select: {
            specialization: true,
            licenseNumber: true,
            verified: true,
            experience: true,
            bio: true,
            clinicAddress: true,
            consultationFee: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
      fullName, 
      dateOfBirth, 
      gender, 
      height, 
      weight, 
      emergencyContact, 
      allergies,
      image,
      doctorProfile 
    } = data

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(height && { height }),
        ...(weight && { weight }),
        ...(emergencyContact && { emergencyContact }),
        ...(allergies && { allergies }),
        ...(image && { image }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        gender: true,
        height: true,
        weight: true,
        emergencyContact: true,
        allergies: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
