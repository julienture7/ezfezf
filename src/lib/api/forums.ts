import { prisma } from '@/lib/prisma'
import type { Forum, Post, Comment } from '@prisma/client'

export interface ForumData {
  name: string
  description?: string
  conditionId?: string
  rules?: string
  isPrivate?: boolean
}

export interface PostData {
  forumId: string
  title: string
  content: string
  tags?: string[]
}

export interface CommentData {
  postId: string
  content: string
  parentId?: string
}

export interface ForumWithStats extends Forum {
  posts: Post[]
  _count: {
    posts: number
    memberships: number
  }
}

export interface PostWithDetails extends Post {
  author: {
    name: string
    id: string
  }
  forum: {
    name: string
    id: string
  }
  _count: {
    comments: number
  }
}

// Get all forums
export async function getForums() {
  try {
    const forums = await prisma.forum.findMany({
      include: {
        condition: {
          select: {
            name: true,
            category: true
          }
        },
        _count: {
          select: {
            posts: true,
            memberships: true
          }
        }
      },
      orderBy: {
        memberCount: 'desc'
      }
    })
    return forums
  } catch (error) {
    console.error('Error fetching forums:', error)
    throw new Error('Failed to fetch forums')
  }
}

// Get forum by ID with posts
export async function getForumById(forumId: string) {
  try {
    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
      include: {
        condition: {
          select: {
            name: true,
            category: true
          }
        },
        posts: {
          include: {
            author: {
              select: {
                name: true,
                id: true
              }
            },
            _count: {
              select: {
                comments: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        },
        _count: {
          select: {
            posts: true,
            memberships: true
          }
        }
      }
    })
    return forum
  } catch (error) {
    console.error('Error fetching forum:', error)
    throw new Error('Failed to fetch forum')
  }
}

// Get forum posts with pagination
export async function getForumPosts(forumId: string, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit

    const posts = await prisma.post.findMany({
      where: { forumId },
      include: {
        author: {
          select: {
            name: true,
            id: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    const totalPosts = await prisma.post.count({
      where: { forumId }
    })

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    throw new Error('Failed to fetch forum posts')
  }
}

// Get post by ID with comments
export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
            id: true
          }
        },
        forum: {
          select: {
            name: true,
            id: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                id: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    name: true,
                    id: true
                  }
                }
              }
            }
          },
          where: {
            parentId: null // Only get top-level comments
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    throw new Error('Failed to fetch post')
  }
}

// Create a new forum (admin/moderator only)
export async function createForum(forumData: ForumData) {
  try {
    const forum = await prisma.forum.create({
      data: {
        name: forumData.name,
        description: forumData.description || null,
        conditionId: forumData.conditionId || null,
        rules: forumData.rules || null,
        isPrivate: forumData.isPrivate || false,
        moderatorIds: JSON.stringify([]) // Will be set separately
      }
    })
    return forum
  } catch (error) {
    console.error('Error creating forum:', error)
    throw new Error('Failed to create forum')
  }
}

// Create a new post
export async function createPost(userId: string, postData: PostData) {
  try {
    const post = await prisma.post.create({
      data: {
        forumId: postData.forumId,
        authorId: userId,
        title: postData.title,
        content: postData.content,
        tags: JSON.stringify(postData.tags || [])
      },
      include: {
        author: {
          select: {
            name: true,
            id: true
          }
        },
        forum: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

    // Update forum post count
    await prisma.forum.update({
      where: { id: postData.forumId },
      data: {
        postCount: {
          increment: 1
        }
      }
    })

    return post
  } catch (error) {
    console.error('Error creating post:', error)
    throw new Error('Failed to create post')
  }
}

// Create a new comment
export async function createComment(userId: string, commentData: CommentData) {
  try {
    const comment = await prisma.comment.create({
      data: {
        postId: commentData.postId,
        authorId: userId,
        content: commentData.content,
        parentId: commentData.parentId || null
      },
      include: {
        author: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

    // Update post comment count
    await prisma.post.update({
      where: { id: commentData.postId },
      data: {
        commentCount: {
          increment: 1
        }
      }
    })

    return comment
  } catch (error) {
    console.error('Error creating comment:', error)
    throw new Error('Failed to create comment')
  }
}

// Join a forum
export async function joinForum(userId: string, forumId: string) {
  try {
    // Check if already a member
    const existingMembership = await prisma.forumMembership.findUnique({
      where: {
        forumId_userId: {
          forumId,
          userId
        }
      }
    })

    if (existingMembership) {
      throw new Error('Already a member of this forum')
    }

    const membership = await prisma.forumMembership.create({
      data: {
        forumId,
        userId,
        role: 'member'
      }
    })

    // Update forum member count
    await prisma.forum.update({
      where: { id: forumId },
      data: {
        memberCount: {
          increment: 1
        }
      }
    })

    return membership
  } catch (error) {
    console.error('Error joining forum:', error)
    throw new Error('Failed to join forum')
  }
}

// Leave a forum
export async function leaveForum(userId: string, forumId: string) {
  try {
    await prisma.forumMembership.delete({
      where: {
        forumId_userId: {
          forumId,
          userId
        }
      }
    })

    // Update forum member count
    await prisma.forum.update({
      where: { id: forumId },
      data: {
        memberCount: {
          decrement: 1
        }
      }
    })
  } catch (error) {
    console.error('Error leaving forum:', error)
    throw new Error('Failed to leave forum')
  }
}

// Get user's forum memberships
export async function getUserForumMemberships(userId: string) {
  try {
    const memberships = await prisma.forumMembership.findMany({
      where: { userId },
      include: {
        forum: {
          include: {
            condition: {
              select: {
                name: true,
                category: true
              }
            },
            _count: {
              select: {
                posts: true,
                memberships: true
              }
            }
          }
        }
      },
      orderBy: {
        joinedAt: 'desc'
      }
    })
    return memberships
  } catch (error) {
    console.error('Error fetching user forum memberships:', error)
    throw new Error('Failed to fetch user forum memberships')
  }
}

// Get recent forum activity
export async function getRecentForumActivity(limit = 10) {
  try {
    const recentPosts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            id: true
          }
        },
        forum: {
          select: {
            name: true,
            id: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
    return recentPosts
  } catch (error) {
    console.error('Error fetching recent forum activity:', error)
    throw new Error('Failed to fetch recent forum activity')
  }
}
