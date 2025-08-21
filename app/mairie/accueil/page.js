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
  ShieldCheck,
  Users,
  HeartPulse,
  GraduationCap,
  Trees,
  Bus,
  Newspaper,
  Megaphone,
  Clock,
  ChevronRight,
  ArrowRight,
  Search,
  ExternalLink
} from 'lucide-react'

// Palette Rouge & Blanc – design totalement nouveau
const RedPill = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full bg-red-600 text-white px-3 py-1 text-xs font-semibold shadow-sm ${className}`}>
    {children}
  </span>
)

const Button = ({ children, variant = 'primary', size = 'md', href, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
    secondary: 'bg-white text-red-700 border border-red-200 hover:bg-red-50',
    ghost: 'text-red-700 hover:bg-red-50',
    dark: 'bg-gray-900 hover:bg-black text-white'
  }
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-7 text-base'
  }

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  )
  return (
    <button className={cls} {...props}>{children}</button>
  )
}

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-extrabold text-red-700">{value}</div>
    <div className="text-xs md:text-sm text-gray-600">{label}</div>
  </div>
)

export default function AccueilRefonte() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Images sélectionnées (héros & mosaïque)
  const heroImage = 'https://images.unsplash.com/photo-1706033914690-9e4eec495528?crop=entropy&cs=srgb&fm=jpg&q=85'
  const mosaic1 = 'https://images.unsplash.com/photo-1706033914963-5b4c087b1456?crop=entropy&cs=srgb&fm=jpg&q=85'
  const mosaic2 = 'https://images.unsplash.com/photo-1612736118792-28544332c23c?crop=entropy&cs=srgb&fm=jpg&q=85'
  const mosaic3 = 'https://images.unsplash.com/photo-1585189241286-4d4ee9b4fdaf?crop=entropy&cs=srgb&fm=jpg&q=85'

  const topLinks = [
    { label: 'Prendre rendez-vous', href: '/mairie/services', icon: <Clock className="w-4 h-4 mr-2" /> },
    { label: 'Signaler un problème', href: '/mairie/contact', icon: <Megaphone className="w-4 h-4 mr-2" /> },
    { label: 'Nous contacter', href: '/mairie/contact', icon: <Phone className="w-4 h-4 mr-2" /> },
  ]

  const nav = [
    { name: 'Accueil', href: '/mairie/accueil' },
    { name: 'Démarches', href: '/mairie/services' },
    { name: 'Actualités', href: '/mairie/actualites' },
    { name: "Agenda", href: '/mairie/agenda' },
    { name: 'La Métropole', href: '/mairie/metropole' },
    { name: 'Contact', href: '/mairie/contact' },
  ]

  const quickActions = [
    { title: "Carte d'identité & Passeport", desc: 'Rendez-vous et pièces à fournir', icon: <FileText className="w-5 h-5" />, href: '/mairie/services#carte-identite' },
    { title: 'Urbanisme', desc: 'Permis, PLU, déclarations', icon: <Landmark className="w-5 h-5" />, href: '/mairie/services#urbanisme' },
    { title: 'Écoles & Inscriptions', desc: 'Rythmes, cantine, périscolaire', icon: <GraduationCap className="w-5 h-5" />, href: '/mairie/services#education' },
    { title: 'Déchets & Déchetteries', desc: 'Horaires, collecte, tri', icon: <Trees className="w-5 h-5" />, href: '/mairie/services#dechets' },
    { title: 'Transports & Stationnement', desc: 'Bibus, parkings, vélos', icon: <Bus className="w-5 h-5" />, href: '/mairie/services#transport' },
    { title: 'Solidarités', desc: 'CCAS, aides, santé', icon: <HeartPulse className="w-5 h-5" />, href: '/mairie/services#social' },
  ]

  const news = [
    { tag: 'Culture', title: 'Exposition estivale au Musée des Beaux-Arts', date: '12 juillet', href: '/mairie/actualites' },
    { tag: 'Travaux', title: 'Réaménagement du centre – phases et déviations', date: '20 juillet', href: '/mairie/actualites' },
    { tag: 'Jeunesse', title: 'Inscriptions périscolaires : dossier en ligne', date: '25 juillet', href: '/mairie/actualites' },
  ]

  const events = [
    { day: '18', month: 'JUL', title: 'Marché nocturne – Quai Commandant Malbert', href: '/mairie/agenda' },
    { day: '22', month: 'JUL', title: 'Concert gratuit – Jardin Kennedy', href: '/mairie/agenda' },
    { day: '02', month: 'AOU', title: 'Fête de quartier – Lambézellec', href: '/mairie/agenda' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Topbar */}
      <div className="bg-red-700 text-white text-xs">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="font-semibold">Ville de Brest</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {topLinks.map((l, i) => (
              <Link key={i} href={l.href} className="inline-flex items-center opacity-90 hover:opacity-100">
                {l.icon}
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-red-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/mairie/accueil" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600 shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900">Brest</div>
              <div className="text-[10px] uppercase text-red-700 font-semibold -mt-1">Mairie & Métropole</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <Link key={n.name} href={n.href} className="text-sm font-medium text-gray-700 hover:text-red-700">
                {n.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="sm" href="/mairie/services">
              <Search className="w-4 h-4 mr-2" /> Rechercher
            </Button>
            <Button variant="primary" size="sm" href="/mairie/contact">
              <Mail className="w-4 h-4 mr-2" /> Écrire à la mairie
            </Button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden rounded-lg border border-red-200 p-2 text-red-700">
            <span className="sr-only">Ouvrir le menu</span>
            ☰
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-red-100 bg-white">
            <div className="px-6 py-3 grid gap-2">
              {nav.map((n) => (
                <Link key={n.name} href={n.href} className="py-2 text-sm font-medium text-gray-700 hover:text-red-700">
                  {n.name}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="sm" href="/mairie/services" className="flex-1">Rechercher</Button>
                <Button variant="primary" size="sm" href="/mairie/contact" className="flex-1">Contact</Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section – Rouge/Blanc avec image immersive */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-white" />
        <div className="container relative mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <RedPill className="mb-4">Métropole maritime • Bretagne</RedPill>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Mairie de <span className="text-red-700">Brest</span>
            </h1>
            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              Démarches en ligne, informations pratiques, événements et actualités : retrouvez tout ce qui facilite votre quotidien à Brest.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="lg" href="/mairie/services">
                <FileText className="w-5 h-5 mr-2" /> Mes démarches
              </Button>
              <Button variant="secondary" size="lg" href="/mairie/agenda">
                <Calendar className="w-5 h-5 mr-2" /> Agenda
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              <Stat value="140K+" label="Habitants" />
              <Stat value="8" label="Communes" />
              <Stat value="24/7" label="Démarches en ligne" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-red-100/40 blur-2xl rounded-[2rem] -z-10" />
            <OptimizedImage src={heroImage} alt="Brest – patrimoine maritime" className="h-80 md:h-[28rem] w-full rounded-2xl shadow-2xl image-optimized" width={1280} height={720} quality={80} />
            <div className="absolute bottom-3 left-3">
              <RedPill className="shadow-lg">Ville & Métropole</RedPill>
            </div>
          </div>
        </div>
      </section>

      {/* Accès rapides – cartes denses et aérées */}
      <section className="py-12 md:py-16 bg-white border-t border-red-100">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-6 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Accès rapides</h2>
              <p className="text-gray-600">Les démarches les plus utilisées</p>
            </div>
            <Button variant="ghost" href="/mairie/services" className="hidden md:inline-flex">
              Tout voir <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.href} className="group rounded-2xl border border-red-100 p-4 hover:bg-red-50 hover:border-red-200 transition-all card-optimized">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-3 shadow-sm">
                  {a.icon}
                </div>
                <div className="font-semibold text-gray-900 leading-snug group-hover:text-red-800">{a.title}</div>
                <div className="text-xs text-gray-600 mt-1">{a.desc}</div>
                <div className="mt-3 text-[11px] font-semibold text-red-700 inline-flex items-center">
                  Accéder <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mosaïque visuelle – pour éviter le côté plat */}
      <section className="py-12 md:py-16 bg-red-50/60">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-4 md:gap-6 items-stretch">
          <OptimizedImage src={mosaic1} alt="Voiliers – Brest" className="h-56 md:h-72 w-full rounded-2xl shadow-lg" width={800} height={520} />
          <OptimizedImage src={mosaic2} alt="Ville maritime" className="h-56 md:h-72 w-full rounded-2xl shadow-lg" width={800} height={520} />
          <OptimizedImage src={mosaic3} alt="Skyline portuaire" className="h-56 md:h-72 w-full rounded-2xl shadow-lg" width={800} height={520} />
        </div>
      </section>

      {/* Actualités */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-6 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Actualités</h2>
              <p className="text-gray-600">Ce qui se passe en ce moment à Brest</p>
            </div>
            <Button variant="ghost" href="/mairie/actualites" className="hidden md:inline-flex">
              Toutes les actus <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {news.map((n, i) => (
              <Link key={i} href={n.href} className="group rounded-2xl border border-gray-200 p-5 hover:border-red-200 hover:bg-red-50/40 transition-all card-optimized">
                <div className="text-[11px] font-bold tracking-wide text-red-700 uppercase mb-2">{n.tag}</div>
                <div className="font-semibold text-gray-900 group-hover:text-red-800">{n.title}</div>
                <div className="text-xs text-gray-600 mt-1">{n.date}</div>
                <div className="mt-4 inline-flex items-center text-sm text-red-700 font-semibold">
                  Lire <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda – aperçu */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-red-50 to-white border-t border-red-100">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-6 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Agenda</h2>
              <p className="text-gray-600">Sorties, événements, rendez-vous citoyens</p>
            </div>
            <Button variant="ghost" href="/mairie/agenda" className="hidden md:inline-flex">
              Tout l'agenda <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {events.map((e, i) => (
              <Link key={i} href={e.href} className="group rounded-2xl border border-red-100 p-5 bg-white hover:bg-red-50/40 hover:border-red-200 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-red-600 text-white flex flex-col items-center justify-center font-extrabold">
                    <div className="text-lg leading-none">{e.day}</div>
                    <div className="text-[10px] tracking-widest">{e.month}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-red-800">{e.title}</div>
                    <div className="text-xs text-red-700 mt-1 inline-flex items-center">Voir <ArrowRight className="w-3 h-3 ml-1" /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bande CTA */}
      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Une démarche à réaliser ?</h3>
            <p className="text-gray-300 mt-2">La plupart des demandes se font en ligne en quelques minutes.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="dark" size="lg" href="/mairie/services"><FileText className="w-5 h-5 mr-2" /> Démarrer</Button>
            <Button variant="secondary" size="lg" href="/mairie/contact" className="bg-white/10 text-white border-white/20 hover:bg-white/20"><Mail className="w-5 h-5 mr-2" /> Nous écrire</Button>
          </div>
        </div>
      </section>

      {/* Footer moderne rouge/blanc */}
      <footer className="bg-white border-t border-red-100">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-600 shadow-sm"><Building2 className="w-6 h-6 text-white" /></div>
              <div>
                <div className="text-lg font-extrabold">Ville de Brest</div>
                <div className="text-xs uppercase text-red-700 font-semibold -mt-1">Métropole • Finistère</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              Brest métropole facilite votre quotidien et vos démarches administratives.
            </p>
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
        <div className="border-t border-red-100 py-4 text-center text-xs text-gray-500">
          © 2025 Ville de Brest — Refonte de démonstration (rouge/blanc)
        </div>
      </footer>
    </div>
  )
}