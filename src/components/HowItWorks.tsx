import { Search, BarChart3, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Explore communities",
      description: "Find communities for your condition and connect with others."
    },
    {
      icon: BarChart3,
      title: "View statistics",
      description: "See what treatments are most effective for your condition."
    },
    {
      icon: Users,
      title: "Read testimonials",
      description: "Read stories from people who have found relief."
    }
  ]

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-0">
      <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center sm:text-left">
        How it works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step) => (
          <Card key={step.title} className="flex flex-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 flex-col shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="text-blue-600 size-8 mb-4">
                <step.icon size={32} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-slate-900 text-lg font-semibold leading-tight">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm font-normal leading-relaxed">
                  {step.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
