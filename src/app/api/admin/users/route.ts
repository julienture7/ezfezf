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

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    const whereClause: any = {}

    if (role) {
      whereClause.role = role
    }

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: {
          select: {
            specialization: true,
            verified: true,
            licenseNumber: true,
          }
        },
        _count: {
          select: {
            patientAppointments: true,
            doctorAppointments: true,
            userConditions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.user.count({
      where: whereClause
    })

    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/admin/users/route.ts << 'EOF'
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

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    const whereClause: any = {}

    if (role) {
      whereClause.role = role
    }

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        doctorProfile: {
          select: {
            specialization: true,
            verified: true,
            licenseNumber: true,
          }
        },
        _count: {
          select: {
            patientAppointments: true,
            doctorAppointments: true,
            userConditions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.user.count({
      where: whereClause
    })

    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
