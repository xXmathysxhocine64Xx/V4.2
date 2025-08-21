'use client'

import { useState } from 'react'
import Link from 'next/link'
import OptimizedImage from '../../components/OptimizedImage'
import {
  Building2,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Landmark,
  GraduationCap,
  Bus,
  Trash2,
  Waves,
  Briefcase,
  Search,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

const Button = ({ children, variant = 'primary', size = 'md', href, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
    secondary: 'bg-white text-red-700 border border-red-200 hover:bg-red-50',
    ghost: 'text-red-700 hover:bg-red-50'
  }
  const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6 text-sm', lg: 'h-12 px-7 text-base' }
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link href={href} className={cls} {...props}>{children}</Link>
  return <button className={cls} {...props}>{children}</button>
}

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-8 md:mb-12">
    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h1>
    {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
  </div>
)

export default function ServicesRefonte() {
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = [
    { name: 'Accueil', href: '/mairie/accueil' },
    { name: 'Démarches', href: '/mairie/services' },
    { name: 'Actualités', href: '/mairie/actualites' },
    { name: 'Agenda', href: '/mairie/agenda' },
    { name: 'La Métropole', href: '/mairie/metropole' },
    { name: 'Contact', href: '/mairie/contact' },
  ]

  const categories = [
    {
      icon: <FileText className="w-6 h-6" />, color: 'bg-red-100 text-red-700',
      title: "État civil & Citoyenneté",
      items: [
        { name: "Carte d'identité & Passeport", desc: 'Rendez-vous, pièces à fournir', href: '#carte-identite' },
        { name: "Actes d'état civil", desc: 'Naissance, mariage, décès', href: '#actes' },
        { name: 'PACS & Mariages', desc: 'Déclarations, célébrations', href: '#pacs' },
      ]
    },
    {
      icon: <Landmark className="w-6 h-6" />, color: 'bg-red-100 text-red-700',
      title: 'Urbanisme & Habitat',
      items: [
        { name: 'Permis de construire', desc: 'Dépôt & suivi', href: '#permis' },
        { name: 'Déclaration de travaux', desc: 'Rénovations', href: '#travaux' },
        { name: "PLU", desc: 'Consultation', href: '#plu' },
      ]
    },
    {
      icon: <Bus className="w-6 h-6" />, color: 'bg-red-100 text-red-700',
      title: 'Transports & Mobilité',
      items: [
        { name: 'Stationnement', desc: 'Zones, abonnements', href: '#stationnement' },
        { name: 'Transport en commun', desc: 'Bibus, horaires', href: '#bibus' },
      ]
    },
    {
      icon: <Trash2 className="w-6 h-6" />, color: 'bg-red-100 text-red-700',
      title: 'Environnement & Déchets',
      items: [
        { name: 'Déchetteries', desc: 'Horaires & accès', href: '#dechetteries' },
        { name: 'Collecte des déchets', desc: 'Calendrier', href: '#collecte' },
        { name: 'Compostage', desc: 'Individuel & collectif', href: '#compostage' },
      ]
    },
    {
      icon: <GraduationCap className="w-6 h-6" />, color: 'bg-red-100 text-red-700',
      title: 'Éducation & Jeunesse',
      items: [
        { name: 'Inscriptions scolaires', desc: 'Calendrier & démarches', href: '#inscriptions' },
        { name: 'Périscolaire & cantine', desc: 'Infos pratiques', href: '#periscolaire' },
      ]
    },
    {
      icon: <Briefcase className="w-6 h-6" />, color: 'bg-red-100 text-red-700',
      title: 'Emploi & Social',
      items: [
        { name: 'Offres de la métropole', desc: 'Mises à jour hebdo', href: '#emplois' },
        { name: 'CCAS', desc: 'Aides et accompagnement', href: '#ccas' },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            {nav.map((n) => (
              <Link key={n.name} href={n.href} className="text-sm font-medium text-gray-700 hover:text-red-700">{n.name}</Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="sm" href="#recherche"><Search className="w-4 h-4 mr-2" /> Rechercher</Button>
            <Button variant="primary" size="sm" href="/mairie/contact"><Mail className="w-4 h-4 mr-2" /> Contact</Button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden rounded-lg border border-red-200 p-2 text-red-700">☰</button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-white" />
        <div className="container relative mx-auto px-6 py-12">
          <SectionTitle title="Services & Démarches" subtitle="Retrouvez tous les services municipaux organisés par thématiques" />
          <div id="recherche" className="rounded-2xl border border-red-100 p-3 md:p-4 bg-white shadow-sm">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-red-50 rounded-xl px-3">
                <Search className="w-5 h-5 text-red-600" />
                <input placeholder="Rechercher un service (ex: passeport, PLU, déchetterie)" className="flex-1 bg-transparent py-3 px-3 outline-none text-sm" />
              </div>
              <Button variant="primary">Rechercher</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grille de catégories */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="rounded-2xl border border-red-100 p-5 md:p-6 bg-white hover:bg-red-50/40 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center shadow-sm`}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{cat.title}</h3>
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    {cat.items.map((it, idx) => (
                      <Link key={idx} href={it.href} className="group rounded-xl border border-gray-200 p-4 hover:border-red-200 hover:bg-white transition-all">
                        <div className="font-semibold text-gray-900 group-hover:text-red-800">{it.name}</div>
                        <div className="text-xs text-gray-600">{it.desc}</div>
                        <div className="mt-2 text-[11px] text-red-700 inline-flex items-center font-semibold">Démarrer <ArrowRight className="w-3 h-3 ml-1" /></div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Besoin d'aide ?</h3>
            <p className="text-gray-300 mt-2">Notre équipe est là pour vous accompagner.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" href="/mairie/contact" className="bg-white/10 text-white border-white/20 hover:bg-white/20"><Mail className="w-5 h-5 mr-2" /> Nous écrire</Button>
            <Button variant="primary" size="lg" href="/mairie/agenda"><Calendar className="w-5 h-5 mr-2" /> Prendre RDV</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <div className="font-semibold text-gray-900 mb-3">Services</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/services">Mes démarches</Link></li>
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/agenda">Agenda</Link></li>
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
        <div className="border-t border-red-100 py-4 text-center text-xs text-gray-500">© 2025 Ville de Brest — Refonte (rouge/blanc)</div>
      </footer>
    </div>
  )
}