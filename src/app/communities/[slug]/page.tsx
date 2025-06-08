'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Star, ThumbsUp, ThumbsDown, Users, MessageCircle, TrendingUp, Calendar } from 'lucide-react'

interface CommunityData {
  name: string
  description: string
  image: string
  members: string
  posts: string
  topTreatments: Array<{
    name: string
    effectiveness: number
    users: number
    sideEffects: string[]
  }>
  recentTestimonials: Array<{
    id: number
    name: string
    timeAgo: string
    avatar: string
    rating: number
    text: string
    treatment: string
    likes: number
    dislikes: number
  }>
  stats: {
    avgRating: string
    mostEffective: string
    totalReviews: string
  }
}

const communityData: Record<string, CommunityData> = {
  headaches: {
    name: "Headaches & Migraines",
    description: "A supportive community for people dealing with headaches, migraines, and related conditions. Share treatment experiences and find what works.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN8SJ5pCw9Ym37hP43_xM3kBR8coXE3fJWRqVAHH5OaHrkfsSV285embR9OXTnSlybn-zTmCXrAwPpVrUQTw3U_Eo0zI382niQJXFrcA_I-ImqmERD95hGfbV_jkuyyL6stt89FEmRGd8yN_V0yUnezWrHdScgcXjj8F8A19Z-Gg2t_1WrtL_o_deoMiZLZpfxSzeSmV_YfcXsu4T2xfNyMnnyDOstVH6gwZN3DDVbFGuXl4WZ4sYs_OqJFqJz6W01yVZWbjQcC78",
    members: "12,450",
    posts: "8,920",
    topTreatments: [
      { name: "Sumatriptan", effectiveness: 78, users: 1240, sideEffects: ["Nausea", "Drowsiness"] },
      { name: "Preventive Magnesium", effectiveness: 72, users: 890, sideEffects: ["Digestive upset"] },
      { name: "Cold Therapy", effectiveness: 65, users: 560, sideEffects: ["None reported"] },
      { name: "Botox Injections", effectiveness: 83, users: 320, sideEffects: ["Injection site pain"] }
    ],
    recentTestimonials: [
      {
        id: 1,
        name: "Sarah M.",
        timeAgo: "3 days ago",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b2a51f97?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        text: "After struggling with migraines for 10 years, Sumatriptan has been a game-changer. I still get migraines, but they're much more manageable now.",
        treatment: "Sumatriptan",
        likes: 24,
        dislikes: 2
      },
      {
        id: 2,
        name: "Mike T.",
        timeAgo: "1 week ago",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 4,
        text: "Daily magnesium supplements reduced my migraine frequency from 3x/week to maybe once a month. Took about 2 months to see full effects.",
        treatment: "Preventive Magnesium",
        likes: 18,
        dislikes: 1
      }
    ],
    stats: {
      avgRating: "4.2",
      mostEffective: "Sumatriptan",
      totalReviews: "2,340"
    }
  },
  "stomach-aches": {
    name: "Stomach Issues & Digestive Health",
    description: "Connect with others managing digestive issues including IBS, acid reflux, gastritis, and general stomach discomfort.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Z2xBwr-ZJMGi1r7ILVmUJL7QZJsHK9x7ASK39cGe2KQk4CvTgap3QkZs94Cfag9G0hLsw69aC8MXPkQjdqqi6HqB_EakNSa0OAEFWKCtt1S9HVu8xYsHaEqsATMqgkJApjgmbDx39oW8BBLZW02ASHW7HhYw9sIOd8j5bz6d_J2iR8DTEtHzlEr-oA9LrYYoFqBNzUdBuWPbM2I135RU-15P49g9jOO4rR_8np0A583V89xPo0unkZ-rb1Tw0AG_kv9uAzbsouM",
    members: "9,680",
    posts: "6,540",
    topTreatments: [
      { name: "Probiotics", effectiveness: 70, users: 820, sideEffects: ["Initial bloating"] },
      { name: "Low FODMAP Diet", effectiveness: 75, users: 650, sideEffects: ["Restrictive"] },
      { name: "Omeprazole", effectiveness: 68, users: 540, sideEffects: ["Headache", "Nausea"] },
      { name: "Peppermint Oil", effectiveness: 63, users: 420, sideEffects: ["Heartburn"] }
    ],
    recentTestimonials: [
      {
        id: 1,
        name: "Lisa K.",
        timeAgo: "2 days ago",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        text: "The Low FODMAP diet completely changed my life. It took 6 weeks to see results, but my stomach pain is 90% better.",
        treatment: "Low FODMAP Diet",
        likes: 31,
        dislikes: 3
      }
    ],
    stats: {
      avgRating: "4.1",
      mostEffective: "Low FODMAP Diet",
      totalReviews: "1,860"
    }
  },
  "skin-rashes": {
    name: "Skin Conditions & Rashes",
    description: "Support for eczema, psoriasis, dermatitis, and other skin conditions. Share skincare routines and treatment successes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDILvaWboxEDHtw4ReX842X7x8TgBbvE8mK9RO6QPkiNuZ8_S9NxHIV9Kz_SUNVhoKSSc9JHNwKJDq59nkRe-ZJ3rnNQF_pFqLSJ9_aCJmoaFgbNmYwdaxMSh3OpMxPYlGpYqd4CMm6g8xksg1Kbr8aVPy6RRoorccO8eqIFm-YS5Bbm5ABKdIePOoedvHpOO0OFp318cUh0Dsj5GipxRoYbYGSoyMxUEjgQv9SKUir4GpSWHOpRLBSg4PcQurDeR13yyM4O3nRt1U",
    members: "7,230",
    posts: "4,890",
    topTreatments: [
      { name: "Moisturizing Routine", effectiveness: 72, users: 680, sideEffects: ["None"] },
      { name: "Topical Steroids", effectiveness: 81, users: 520, sideEffects: ["Skin thinning"] },
      { name: "Elimination Diet", effectiveness: 69, users: 340, sideEffects: ["Restrictive"] },
      { name: "Light Therapy", effectiveness: 76, users: 280, sideEffects: ["Temporary redness"] }
    ],
    recentTestimonials: [
      {
        id: 1,
        name: "David R.",
        timeAgo: "4 days ago",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rating: 4,
        text: "Consistent moisturizing 3x daily with CeraVe has made a huge difference in my eczema. Flare-ups are much less severe now.",
        treatment: "Moisturizing Routine",
        likes: 19,
        dislikes: 2
      }
    ],
    stats: {
      avgRating: "4.3",
      mostEffective: "Topical Steroids",
      totalReviews: "1,420"
    }
  }
}

