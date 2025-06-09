import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, BarChart3, Users, MessageCircle, Heart, Shield } from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Find Your Community",
      description: "Search for your specific health condition or browse our community directory to find others who share your experience.",
      details: "We have communities for hundreds of conditions, from common issues like headaches and allergies to rare diseases. Each community is moderated and focused on sharing helpful treatment experiences."
    },
    {
      number: "02",
      icon: BarChart3,
      title: "Explore Treatment Data",
      description: "View aggregated data on treatment effectiveness, side effects, and success rates from real people in your community.",
      details: "Our data visualization tools help you quickly understand which treatments are working for people with your condition, including success rates, common side effects, and treatment combinations."
    },
    {
      number: "03",
      icon: Users,
      title: "Read Real Stories",
      description: "Discover detailed testimonials from community members about their treatment journeys, challenges, and successes.",
      details: "Read authentic stories about treatment experiences, including what worked, what didn't, and valuable tips from people who've been where you are now."
    },
    {
      number: "04",
      icon: MessageCircle,
      title: "Share Your Experience",
      description: "Contribute to the community by sharing your own treatment experiences to help others on their healing journey.",
      details: "Your experiences could be the key to someone else's breakthrough. Share anonymously and help build the collective knowledge that makes our platform valuable."
    }
  ]

  const features = [
    {
      icon: Heart,
      title: "Community-Driven",
      description: "Real experiences from real people, not corporate-sponsored content."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Share anonymously and control exactly what information you want to share."
    },
    {
      icon: BarChart3,
      title: "Data-Backed",
      description: "Treatment effectiveness shown through aggregated community data and statistics."
    }
  ]

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 sm:py-12">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1">

            {/* Hero Section */}
            <section className="py-12 sm:py-16 text-center">
              <h1 className="text-slate-900 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tighter mb-6">
                How Stuff That Works Helps You
              </h1>
              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
                We connect you with treatment insights from people who have the same condition as you,
                giving you the real-world information you need to make better health decisions.
              </p>
            </section>

            {/* Steps Section */}
            <section className="py-12 sm:py-16">
              <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-12 text-center">
                Your Journey to Better Health
              </h2>
              <div className="space-y-16">
                {steps.map((step, index) => (
                  <div key={step.number} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1 lg:max-w-md">
                      <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-blue-100 rounded-full p-3">
                            <step.icon className="text-blue-600" size={24} />
                          </div>
                          <span className="text-blue-600 text-sm font-bold">{step.number}</span>
                        </div>
                        <h3 className="text-slate-900 text-2xl font-bold mb-4">{step.title}</h3>
                        <p className="text-slate-600 text-lg leading-relaxed mb-4">{step.description}</p>
                        <p className="text-slate-500 leading-relaxed">{step.details}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 h-64 flex items-center justify-center">
                        <step.icon className="text-blue-400" size={80} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-16">
              <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center">
                What Makes Us Different
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature) => (
                  <div key={feature.title} className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <feature.icon className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-slate-900 text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Process Section */}
            <section className="py-12 sm:py-16">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 sm:p-12 text-white">
                <h2 className="text-3xl font-bold mb-6 text-center">Our Data Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold mb-4">1M+</div>
                    <p className="text-blue-100">Treatment experiences shared</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-4">500+</div>
                    <p className="text-blue-100">Health conditions covered</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-4">95%</div>
                    <p className="text-blue-100">Users find helpful insights</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 text-center">
              <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Join our community and discover what treatments are working for people with your condition.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/explore"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Find Your Community
                </a>
                <a
                  href="/about"
                  className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Learn More
                </a>
              </div>
            </section>

          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
