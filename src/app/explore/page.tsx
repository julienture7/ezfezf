'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Search, Users, MessageCircle, Loader2, AlertTriangle } from 'lucide-react' // Added Loader2 and AlertTriangle

// Define an interface for the Forum data based on Prisma schema
interface Forum {
  id: string;
  name: string;
  description: string | null;
  // image?: string | null; // No image field in current Forum schema
  createdAt: string;
  updatedAt: string;
  conditionId: string | null;
  _count: {
    memberships: number;
    posts: number;
  };
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allForums, setAllForums] = useState<Forum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForums = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/forums');
        if (!response.ok) {
          throw new Error(`Failed to fetch forums: ${response.statusText}`);
        }
        const data: Forum[] = await response.json();
        setAllForums(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error("Error fetching forums:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForums();
  }, []);

  const filteredForums = allForums.filter(forum =>
    forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (forum.description && forum.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 sm:py-12">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1">

            {/* Hero Section */}
            <section className="py-12 sm:py-16 text-center">
              <h1 className="text-slate-900 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tighter mb-6">
                Explore Health Communities
              </h1>
              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                Find your community and connect with others who understand your health journey.
                Discover treatments that are working for people with your condition.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="flex w-full items-stretch rounded-lg shadow-sm">
                  <div className="text-slate-500 flex border border-slate-300 bg-white items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <Search size={24} />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search communities by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex w-full min-w-0 flex-1 rounded-none border-l-0 border-r-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Communities Grid */}
            <section className="py-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-slate-900 text-2xl font-bold">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'All Communities'}
                </h2>
                {!isLoading && !error && (
                  <p className="text-slate-600">
                    {filteredForums.length} {filteredForums.length === 1 ? 'community' : 'communities'}
                  </p>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  <p className="ml-4 text-slate-600">Loading communities...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 p-6 rounded-lg">
                  <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <p className="text-red-600 text-lg">Error fetching communities: {error}</p>
                </div>
              ) : filteredForums.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg">
                    {searchQuery ? 'No communities found matching your search.' : 'No communities available yet.'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                      Clear search to see all communities
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredForums.map((forum) => (
                    <Link
                      key={forum.id}
                      href={`/communities/${forum.id}`} // Use forum.id for dynamic route
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group flex flex-col"
                    >
                      {/* Image div removed as per instruction */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-slate-900 text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                          {forum.name}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                          {forum.description || 'No description available.'}
                        </p>
                        <div className="flex justify-between text-slate-500 text-sm mt-auto pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{forum._count?.memberships ?? 0} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            <span>{forum._count?.posts ?? 0} posts</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* CTA Section (can remain as is or be updated later) */}
            <section className="py-12 sm:py-16 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 sm:p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Don't see your condition?
                </h2>
                <p className="text-xl leading-relaxed mb-6 text-blue-100">
                  We're always adding new communities. Request a new community or join our general health discussions.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <a
                    href="/login" // Should ideally go to a proper request page or use a modal
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Request Community
                  </a>
                  <a
                    href="/contact"
                    className="border border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </section>

          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
