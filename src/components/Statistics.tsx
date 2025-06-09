export default function Statistics() {
  const stats = [
    {
      label: "Most effective treatment",
      value: "Medication A",
      change: "+10%",
      changeType: "positive" as const
    },
    {
      label: "Average rating",
      value: "4.5 stars",
      change: "-5%",
      changeType: "negative" as const
    },
    {
      label: "Number of users",
      value: "10,000+",
      change: "+20%",
      changeType: "positive" as const
    }
  ]

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-0">
      <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center sm:text-left">
        View statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-slate-100 shadow-md">
            <p className="text-slate-700 text-base font-medium leading-normal">
              {stat.label}
            </p>
            <p className="text-slate-900 tracking-tight text-3xl font-bold leading-tight">
              {stat.value}
            </p>
            <p className={`text-base font-semibold leading-normal ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
