'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: number
  name: string
  timeAgo: string
  avatar: string
  rating: number
  text: string
  likes: number
  dislikes: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Sophia Clark",
      timeAgo: "2 months ago",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiJwKoNBhoA2XUYAVNCnAu2ujcJmVaKtFC40tgSOjLQYqSTsstQLCNptPv6kkgZ0QiMBP_yw9zIcMSKoQcB6br0q8SIJlR-g0DH7l8aygZG12jBqQWOcbqUvgrtqqA6eqWdQS2GE_f1ebkdh9hLiRU6Ok5nl-k2Bg49nlf7h452d0-4ZHU5S2nzk2iZuzzafraMluQdl3BdoyG39-kZBDl-4fJmlkEggxPdCkXEJMTzHrB_h2hfZOJuuQMNPvKHSmwAdHppqKAI4c",
      rating: 5,
      text: "I've been suffering from migraines for years, and this platform helped me find a treatment that finally works for me. I'm so grateful for the community and the information I found here.",
      likes: 10,
      dislikes: 2
    },
    {
      id: 2,
      name: "Ethan Carter",
      timeAgo: "3 months ago",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCc7z0UUMpecGUbefn4ErdUrr3iy0YGPTrUe0eX-21dClURvUAqZMyH-nngL3_g6LZG9F0ESc_JTbgvsL9K0DZMRC3lZnWlwAQME3brJxl9CaAyC6ysZYzhcK7BIyEvR0sprIqlL3AdmRWENKN8d1luPbUJWWmJcON5Jr_V-hGTcA5yxYtk7DDn49vNUHGRo4jj3rY8S0z1YFP1UdmN9297GdNB6EElIR1NwK2-HwHfNVQTe1GWvuxqgT6lBMVsKZrNPbM4qkL5gM",
      rating: 4,
      text: "This platform is a great resource for finding information about different treatments. I found some helpful tips for managing my condition.",
      likes: 5,
      dislikes: 1
    },
    {
      id: 3,
      name: "Olivia Bennett",
      timeAgo: "4 months ago",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQIyG18SwWJYQwEbPywHa82pYGY5xnU1ljRlYioVZsoVJzkM9hHB0KFn-BmxN2tdpqSRpEyffZ8JU5eKP8pNTtCQRa5Q-cuc3oFlVqy1hBrXVSxQnIocxZkqL9yihF46jfsd_owjPf0DrHgWrBNYTRheVA-0cRmuNMNHfEfkMrN-lPxNqlnwR2clGoph-EtAwoGxNIpUDmwENYLKkXMsqK7tHfAS-7No5I33uzQgV6xp_5XKX_oAd5aAbzcJYtXmS6__LDL7zJcrY",
      rating: 5,
      text: "I was hesitant to try a new treatment, but the testimonials on this platform gave me the confidence to give it a try. It's made a huge difference in my life.",
      likes: 12,
      dislikes: 3
    }
  ])

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
        size={20}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300 fill-current'}
      />
    ))
  }

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-0">
      <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center sm:text-left">
        Read testimonials
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-sm"
                style={{ backgroundImage: `url("${testimonial.avatar}")` }}
              />
              <div className="flex-1">
                <p className="text-slate-900 text-base font-semibold leading-normal">
                  {testimonial.name}
                </p>
                <p className="text-slate-500 text-sm font-normal leading-normal">
                  {testimonial.timeAgo}
                </p>
              </div>
            </div>

            <div className="flex gap-0.5">
              {renderStars(testimonial.rating)}
            </div>

            <p className="text-slate-700 text-base font-normal leading-relaxed">
              {testimonial.text}
            </p>

            <div className="flex gap-6 text-slate-500">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(testimonial.id, 'like')}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors p-0 h-auto"
              >
                <ThumbsUp size={20} />
                <span className="text-sm font-medium">{testimonial.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(testimonial.id, 'dislike')}
                className="flex items-center gap-1.5 hover:text-red-600 transition-colors p-0 h-auto"
              >
                <ThumbsDown size={20} />
                <span className="text-sm font-medium">{testimonial.dislikes}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
