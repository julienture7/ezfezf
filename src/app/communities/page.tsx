'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  MessageSquare,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Heart,
  Star,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface Forum {
  id: string
  name: string
  description: string | null
  memberCount: number
  postCount: number
  isPrivate: boolean
  condition?: {
    name: string
    category: string
  }
  _count: {
    posts: number
    memberships: number
  }
  createdAt: string
}

export default function CommunitiesPage() {
  const [forums, setForums] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await fetch('/api/forums')
        if (response.ok) {
          const data = await response.json()
          setForums(data)
        }
      } catch (error) {
        console.error('Error fetching forums:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchForums()
  }, [])

  const filteredForums = forums.filter(forum => {
    const matchesSearch = forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (forum.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' ||
                           forum.condition?.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(forums.map(f => f.condition?.category).filter(Boolean)))

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Loading communities...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Communities</h1>
          <p className="mt-2 text-gray-600">
            Connect with others, share experiences, and find support in our health communities.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forums.length}</div>
            <p className="text-xs text-muted-foreground">Active communities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forums.reduce((total, forum) => total + forum.memberCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Community members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forums.reduce((total, forum) => total + forum.postCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Community posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forums.length > 0 ?
                forums.reduce((prev, current) =>
                  prev.postCount > current.postCount ? prev : current
                ).name.slice(0, 12) + '...'
                : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Communities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Communities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForums.slice(0, 6).map((forum) => (
            <Link key={forum.id} href={`/communities/${forum.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{forum.name}</CardTitle>
                      {forum.condition && (
                        <Badge variant="secondary" className="text-xs">
                          {forum.condition.category}
                        </Badge>
                      )}
                    </div>
                    {forum.isPrivate && (
                      <Badge variant="outline" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {forum.description || 'A supportive community for sharing experiences and advice.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{forum.memberCount} members</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{forum.postCount} posts</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{getRelativeTime(forum.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* All Communities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Communities</h2>
        <div className="space-y-4">
          {filteredForums.map((forum) => (
            <Link key={forum.id} href={`/communities/${forum.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{forum.name}</h3>
                          {forum.condition && (
                            <Badge variant="secondary" className="text-xs">
                              {forum.condition.category}
                            </Badge>
                          )}
                          {forum.isPrivate && (
                            <Badge variant="outline" className="text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-1">
                          {forum.description || 'A supportive community for sharing experiences and advice.'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{forum.memberCount} members</span>
                          <span>•</span>
                          <span>{forum.postCount} posts</span>
                          <span>•</span>
                          <span>Created {getRelativeTime(forum.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Join Community
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {filteredForums.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communities found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Be the first to create a community for your condition.'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Community
          </Button>
        </div>
      )}
    </div>
  )
}
