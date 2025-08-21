'use client'

import { useState } from 'react'
import Link from 'next/link'
import OptimizedImage from '../../components/OptimizedImage'
import { Building2, MapPin, Phone, Mail, ChevronRight } from 'lucide-react'

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-extrabold text-red-700">{value}</div>
    <div className="text-xs md:text-sm text-gray-600">{label}</div>
  </div>
)

export default function MetropoleRefonte() {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = [
    { name: 'Accueil', href: '/mairie/accueil' },
    { name: 'Démarches', href: '/mairie/services' },
    { name: 'Actualités', href: '/mairie/actualites' },
    { name: 'Agenda', href: '/mairie/agenda' },
    { name: 'La Métropole', href: '/mairie/metropole' },
    { name: 'Contact', href: '/mairie/contact' },
  ]

  const img1 = 'https://images.unsplash.com/photo-1706033914963-5b4c087b1456?crop=entropy&cs=srgb&fm=jpg&q=85'
  const img2 = 'https://images.unsplash.com/photo-1612736118792-28544332c23c?crop=entropy&cs=srgb&fm=jpg&q=85'

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
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-white" />
        <div className="container relative mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">La Métropole</h1>
            <p className="text-lg text-gray-700 leading-relaxed">Territoire maritime et innovant, Brest métropole conjugue qualité de vie, dynamisme économique et richesses naturelles.</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <Stat value="140K+" label="Habitants" />
              <Stat value="8" label="Communes" />
              <Stat value="1er" label="Port de plaisance du Finistère" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <OptimizedImage src={img1} alt="Brest – voiliers" className="h-44 md:h-64 w-full rounded-2xl shadow-lg" width={800} height={520} />
            <OptimizedImage src={img2} alt="Brest – ville maritime" className="h-44 md:h-64 w-full rounded-2xl shadow-lg" width={800} height={520} />
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
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/agenda">Agenda</Link></li>
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