'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { notFound, useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageCircle, Edit3, Loader2, AlertTriangle, PlusCircle } from 'lucide-react'
import { toast } from 'react-hot-toast' // Assuming react-hot-toast is available

// Define interfaces for the data structures based on Prisma schema
interface ForumAuthor {
  id: string;
  name: string | null;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  author: ForumAuthor;
  _count: {
    comments: number;
  };
}

interface ForumData {
  id: string;
  name: string;
  description: string | null;
  // image?: string | null; // No image field in current Forum schema
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  conditionId: string | null;
  posts: ForumPost[]; // Initial posts, more can be loaded
  _count: {
    memberships: number;
    posts: number;
  };
  // memberships: any[]; // Could include membership status for current user if API provides
}

export default function CommunityPage() {
  const params = useParams<{ slug: string }>(); // Get slug from URL
  const forumId = params.slug;

  const [forumData, setForumData] = useState<ForumData | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false); // Add state to track if user has joined

  const [showPostForm, setShowPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const fetchForumData = async () => {
    if (!forumId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/forums/${forumId}`);
      if (res.status === 404) {
        notFound();
        return;
      }
      if (!res.ok) {
        throw new Error(`Failed to fetch forum data: ${res.statusText}`);
      }
      const data: ForumData = await res.json();
      setForumData(data);
      setPosts(data.posts || []); // Assuming getForumById includes some initial posts
      // TODO: Check if user is already a member - this would ideally come from getForumById or a separate check
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
      toast.error(err.message || 'Could not load forum data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForumData();
  }, [forumId]);

  const handleJoinCommunity = async () => {
    if (!forumId) return;
    setIsJoining(true);
    try {
      const res = await fetch(`/api/forums/${forumId}/join`, { method: 'POST' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to join community');
      }
      toast.success('Successfully joined the community!');
      setHasJoined(true); // Update UI to reflect joined status
      // Optionally, re-fetch forum data to update member count or rely on optimistic update
      if (forumData && forumData._count) {
        setForumData(prev => prev ? ({ ...prev, _count: { ...prev._count, memberships: prev._count.memberships + 1 }}) : null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Could not join community.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!forumId || !newPostTitle.trim() || !newPostContent.trim()) {
      toast.error('Title and content are required for a new post.');
      return;
    }
    setIsSubmittingPost(true);
    try {
      const res = await fetch(`/api/forums/${forumId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newPostTitle, content: newPostContent }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
      const newPostData = await res.json();
      toast.success('Post created successfully!');
      setPosts(prevPosts => [newPostData, ...prevPosts]); // Optimistic update or re-fetch
      setShowPostForm(false);
      setNewPostTitle('');
      setNewPostContent('');
      // Optionally update forumData post count
       if (forumData && forumData._count) {
        setForumData(prev => prev ? ({ ...prev, _count: { ...prev._count, posts: prev._count.posts + 1 }}) : null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Could not create post.');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Forum</h1>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={fetchForumData}>Try Again</Button>
      </div>
    );
  }

  if (!forumData) {
    // This case should ideally be handled by notFound() in useEffect, but as a fallback:
    return <div className="text-center py-10">Forum not found.</div>;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 sm:py-12">
          <div className="layout-content-container flex flex-col max-w-4xl flex-1"> {/* Max width adjusted */}

            {/* Hero Section */}
            <section className="py-8">
              <div className="flex flex-col gap-6">
                {/* Image removed as it's not in Forum schema */}
                <div className="flex-1">
                  <h1 className="text-slate-900 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tighter mb-4">
                    {forumData.name}
                  </h1>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    {forumData.description || 'Welcome to the community!'}
                  </p>
                  <div className="flex gap-6 text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Users size={20} />
                      <span className="font-medium">{forumData._count?.memberships ?? 0} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={20} />
                      <span className="font-medium">{forumData._count?.posts ?? 0} posts</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleJoinCommunity}
                    disabled={isJoining || hasJoined}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (hasJoined ? 'Joined' : 'Join Community')}
                  </Button>
                </div>
              </div>
            </section>

            {/* Create Post Section Toggle */}
            <section className="py-6">
                <Button onClick={() => setShowPostForm(!showPostForm)} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showPostForm ? 'Cancel' : 'Create New Post'}
                </Button>
            </section>

            {/* Create Post Form */}
            {showPostForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create a New Post</CardTitle>
                  <CardDescription>Share your thoughts and experiences with the community.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <label htmlFor="newPostTitle" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <Input
                        id="newPostTitle"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Enter post title"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPostContent" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                      <Textarea
                        id="newPostContent"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's on your mind?"
                        required
                        rows={5}
                        className="w-full"
                      />
                    </div>
                    <Button type="submit" disabled={isSubmittingPost} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {isSubmittingPost ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Post'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}


            {/* Posts Section */}
            <section className="py-8">
              <h2 className="text-slate-900 text-2xl font-bold mb-6">Community Posts</h2>
              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                         <CardDescription>
                          By {post.author?.name || 'Anonymous'} on {formatDate(post.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 leading-relaxed mb-4 line-clamp-3">
                          {/* Simple snippet, full content on post page */}
                          {post.content}
                        </p>
                        <div className="flex justify-between items-center text-sm text-slate-500">
                           <Button variant="link" className="p-0 h-auto" asChild>
                             {/* Link to actual post page would go here */}
                             <a href={`/forums/${forumId}/posts/${post.id}`}>Read More & Comments ({post._count?.comments ?? 0})</a>
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-center">No posts in this community yet. Be the first to share!</p>
              )}
              {/* TODO: Add pagination or "Load More" button if API supports it for posts */}
            </section>

            {/* Removed Top Treatments, Stats, and old Testimonial CTA sections */}

          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
