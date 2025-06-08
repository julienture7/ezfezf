import Link from 'next/link'

export default function ExploreCommunities() {
  const communities = [
    {
      name: "Headaches",
      description: "Find treatments for headaches",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN8SJ5pCw9Ym37hP43_xM3kBR8coXE3fJWRqVAHH5OaHrkfsSV285embR9OXTnSlybn-zTmCXrAwPpVrUQTw3U_Eo0zI382niQJXFrcA_I-ImqmERD95hGfbV_jkuyyL6stt89FEmRGd8yN_V0yUnezWrHdScgcXjj8F8A19Z-Gg2t_1WrtL_o_deoMiZLZpfxSzeSmV_YfcXsu4T2xfNyMnnyDOstVH6gwZN3DDVbFGuXl4WZ4sYs_OqJFqJz6W01yVZWbjQcC78",
      slug: "headaches"
    },
    {
      name: "Stomach Aches",
      description: "Find treatments for stomach aches",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Z2xBwr-ZJMGi1r7ILVmUJL7QZJsHK9x7ASK39cGe2KQk4CvTgap3QkZs94Cfag9G0hLsw69aC8MXPkQjdqqi6HqB_EakNSa0OAEFWKCtt1S9HVu8xYsHaEqsATMqgkJApjgmbDx39oW8BBLZW02ASHW7HhYw9sIOd8j5bz6d_J2iR8DTEtHzlEr-oA9LrYYoFqBNzUdBuWPbM2I135RU-15P49g9jOO4rR_8np0A583V89xPo0unkZ-rb1Tw0AG_kv9uAzbsouM",
      slug: "stomach-aches"
    },
    {
      name: "Skin Rashes",
      description: "Find treatments for skin rashes",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDILvaWboxEDHtw4ReX842X7x8TgBbvE8mK9RO6QPkiNuZ8_S9NxHIV9Kz_SUNVhoKSSc9JHNwKJDq59nkRe-ZJ3rnNQF_pFqLSJ9_aCJmoaFgbNmYwdaxMSh3OpMxPYlGpYqd4CMm6g8xksg1Kbr8aVPy6RRoorccO8eqIFm-YS5Bbm5ABKdIePOoedvHpOO0OFp318cUh0Dsj5GipxRoYbYGSoyMxUEjgQv9SKUir4GpSWHOpRLBSg4PcQurDeR13yyM4O3nRt1U",
      slug: "skin-rashes"
    }
  ]

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-0">
      <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight mb-8 text-center sm:text-left">
        Explore communities
      </h2>
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 pb-4">
        <div className="flex items-stretch gap-6 sm:gap-8">
          {communities.map((community) => (
            <Link
              key={community.slug}
              href={`/communities/${community.slug}`}
              className="flex h-full flex-1 flex-col gap-4 rounded-xl min-w-[280px] sm:min-w-[320px] overflow-hidden group"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-video sm:aspect-square bg-cover rounded-xl flex flex-col transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url("${community.image}")` }}
              />
              <div>
                <p className="text-slate-900 text-lg font-semibold leading-normal">
                  {community.name}
                </p>
                <p className="text-slate-600 text-sm font-normal leading-relaxed">
                  {community.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
