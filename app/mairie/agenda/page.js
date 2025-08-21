'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Calendar, MapPin, Phone, Mail, ChevronRight, ArrowRight, Search } from 'lucide-react'

const Button = ({ children, variant = 'primary', size = 'md', href, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:pointer-events-none'
  const variants = { primary: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow', secondary: 'bg-white text-red-700 border border-red-200 hover:bg-red-50', ghost: 'text-red-700 hover:bg-red-50' }
  const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6 text-sm', lg: 'h-12 px-7 text-base' }
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link href={href} className={cls} {...props}>{children}</Link>
  return <button className={cls} {...props}>{children}</button>
}

export default function AgendaRefonte() {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = [
    { name: 'Accueil', href: '/mairie/accueil' },
    { name: 'Démarches', href: '/mairie/services' },
    { name: 'Actualités', href: '/mairie/actualites' },
    { name: 'Agenda', href: '/mairie/agenda' },
    { name: 'La Métropole', href: '/mairie/metropole' },
    { name: 'Contact', href: '/mairie/contact' },
  ]

  const events = [
    { day: '18', month: 'JUL', title: 'Marché nocturne – Quai Commandant Malbert', place: 'Port de commerce', href: '#' },
    { day: '22', month: 'JUL', title: 'Concert gratuit – Jardin Kennedy', place: 'Jardin Kennedy', href: '#' },
    { day: '02', month: 'AOU', title: 'Fête de quartier – Lambézellec', place: 'Lambézellec', href: '#' },
    { day: '05', month: 'AOU', title: 'Triathlon de Brest', place: 'Plage du Moulin Blanc', href: '#' },
    { day: '12', month: 'AOU', title: 'Cinéma en plein air', place: 'Place de la Liberté', href: '#' },
    { day: '20', month: 'AOU', title: 'Forum des associations', place: 'Parc des Expos', href: '#' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-red-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/mairie/accueil" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600 shadow-sm"><Building2 className="w-6 h-6 text-white" /></div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-gray-900">Brest</div>
              <div className="text-[10px] uppercase text-red-700 font-semibold -mt-1">Mairie & Métropole</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => <Link key={n.name} href={n.href} className="text-sm font-medium text-gray-700 hover:text-red-700">{n.name}</Link>)}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="sm"><Search className="w-4 h-4 mr-2" /> Rechercher</Button>
            <Button variant="primary" size="sm" href="/mairie/contact">Contact</Button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden rounded-lg border border-red-200 p-2 text-red-700">☰</button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-white" />
        <div className="container relative mx-auto px-6 py-12">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Agenda</h1>
            <p className="text-gray-600 mt-2">Événements et sorties à Brest</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((e, i) => (
              <Link key={i} href={e.href} className="group rounded-2xl border border-red-100 p-5 bg-white hover:bg-red-50/40 hover:border-red-200 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-red-600 text-white flex flex-col items-center justify-center font-extrabold">
                    <div className="text-lg leading-none">{e.day}</div>
                    <div className="text-[10px] tracking-widest">{e.month}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-red-800">{e.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{e.place}</div>
                    <div className="text-xs text-red-700 mt-2 inline-flex items-center">Voir <ArrowRight className="w-3 h-3 ml-1" /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-red-100">
        <div className="container mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-600 shadow-sm"><Building2 className="w-6 h-6 text-white" /></div>
              <div>
                <div className="text-lg font-extrabold">Ville de Brest</div>
                <div className="text-xs uppercase text-red-700 font-semibold -mt-1">Métropole • Finistère</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md">Brest métropole facilite vos démarches.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-3">Liens</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/services">Mes démarches</Link></li>
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/actualites">Actualités</Link></li>
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-3">Contact</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> 02 98 00 80 80</li>
              <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> contact@brest.fr</li>
              <li className="flex items-start"><MapPin className="w-4 h-4 mr-2 mt-0.5" /> 2 rue Frézier, 29200 Brest</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-red-100 py-4 text-center text-xs text-gray-500">© 2025 Ville de Brest — Refonte</div>
      </footer>
    </div>
  )
}