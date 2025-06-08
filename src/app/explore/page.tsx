'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Search, Users, MessageCircle } from 'lucide-react'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const communities = [
    {
      name: "Headaches & Migraines",
      description: "Find effective treatments and connect with others managing headaches and migraines",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN8SJ5pCw9Ym37hP43_xM3kBR8coXE3fJWRqVAHH5OaHrkfsSV285embR9OXTnSlybn-zTmCXrAwPpVrUQTw3U_Eo0zI382niQJXFrcA_I-ImqmERD95hGfbV_jkuyyL6stt89FEmRGd8yN_V0yUnezWrHdScgcXjj8F8A19Z-Gg2t_1WrtL_o_deoMiZLZpfxSzeSmV_YfcXsu4T2xfNyMnnyDOstVH6gwZN3DDVbFGuXl4WZ4sYs_OqJFqJz6W01yVZWbjQcC78",
      slug: "headaches",
      members: "12,450",
      posts: "8,920"
    },
    {
      name: "Stomach Issues & Digestive Health",
      description: "Discover treatments for stomach aches, acid reflux, IBS, and other digestive conditions",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Z2xBwr-ZJMGi1r7ILVmUJL7QZJsHK9x7ASK39cGe2KQk4CvTgap3QkZs94Cfag9G0hLsw69aC8MXPkQjdqqi6HqB_EakNSa0OAEFWKCtt1S9HVu8xYsHaEqsATMqgkJApjgmbDx39oW8BBLZW02ASHW7HhYw9sIOd8j5bz6d_J2iR8DTEtHzlEr-oA9LrYYoFqBNzUdBuWPbM2I135RU-15P49g9jOO4rR_8np0A583V89xPo0unkZ-rb1Tw0AG_kv9uAzbsouM",
      slug: "stomach-aches",
      members: "9,680",
      posts: "6,540"
    },
    {
      name: "Skin Conditions & Rashes",
      description: "Share experiences and find treatments for eczema, psoriasis, rashes, and other skin issues",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDILvaWboxEDHtw4ReX842X7x8TgBbvE8mK9RO6QPkiNuZ8_S9NxHIV9Kz_SUNVhoKSSc9JHNwKJDq59nkRe-ZJ3rnNQF_pFqLSJ9_aCJmoaFgbNmYwdaxMSh3OpMxPYlGpYqd4CMm6g8xksg1Kbr8aVPy6RRoorccO8eqIFm-YS5Bbm5ABKdIePOoedvHpOO0OFp318cUh0Dsj5GipxRoYbYGSoyMxUEjgQv9SKUir4GpSWHOpRLBSg4PcQurDeR13yyM4O3nRt1U",
      slug: "skin-rashes",
      members: "7,230",
      posts: "4,890"
    },
    {
      name: "Anxiety & Depression",
      description: "Find support and treatment strategies for mental health conditions",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
      slug: "anxiety-depression",
      members: "15,620",
      posts: "11,340"
    },
    {
      name: "Chronic Pain",
      description: "Connect with others managing chronic pain and discover effective pain management strategies",
      image: "https://images.unsplash.com/photo-1559757135-5c333d1d5e7c?w=400&h=400&fit=crop",
      slug: "chronic-pain",
      members: "8,900",
      posts: "7,650"
    },
    {
      name: "Allergies",
      description: "Share allergy management techniques and treatment experiences",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      slug: "allergies",
      members: "6,540",
      posts: "4,320"
    },
    {
      name: "Sleep Disorders",
      description: "Find solutions for insomnia, sleep apnea, and other sleep-related issues",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=400&fit=crop",
      slug: "sleep-disorders",
      members: "5,890",
      posts: "3,960"
    },
    {
      name: "Autoimmune Conditions",
      description: "Support community for autoimmune diseases like rheumatoid arthritis, lupus, and more",
      image: "https://images.unsplash.com/photo-1559757173-9c4a7b11a90e?w=400&h=400&fit=crop",
      slug: "autoimmune",
      members: "4,750",
      posts: "3,210"
    }
  ]

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                    placeholder="Search communities..."
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
                <p className="text-slate-600">
                  {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'}
                </p>
              </div>

              {filteredCommunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg">No communities found matching your search.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    Clear search to see all communities
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCommunities.map((community) => (
                    <Link
                      key={community.slug}
                      href={`/communities/${community.slug}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      <div
                        className="w-full h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url("${community.image}")` }}
                      />
                      <div className="p-6">
                        <h3 className="text-slate-900 text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                          {community.name}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          {community.description}
                        </p>
                        <div className="flex justify-between text-slate-500 text-sm">
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{community.members}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            <span>{community.posts}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* CTA Section */}
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
                    href="/login"
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
  )
}
