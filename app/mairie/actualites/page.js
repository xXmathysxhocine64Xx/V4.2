'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building2,
  Users,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Clock,
  Mail,
  ChevronRight,
  ExternalLink,
  Heart,
  Home,
  GraduationCap,
  Briefcase,
  TreePine,
  X,
  Menu as MenuIcon,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Cpu,
  Layers,
  ArrowRight,
  Star,
  Award,
  Navigation as NavigationIcon,
  Search,
  Filter,
  Droplets,
  Bike,
  Recycle,
  Users2
} from 'lucide-react'

// Composants UI réutilisables - Palette Rouge Brest
const Button = ({ children, className = "", variant = "default", size = "default", onClick, type, disabled, href }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
    outline: "border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300",
    ghost: "hover:bg-red-50 text-red-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    primary: "bg-red-700 text-white hover:bg-red-800 shadow-lg"
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

// Composant Navigation - Thème Rouge
const Navigation = ({ currentPage = "actualites" }) => {
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
            <div className="p-2 rounded-lg bg-red-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">Ville de Brest</div>
              <div className="text-xs text-red-600">Métropole • Finistère</div>
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-red-600 ${
                  currentPage === item.id ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-gray-700'
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
                className="block py-2 text-gray-700 hover:text-red-600"
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

export default function ActualitesPage() {
  const [filterCategory, setFilterCategory] = useState('toutes')

  // Actualités inspirées du vrai site de Brest avec contenu adapté
  const actualites = [
    {
      id: 1,
      title: "Le département du Finistère placé en alerte sécheresse",
      date: "19 août 2025",
      category: "environnement",
      categoryLabel: "Environnement / Énergie",
      description: "Depuis le mois de mars 2025, le département du Finistère connaît un déficit régulier de précipitations qui conduit aujourd'hui à une situation sèche se caractérisant par des débits saisonniers faibles dans les principaux cours d'eau et dans les nappes phréatiques.",
      image: "https://images.unsplash.com/photo-1661846141572-e52810543f57?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: true,
      badge: "bg-red-100 text-red-700"
    },
    {
      id: 2,
      title: "Tour de France : à Brest, des milliers de fans des femmes",
      date: "27 juillet 2025",
      category: "sport",
      categoryLabel: "Sport / Nautisme",
      description: "Après une première étape bretonne le 26 juillet, les femmes du Tour de France avaient rendez-vous à Brest ce 27 juillet, pour une deuxième étape 100% finistérienne. Un nouveau succès monstre dans l'histoire du Tour à Brest !",
      image: "https://images.unsplash.com/photo-1561467602-bff7f676c706?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: true,
      badge: "bg-red-100 text-red-700"
    },
    {
      id: 3,
      title: "La première rame du tramway à bon port en septembre",
      date: "15 juillet 2025",
      category: "transport",
      categoryLabel: "Déplacements",
      description: "Fabriquées au sein de l'usine Alstom de la Rochelle, les rames de la future ligne B du tramway sont quasi prêtes ! La première fera son entrée à Brest mi-septembre.",
      image: "https://images.unsplash.com/photo-1651516467730-963b2346e174?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxjaXR5JTIwaGFsbCUyMG1vZGVybnxlbnwwfHx8Ymx1ZXwxNzU1Nzc0Nzk5fDA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-rose-100 text-rose-700"
    },
    {
      id: 4,
      title: "Recyclage textile : les bornes de collecte fermées",
      date: "21 juillet 2025", 
      category: "environnement",
      categoryLabel: "Environnement / Énergie",
      description: "Suite à l'arrêt de l'activité d'Abi 29, Brest métropole se voit dans l'obligation de fermer l'accès aux bornes de collecte textile. D'autres solutions de recyclage sont malgré tout disponibles sur le territoire.",
      image: "https://images.unsplash.com/photo-1620413810275-da973d8d7e28?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxjaXR5JTIwaGFsbCUyMG1vZGVybnxlbnwwfHx8Ymx1ZXwxNzU1Nzc0Nzk5fDA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-red-50 text-red-600"
    },
    {
      id: 5,
      title: "Nouveau service de vélos électriques partagés",
      date: "12 juillet 2025",
      category: "transport",
      categoryLabel: "Déplacements",
      description: "Brest métropole lance un nouveau service de vélos électriques en libre-service avec 50 stations connectées dans toute la métropole. Un service moderne et écologique pour vos déplacements quotidiens.",
      image: "https://images.unsplash.com/photo-1705082121134-4c9314fae148?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-red-100 text-red-700"
    },
    {
      id: 6,
      title: "Rénovation du centre aquatique Foch",
      date: "8 juillet 2025",
      category: "loisirs",
      categoryLabel: "Culture / Loisirs", 
      description: "D'importants travaux de rénovation débutent au centre aquatique Foch pour moderniser les équipements et améliorer l'accueil du public. Réouverture prévue en janvier 2026.",
      image: "https://images.unsplash.com/photo-1561467602-bff7f676c706?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85",
      featured: false,
      badge: "bg-rose-100 text-rose-700"
    }
  ]

  const categories = [
    { id: 'toutes', label: 'Toutes', count: actualites.length },
    { id: 'environnement', label: 'Environnement', count: actualites.filter(a => a.category === 'environnement').length },
    { id: 'transport', label: 'Déplacements', count: actualites.filter(a => a.category === 'transport').length },
    { id: 'sport', label: 'Sport', count: actualites.filter(a => a.category === 'sport').length },
    { id: 'loisirs', label: 'Loisirs', count: actualites.filter(a => a.category === 'loisirs').length }
  ]

  const filteredActualites = filterCategory === 'toutes' 
    ? actualites 
    : actualites.filter(actualite => actualite.category === filterCategory)

  const featuredActualites = actualites.filter(a => a.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="actualites" />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Nos Actualités
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Restez informé de l'actualité de Brest métropole. 
              Découvrez les dernières nouvelles, projets et événements de votre territoire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="primary">
                <Search className="w-5 h-5 mr-2" />
                Rechercher une actualité
              </Button>
              <Button size="lg" variant="outline">
                <Filter className="w-5 h-5 mr-2" />
                Filtrer par thème
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités à la une */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">À la une</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredActualites.map((actualite) => (
              <Card key={actualite.id} className="group cursor-pointer overflow-hidden hover:scale-[1.01] transition-all">
                <div className="relative h-64">
                  <img 
                    src={actualite.image}
                    alt={actualite.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <Badge className={`absolute top-4 left-4 ${actualite.badge} border-0`}>
                    {actualite.categoryLabel}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white/80 text-sm mb-2">{actualite.date}</div>
                    <h3 className="text-white text-xl font-bold leading-tight mb-2">
                      {actualite.title}
                    </h3>
                  </div>
                </div>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-4">{actualite.description}</p>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-red-50 transition-colors">
                    Lire l'article complet
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des actualités */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filterCategory === 'toutes' ? 'Toutes les actualités' : `Actualités • ${categories.find(c => c.id === filterCategory)?.label}`}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredActualites.length} article{filteredActualites.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredActualites.map((actualite) => (
              <Card key={actualite.id} className="group cursor-pointer hover:scale-[1.02] transition-all overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={actualite.image}
                    alt={actualite.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <Badge className={`absolute top-3 left-3 ${actualite.badge} border-0 text-xs`}>
                    {actualite.categoryLabel}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="text-sm text-gray-500 mb-2">{actualite.date}</div>
                  <CardTitle className="text-lg leading-tight group-hover:text-red-600 transition-colors">
                    {actualite.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {actualite.description.substring(0, 120)}...
                  </p>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-red-50 transition-colors">
                    Lire la suite
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="primary" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Restez informé</h2>
            <p className="text-lg text-gray-600 mb-8">
              Recevez les dernières actualités de Brest métropole directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Button size="lg" variant="primary">
                <Mail className="w-4 h-4 mr-2" />
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-red-600">
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