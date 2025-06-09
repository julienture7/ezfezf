import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, token, action = 'send' } = await request.json()

    if (action === 'send') {
      // Send verification email
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      // Check if user exists
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

      // Generate verification token
      const verificationToken = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours

      // Store token in database
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: verificationToken,
          expires: expiresAt,
        }
      })

      // In a real application, you would send an email here
      // For now, we'll just return the token for testing
      return NextResponse.json({
        message: 'Verification email sent',
        token: verificationToken // Remove this in production
      })

    } else if (action === 'verify') {
      // Verify email with token
      if (!email || !token) {
        return NextResponse.json(
          { error: 'Email and token are required' },
          { status: 400 }
        )
      }

      // Find and validate token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: {
          token,
          identifier: email,
        }
      })

      if (!verificationToken) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
        )
      }

      if (verificationToken.expires < new Date()) {
        // Delete expired token
        await prisma.verificationToken.delete({
          where: { token }
        })
        return NextResponse.json(
          { error: 'Token has expired' },
          { status: 400 }
        )
      }

      // Update user email verification status
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: new Date(),
        }
      })

      // Delete used token
      await prisma.verificationToken.delete({
        where: { token }
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
      { error: 'Failed to process email verification' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/auth/verify-email/route.ts << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, token, action = 'send' } = await request.json()

    if (action === 'send') {
      // Send verification email
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      // Check if user exists
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

      // Generate verification token
      const verificationToken = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours

      // Store token in database
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: verificationToken,
          expires: expiresAt,
        }
      })

      // In a real application, you would send an email here
      // For now, we'll just return the token for testing
      return NextResponse.json({
        message: 'Verification email sent',
        token: verificationToken // Remove this in production
      })

    } else if (action === 'verify') {
      // Verify email with token
      if (!email || !token) {
        return NextResponse.json(
          { error: 'Email and token are required' },
          { status: 400 }
        )
      }

      // Find and validate token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: {
          token,
          identifier: email,
        }
      })

      if (!verificationToken) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
        )
      }

      if (verificationToken.expires < new Date()) {
        // Delete expired token
        await prisma.verificationToken.delete({
          where: { token }
        })
        return NextResponse.json(
          { error: 'Token has expired' },
          { status: 400 }
        )
      }

      // Update user email verification status
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: new Date(),
        }
      })

      // Delete used token
      await prisma.verificationToken.delete({
        where: { token }
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
      { error: 'Failed to process email verification' },
      { status: 500 }
    )
  }
}
