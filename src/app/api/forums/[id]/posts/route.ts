import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: forumId } = params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get('limit') || '20')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    // Verify forum exists
    const forum = await prisma.forum.findUnique({
      where: { id: forumId }
    })

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      )
    }

    // Get posts for the forum
    const posts = await prisma.post.findMany({
      where: { forumId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.post.count({
      where: { forumId }
    })

    return NextResponse.json({
      posts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: forumId } = params
    const data = await request.json()
    const { title, content, tags } = data

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      )
    }

    // Verify forum exists and user has access
    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
      include: {
        memberships: {
          where: { userId: session.user.id }
        }
      }
    })

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      )
    }

    // Check if forum is private and user is member
    if (forum.isPrivate && forum.memberships.length === 0) {
      return NextResponse.json(
        { error: 'Access denied - Forum membership required' },
        { status: 403 }
      )
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        forumId,
        authorId: session.user.id,
        tags: tags ? JSON.stringify(tags) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      }
    })

    // Update forum post count
    await prisma.forum.update({
      where: { id: forumId },
      data: {
        postCount: { increment: 1 }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > "src/app/api/forums/[id]/posts/route.ts" << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: forumId } = params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get('limit') || '20')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    // Verify forum exists
    const forum = await prisma.forum.findUnique({
      where: { id: forumId }
    })

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      )
    }

    // Get posts for the forum
    const posts = await prisma.post.findMany({
      where: { forumId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.post.count({
      where: { forumId }
    })

    return NextResponse.json({
      posts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: forumId } = params
    const data = await request.json()
    const { title, content, tags } = data

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      )
    }

    // Verify forum exists and user has access
    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
      include: {
        memberships: {
          where: { userId: session.user.id }
        }
      }
    })

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      )
    }

    // Check if forum is private and user is member
    if (forum.isPrivate && forum.memberships.length === 0) {
      return NextResponse.json(
        { error: 'Access denied - Forum membership required' },
        { status: 403 }
      )
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        forumId,
        authorId: session.user.id,
        tags: tags ? JSON.stringify(tags) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      }
    })

    // Update forum post count
    await prisma.forum.update({
      where: { id: forumId },
      data: {
        postCount: { increment: 1 }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
