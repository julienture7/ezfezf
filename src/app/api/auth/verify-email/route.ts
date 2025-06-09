import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'node:crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, token } = body

    if (action === 'send') {
      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { error: 'Email already verified' },
          { status: 400 }
        )
      }

      // Store verification token
      await prisma.user.update({
        where: { email },
        data: {
          emailVerificationToken: verificationToken,
          emailVerificationExpiry: expiresAt
        }
      })

      // In a real app, you would send an email here
      console.log(`Verification link: ${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`)

      return NextResponse.json({
        message: 'Verification email sent successfully'
      })

    } else if (action === 'verify') {
      // Verify email with token
      if (!token) {
        return NextResponse.json(
          { error: 'Verification token is required' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
          emailVerificationExpiry: {
            gt: new Date()
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired verification token' },
          { status: 400 }
        )
      }

      // Mark email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpiry: null
        }
      })

      return NextResponse.json({
        message: 'Email verified successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in email verification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