export default function CommunityPage({ params }: { params: { slug: string } }) {
  const [testimonials, setTestimonials] = useState(communityData[params.slug]?.recentTestimonials || [])

  const community = communityData[params.slug]

  if (!community) {
    notFound()
  }

  const handleVote = (testimonialId: number, type: 'like' | 'dislike') => {
    setTestimonials(prev => prev.map(testimonial => {
      if (testimonial.id === testimonialId) {
        return {
          ...testimonial,
          likes: type === 'like' ? testimonial.likes + 1 : testimonial.likes,
          dislikes: type === 'dislike' ? testimonial.dislikes + 1 : testimonial.dislikes
        }
      }
      return testimonial
    }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${rating}-${i}`}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300 fill-current'}
      />
    ))
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 sm:py-12">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1">

            {/* Hero Section */}
            <section className="py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div
                  className="w-full lg:w-64 h-48 lg:h-64 bg-cover bg-center rounded-xl shadow-lg"
                  style={{ backgroundImage: `url("${community.image}")` }}
                />
                <div className="flex-1">
                  <h1 className="text-slate-900 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tighter mb-4">
                    {community.name}
                  </h1>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    {community.description}
                  </p>
                  <div className="flex gap-6 text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Users size={20} />
                      <span className="font-medium">{community.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={20} />
                      <span className="font-medium">{community.posts} posts</span>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Join Community
                  </Button>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-2">{community.stats.avgRating}</div>
                  <p className="text-slate-600">Average Rating</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="text-lg font-bold text-slate-900 mb-2">{community.stats.mostEffective}</div>
                  <p className="text-slate-600">Most Effective Treatment</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-2">{community.stats.totalReviews}</div>
                  <p className="text-slate-600">Total Reviews</p>
                </div>
              </div>
            </section>

            {/* Top Treatments Section */}
            <section className="py-8">
              <h2 className="text-slate-900 text-2xl font-bold mb-6">Top Treatments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {community.topTreatments.map((treatment) => (
                  <div key={treatment.name} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-slate-900 text-lg font-semibold">{treatment.name}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-green-600 font-semibold">{treatment.effectiveness}%</span>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-3">{treatment.users} users have tried this treatment</p>
                    {treatment.sideEffects.length > 0 && (
                      <div>
                        <p className="text-slate-500 text-sm mb-1">Common side effects:</p>
                        <div className="flex flex-wrap gap-1">
                          {treatment.sideEffects.map((effect) => (
                            <span key={effect} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Testimonials Section */}
            <section className="py-8">
              <h2 className="text-slate-900 text-2xl font-bold mb-6">Recent Community Experiences</h2>
              <div className="space-y-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 bg-cover bg-center rounded-full flex-shrink-0"
                        style={{ backgroundImage: `url("${testimonial.avatar}")` }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-slate-900 font-semibold">{testimonial.name}</span>
                          <span className="text-slate-500 text-sm">•</span>
                          <span className="text-slate-500 text-sm">{testimonial.timeAgo}</span>
                          <span className="text-slate-500 text-sm">•</span>
                          <span className="text-blue-600 text-sm font-medium">{testimonial.treatment}</span>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                          {renderStars(testimonial.rating)}
                        </div>
                        <p className="text-slate-700 leading-relaxed mb-4">{testimonial.text}</p>
                        <div className="flex gap-6 text-slate-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(testimonial.id, 'like')}
                            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors p-0 h-auto"
                          >
                            <ThumbsUp size={16} />
                            <span className="text-sm">{testimonial.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(testimonial.id, 'dislike')}
                            className="flex items-center gap-1.5 hover:text-red-600 transition-colors p-0 h-auto"
                          >
                            <ThumbsDown size={16} />
                            <span className="text-sm">{testimonial.dislikes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
                <p className="text-blue-100 mb-6">
                  Help others by sharing what treatments have worked (or haven't worked) for you.
                </p>
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  Add Your Review
                </Button>
              </div>
            </section>

          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
