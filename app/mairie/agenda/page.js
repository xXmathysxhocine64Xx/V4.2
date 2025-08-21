'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  X,
  Menu as MenuIcon,
  Search,
  Calendar,
  Users,
  Music,
  Palette,
  Trophy,
  Waves,
  TreePine,
  GraduationCap,
  Filter,
  Eye,
  Star,
  ArrowRight
} from 'lucide-react'

// Composants UI réutilisables
const Button = ({ children, className = "", variant = "default", size = "default", onClick, type, disabled, href }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
    outline: "border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300",
    ghost: "hover:bg-blue-50 text-blue-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    primary: "bg-blue-700 text-white hover:bg-blue-800 shadow-lg"
  }
  const sizes = {
    default: "h-10 px-6 py-2",
    lg: "h-11 px-8 text-base",
    sm: "h-9 px-4 text-sm"
  }
  
  if (href) {
    return (
      <Link 
        href={href}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </Link>
    )
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-2 p-6 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold leading-none tracking-tight text-gray-900 ${className}`}>
    {children}
  </h3>
)

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>
    {children}
  </span>
)

// Composant Navigation
const Navigation = ({ currentPage = "agenda" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Accueil', href: '/mairie/accueil', id: 'accueil' },
    { name: 'Services', href: '/mairie/services', id: 'services' },
    { name: 'Actualités', href: '/mairie/actualites', id: 'actualites' },
    { name: 'Agenda', href: '/mairie/agenda', id: 'agenda' },
    { name: 'La Métropole', href: '/mairie/metropole', id: 'metropole' },
    { name: 'Contact', href: '/mairie/contact', id: 'contact' }
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/mairie/accueil" className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">Ville de Brest</div>
              <div className="text-xs text-blue-600">Métropole • Finistère</div>
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  currentPage === item.id ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Recherche
            </Button>

            <Button 
              variant="ghost" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 border-t border-gray-100 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default function AgendaPage() {
  const [filterCategory, setFilterCategory] = useState('tous')

  // Événements inspirés du vrai site de Brest
  const evenements = [
    {
      id: 1,
      title: "Un été à Brest",
      description: "Le festival estival de la métropole avec concerts, animations et spectacles sur toute la période estivale.",
      date: "Du 21 juin au 1er septembre 2025",
      categorie: "culture",
      lieu: "Divers lieux à Brest",
      image: "https://images.unsplash.com/photo-1561467602-bff7f676c706?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: true,
      badge: "bg-purple-100 text-purple-700",
      gratuit: true
    },
    {
      id: 2,
      title: "Ciné plein air",
      description: "Projection gratuite en plein air sur la plage du Moulin Blanc. Apportez vos coussins et plaids !",
      date: "Jeudi 21 août 2025, 22h30",
      categorie: "culture", 
      lieu: "Plage du Moulin Blanc",
      image: "https://images.unsplash.com/photo-1705082121134-4c9314fae148?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: true,
      badge: "bg-indigo-100 text-indigo-700",
      gratuit: true
    },
    {
      id: 3,
      title: "Tournoi de beach-volley - Breizh n' Beach",
      description: "Compétition de beach-volley ouverte à tous les niveaux. Inscriptions sur place.",
      date: "Du samedi 23 août, 9h30 au dimanche 24 août, 18h",
      categorie: "sport",
      lieu: "Plage du Moulin Blanc", 
      image: "https://images.unsplash.com/photo-1661846141572-e52810543f57?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-orange-100 text-orange-700",
      gratuit: true
    },
    {
      id: 4,
      title: "Marché des créateurs",
      description: "Marché artisanal avec des créateurs locaux : bijoux, céramique, maroquinerie, art textile.",
      date: "Samedi 30 août 2025, 10h-18h",
      categorie: "culture",
      lieu: "Place de la Liberté",
      image: "https://images.unsplash.com/photo-1651516467730-963b2346e174?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxjaXR5JTIwaGFsbCUyMG1vZGVybnxlbnwwfHx8Ymx1ZXwxNzU1Nzc0Nzk5fDA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-green-100 text-green-700",
      gratuit: true
    },
    {
      id: 5,
      title: "Nuit des Musées",
      description: "Ouverture nocturne gratuite des musées de Brest avec visites guidées et animations spéciales.",
      date: "Samedi 6 septembre 2025, 19h-minuit",
      categorie: "culture",
      lieu: "Musées de Brest",
      image: "https://images.unsplash.com/photo-1620413810275-da973d8d7e28?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxjaXR5JTIwaGFsbCUyMG1vZGVybnxlbnwwfHx8Ymx1ZXwxNzU1Nzc0Nzk5fDA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-violet-100 text-violet-700",
      gratuit: true
    },
    {
      id: 6,
      title: "Course à pied des Remparts",
      description: "Course populaire de 10km dans les rues historiques de Brest. Parcours famille de 2km également.",
      date: "Dimanche 15 septembre 2025, 9h",
      categorie: "sport",
      lieu: "Centre-ville de Brest",
      image: "https://images.unsplash.com/photo-1705082121134-4c9314fae148?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-red-100 text-red-700",
      gratuit: false,
      prix: "15€"
    },
    {
      id: 7,
      title: "Forum des Associations",
      description: "Rencontrez les associations brestoises et découvrez leurs activités pour la rentrée.",
      date: "Samedi 7 septembre 2025, 10h-17h",
      categorie: "citoyennete",
      lieu: "Parc des Expositions Penfeld",
      image: "https://images.unsplash.com/photo-1561467602-bff7f676c706?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-cyan-100 text-cyan-700",
      gratuit: true
    },
    {
      id: 8,
      title: "Fête de la Science",
      description: "Expositions, démonstrations et ateliers scientifiques pour petits et grands.",
      date: "Du 12 au 15 octobre 2025",
      categorie: "education",
      lieu: "Océanopolis et divers lieux",
      image: "https://images.unsplash.com/photo-1651516467730-963b2346e174?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxjaXR5JTIwaGFsbCUyMG1vZGVybnxlbnwwfHx8Ymx1ZXwxNzU1Nzc0Nzk5fDA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-blue-100 text-blue-700",
      gratuit: true
    }
  ]

  const categories = [
    { id: 'tous', label: 'Tous', count: evenements.length, icon: <Calendar className="w-4 h-4" /> },
    { id: 'culture', label: 'Culture', count: evenements.filter(e => e.categorie === 'culture').length, icon: <Palette className="w-4 h-4" /> },
    { id: 'sport', label: 'Sport', count: evenements.filter(e => e.categorie === 'sport').length, icon: <Trophy className="w-4 h-4" /> },
    { id: 'citoyennete', label: 'Citoyenneté', count: evenements.filter(e => e.categorie === 'citoyennete').length, icon: <Users className="w-4 h-4" /> },
    { id: 'education', label: 'Éducation', count: evenements.filter(e => e.categorie === 'education').length, icon: <GraduationCap className="w-4 h-4" /> }
  ]

  const filteredEvenements = filterCategory === 'tous' 
    ? evenements 
    : evenements.filter(evenement => evenement.categorie === filterCategory)

  const featuredEvenements = evenements.filter(e => e.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="agenda" />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Agenda & Événements
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez tous les événements de Brest métropole : culture, sport, animations... 
              Il y a toujours quelque chose à faire dans notre belle métropole !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="primary">
                <Search className="w-5 h-5 mr-2" />
                Rechercher un événement
              </Button>
              <Button size="lg" variant="outline">
                <Calendar className="w-5 h-5 mr-2" />
                Voir le calendrier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Événements à la une */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">À venir</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredEvenements.map((evenement) => (
              <Card key={evenement.id} className="group cursor-pointer overflow-hidden hover:scale-[1.01] transition-all">
                <div className="relative h-64">
                  <img 
                    src={evenement.image}
                    alt={evenement.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge className={`${evenement.badge} border-0`}>
                      {evenement.categorie}
                    </Badge>
                    {evenement.gratuit && (
                      <Badge className="bg-green-500 text-white border-0">
                        Gratuit
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white/80 text-sm mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {evenement.date}
                    </div>
                    <h3 className="text-white text-xl font-bold leading-tight mb-2">
                      {evenement.title}
                    </h3>
                    <div className="text-white/80 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {evenement.lieu}
                    </div>
                  </div>
                </div>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-4">{evenement.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {evenement.gratuit ? (
                        <span className="text-green-600 font-medium text-sm">Gratuit</span>
                      ) : evenement.prix ? (
                        <span className="text-blue-600 font-medium text-sm">{evenement.prix}</span>
                      ) : null}
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-blue-50 transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.label} ({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des événements */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filterCategory === 'tous' ? 'Tous les événements' : `Événements • ${categories.find(c => c.id === filterCategory)?.label}`}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredEvenements.length} événement{filteredEvenements.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredEvenements.map((evenement) => (
              <Card key={evenement.id} className="group cursor-pointer hover:scale-[1.02] transition-all overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={evenement.image}
                    alt={evenement.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <Badge className={`${evenement.badge} border-0 text-xs`}>
                      {evenement.categorie}
                    </Badge>
                    {evenement.gratuit && (
                      <Badge className="bg-green-500 text-white border-0 text-xs">
                        Gratuit
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {evenement.date}
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {evenement.title}
                  </CardTitle>
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {evenement.lieu}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {evenement.description.substring(0, 100)}...
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      {evenement.gratuit ? (
                        <span className="text-green-600 font-medium text-sm">Entrée libre</span>
                      ) : evenement.prix ? (
                        <span className="text-blue-600 font-medium text-sm">{evenement.prix}</span>
                      ) : null}
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-blue-50 transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proposer un événement</h2>
            <p className="text-lg text-gray-600 mb-8">
              Vous organisez un événement à Brest ? Faites-le connaître en le proposant 
              pour publication sur notre agenda.
            </p>
            <Button size="lg" variant="primary">
              <Calendar className="w-5 h-5 mr-2" />
              Proposer un événement
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-600">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">Ville de Brest</div>
                  <div className="text-sm text-gray-400">Métropole • Finistère • Bretagne</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Brest métropole facilite votre quotidien et vos démarches administratives. 
                Une métropole maritime de 140 000 habitants au bout du Finistère.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/mairie/services" className="hover:text-white transition-colors">Mes démarches</Link></li>
                <li><Link href="/mairie/agenda" className="hover:text-white transition-colors">Agenda</Link></li>
                <li><Link href="/mairie/actualites" className="hover:text-white transition-colors">Actualités</Link></li>
                <li><Link href="/mairie/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  02 98 00 80 80
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@brest.fr
                </li>
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  2 rue Frézier<br />29200 Brest
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 Ville de Brest • Site de démonstration moderne
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Créé avec GetYourSite.fr • Design moderne et institutionnel
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}