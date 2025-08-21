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
  Search
} from 'lucide-react'

// Composants UI modernes et institutionnels
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
const Navigation = ({ currentPage = "accueil" }) => {
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

export default function AccueilPage() {
  // Accès rapides du vrai site de Brest
  const accesRapides = [
    {
      title: "Carte d'identité et passeport",
      description: "Demandes de CNI et passeports",
      icon: <FileText className="w-5 h-5" />,
      href: "/mairie/services#carte-identite"
    },
    {
      title: "Emplois et stages",
      description: "Offres d'emploi de la métropole",
      icon: <Briefcase className="w-5 h-5" />,
      href: "/mairie/services#emplois"
    },
    {
      title: "Travaux en cours",
      description: "Information trafic et chantiers",
      icon: <AlertCircle className="w-5 h-5" />,
      href: "/mairie/services#travaux"
    },
    {
      title: "Déchetteries",
      description: "Horaires et accès aux déchetteries",
      icon: <TreePine className="w-5 h-5" />,
      href: "/mairie/services#dechetteries"
    },
    {
      title: "Les plages",
      description: "Plages de la rade de Brest",
      icon: <Globe className="w-5 h-5" />,
      href: "/mairie/services#plages"
    },
    {
      title: "Se déplacer",
      description: "Transport et stationnement",
      icon: <Navigation className="w-5 h-5" />,
      href: "/mairie/services#transport"
    }
  ]
  ]

  // Services principaux
  const servicesHero = [
    {
      title: "Services en ligne",
      description: "Vos démarches administratives simplifiées",
      icon: <Globe className="w-8 h-8" />,
      color: "blue",
      href: "/mairie/services"
    },
    {
      title: "Actualités",
      description: "Toute l'actualité de la métropole",
      icon: <FileText className="w-8 h-8" />,
      color: "green",
      href: "/mairie/actualites"
    },
    {
      title: "Agenda",
      description: "Événements et sorties à Brest",
      icon: <Calendar className="w-8 h-8" />,
      color: "purple",
      href: "/mairie/agenda"
    },
    {
      title: "La Métropole",
      description: "Découvrir le territoire brestois",
      icon: <MapPin className="w-8 h-8" />,
      color: "orange",
      href: "/mairie/metropole"
    }
  ]

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200", 
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="accueil" />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Métropole de Brest • Finistère
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Ville de 
                  <span className="text-blue-600"> Brest</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Brest métropole facilite votre quotidien et vos démarches administratives. 
                  Retrouvez des informations pratiques et des actualités. Découvrez la richesse culturelle, 
                  respirez l'air du large !
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="primary" href="/mairie/services">
                  <FileText className="w-5 h-5 mr-2" />
                  Mes démarches
                </Button>
                <Button size="lg" variant="outline" href="/mairie/agenda">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agenda
                </Button>
              </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">140K+</div>
              <div className="text-sm text-gray-600">Habitants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Communes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24h/7j</div>
              <div className="text-sm text-gray-600">Services</div>
            </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1561467602-bff7f676c706?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85"
                alt="Brest - Vue sur la rade"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Accès rapides Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accès rapides</h2>
            <p className="text-lg text-gray-600">Les services les plus demandés</p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {accesRapides.map((acces, index) => (
              <Card key={index} className="group cursor-pointer hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      {acces.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{acces.title}</CardTitle>
                      <p className="text-sm text-gray-600">{acces.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vos services</h2>
            <p className="text-lg text-gray-600">Découvrez les services de la métropole brestoise</p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {servicesHero.map((service, index) => (
              <Card key={index} className="text-center group cursor-pointer hover:scale-[1.02] transition-all">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl ${colorClasses[service.color]} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <CardTitle className="mb-2">{service.title}</CardTitle>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <Button variant="outline" size="sm" href={service.href} className="group-hover:bg-blue-50">
                    Découvrir
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mise en avant */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 mb-4">
                Un été à Brest
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Un été plein de (re)découvertes !
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                L'été à venir sera pour nombre d'entre nous un moment plus calme, à la faveur des longues journées, 
                d'un soleil espéré, et d'un rythme souvent moins effréné que le reste de l'année. Visiteurs de quelques jours 
                ou habitants de toujours, il est temps de (re)découvrir les trésors de la métropole brestoise !
              </p>
              <Button variant="primary" href="/mairie/agenda">
                Voir le programme
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1705082121134-4c9314fae148?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85"
                alt="Brest - Vue côtière"
                className="rounded-xl shadow-lg w-full h-80 object-cover"
              />
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