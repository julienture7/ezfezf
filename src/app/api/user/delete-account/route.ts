import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password, confirmText } = await request.json()

    // Verify the user typed "DELETE" to confirm
    if (confirmText !== 'DELETE') {
      return NextResponse.json({
        error: 'You must type "DELETE" to confirm account deletion'
      }, { status: 400 })
    }

    // Get the user to verify password for credential accounts
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, email: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If user has a password (credential account), verify it
    if (user.password) {
      if (!password) {
        return NextResponse.json({
          error: 'Password is required for account deletion'
        }, { status: 400 })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({
          error: 'Incorrect password'
        }, { status: 400 })
      }
    }

    // Delete all user data (CASCADE will handle most relations)
    await prisma.user.delete({
      where: { id: session.user.id }
    })

    return NextResponse.json({
      message: 'Account successfully deleted'
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({
      error: 'Failed to delete account'
    }, { status: 500 })
  }
}
