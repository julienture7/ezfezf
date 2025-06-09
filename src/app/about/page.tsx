import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 sm:py-12">
          <div className="layout-content-container flex flex-col max-w-4xl flex-1">

            {/* Hero Section */}
            <section className="py-12 sm:py-16 text-center">
              <h1 className="text-slate-900 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tighter mb-6">
                About Stuff That Works
              </h1>
              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
                We're building a community where people with health conditions can share what treatments actually work for them,
                helping others find relief faster and more effectively.
              </p>
            </section>

            {/* Mission Section */}
            <section className="py-12 sm:py-16">
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12">
                <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-6">
                  Our Mission
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  Healthcare can be overwhelming, especially when you're dealing with a chronic condition or trying to find the right treatment.
                  Traditional medical resources often provide general information, but what people really need is real-world insights from others who have walked the same path.
                </p>
                <p className="text-slate-700 text-lg leading-relaxed">
                  That's why we created Stuff That Works – a platform where people can share their treatment experiences,
                  see what's working for others with similar conditions, and make more informed decisions about their health.
                </p>
              </div>
            </section>

            {/* How We Help Section */}
            <section className="py-12 sm:py-16">
              <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center">
                How We Help
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-slate-900 text-xl font-semibold mb-4">Community-Driven Insights</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Our platform aggregates real experiences from people with your condition, giving you access to treatment insights you won't find anywhere else.
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-slate-900 text-xl font-semibold mb-4">Data-Backed Recommendations</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We analyze treatment effectiveness across our community to show you which options have the highest success rates for your specific condition.
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-slate-900 text-xl font-semibold mb-4">Safe & Anonymous</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Share your experiences anonymously and connect with others in a safe, judgment-free environment focused on helping each other heal.
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="text-slate-900 text-xl font-semibold mb-4">Evidence-Based</h3>
                  <p className="text-slate-700 leading-relaxed">
                    While we value personal experiences, we also ensure our platform highlights treatments with scientific backing and medical credibility.
                  </p>
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="py-12 sm:py-16">
              <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center">
                Our Commitment
              </h2>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 sm:p-12 text-white text-center">
                <p className="text-xl leading-relaxed mb-6">
                  "We believe everyone deserves access to treatment insights that could change their life.
                  By bringing together the collective wisdom of people who've been there, we're making healthcare more human, more accessible, and more effective."
                </p>
                <p className="text-blue-100 font-medium">
                  — The Stuff That Works Team
                </p>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 text-center">
              <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-6">
                Ready to Find What Works for You?
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Join thousands of people who are taking control of their health by sharing experiences and finding treatments that actually work.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/explore"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Explore Communities
                </a>
                <a
                  href="/login"
                  className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Join Now
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
