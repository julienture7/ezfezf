import Link from 'next/link'
import { Twitter, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  const links = [
    { label: "Explore", href: "/explore" },
    { label: "How it works", href: "/how-it-works" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Terms of service", href: "/terms" },
    { label: "Privacy policy", href: "/privacy" }
  ]

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ]

  return (
    <footer className="flex justify-center border-t border-slate-200 bg-slate-100">
      <div className="flex max-w-5xl flex-1 flex-col">
        <div className="flex flex-col gap-8 px-6 py-12 text-center @container sm:px-10 md:px-20 lg:px-40">
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 @[480px]:flex-row @[480px]:justify-around">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 text-sm font-normal leading-normal transition-colors min-w-32"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-slate-500 hover:text-blue-600 transition-colors"
                aria-label={social.label}
              >
                <social.icon size={24} />
              </Link>
            ))}
          </div>

          <p className="text-slate-500 text-sm font-normal leading-normal">
            © 2023 Stuff That Works
          </p>
        </div>
      </div>
    </footer>
  )
}
