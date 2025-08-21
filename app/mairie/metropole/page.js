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
  Users,
  Home,
  Building,
  TreePine,
  Waves,
  Factory,
  GraduationCap,
  Heart,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Award,
  Globe,
  Anchor
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
const Navigation = ({ currentPage = "metropole" }) => {
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

export default function MetropolePage() {
  // Communes de Brest métropole
  const communes = [
    { nom: "Brest", population: 140064, maire: "François Cuillandre", statut: "Ville-centre" },
    { nom: "Bohars", population: 2842, maire: "Yann Jobic", statut: "Commune" },
    { nom: "Gouesnou", population: 3097, maire: "Fabrice Pélabay", statut: "Commune" },
    { nom: "Guilers", population: 7654, maire: "Patrick Leclerc", statut: "Commune" },
    { nom: "Guipavas", population: 14932, maire: "Denis Kerbrat", statut: "Commune" },
    { nom: "Le Relecq-Kerhuon", population: 11455, maire: "Yvon Bonnot", statut: "Commune" },
    { nom: "Plougastel-Daoulas", population: 13827, maire: "Dominique Cap", statut: "Commune" },
    { nom: "Plouzané", population: 13782, maire: "Ronan Pichon", statut: "Commune" }
  ]

  // Chiffres clés
  const chiffres = [
    { label: "Habitants", valeur: "213 653", description: "Population municipale", icon: <Users className="w-8 h-8" />, couleur: "blue" },
    { label: "Communes", valeur: "8", description: "Métropole océane", icon: <Building className="w-8 h-8" />, couleur: "green" },
    { label: "Superficie", valeur: "487 km²", description: "Territoire métropolitain", icon: <Globe className="w-8 h-8" />, couleur: "purple" },
    { label: "Emplois", valeur: "108 000", description: "Premier pôle d'emploi breton", icon: <TrendingUp className="w-8 h-8" />, couleur: "orange" }
  ]

  // Grands projets
  const grandsProjet = [
    {
      titre: "Nouvelle ligne de tramway B",
      description: "Extension du réseau de transport avec une nouvelle ligne desservant les quartiers Est de la métropole.",
      statut: "En construction",
      echeance: "2026",
      budget: "180 M€",
      icon: <Building className="w-6 h-6" />,
      couleur: "blue"
    },
    {
      titre: "Téléphérique urbain",
      description: "Liaison téléphérique innovante reliant le centre-ville aux hauteurs brestoises.",
      statut: "Étude",
      echeance: "2027",
      budget: "65 M€", 
      icon: <Waves className="w-6 h-6" />,
      couleur: "cyan"
    },
    {
      titre: "Reconversion des Capucins",
      description: "Transformation d'un ancien atelier naval en pôle culturel et numérique de référence.",
      statut: "Livré",
      echeance: "2017",
      budget: "95 M€",
      icon: <Factory className="w-6 h-6" />,
      couleur: "green"
    },
    {
      titre: "Campus Brest-Iroise",
      description: "Extension universitaire moderne avec laboratoires de recherche et espaces étudiants.",
      statut: "En cours",
      echeance: "2025",
      budget: "120 M€",
      icon: <GraduationCap className="w-6 h-6" />,
      couleur: "purple"
    }
  ]

  // Secteurs économiques
  const secteurs = [
    { nom: "Naval & Défense", description: "Premier port militaire français", emplois: "15 000", croissance: "+2.5%" },
    { nom: "Agroalimentaire", description: "Filière mer et productions locales", emplois: "8 500", croissance: "+1.8%" },
    { nom: "Numérique", description: "Technopôle et start-up innovantes", emplois: "12 000", croissance: "+5.2%" },
    { nom: "Recherche", description: "Sciences marines et technologies", emplois: "6 000", croissance: "+3.1%" }
  ]

  const couleursClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200", 
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="metropole" />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                  Finistère • Bretagne
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Brest 
                  <span className="text-blue-600"> Métropole</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Une métropole océane de 213 000 habitants au bout du Finistère. 
                  Découvrez un territoire maritime alliant innovation, tradition et qualité de vie exceptionnelle.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="primary">
                  <Globe className="w-5 h-5 mr-2" />
                  Découvrir le territoire
                </Button>
                <Button size="lg" variant="outline">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Économie & Innovation
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1705082121134-4c9314fae148?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85"
                alt="Brest - Vue sur la rade"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Brest métropole en chiffres</h2>
            <p className="text-lg text-gray-600">Un territoire dynamique au cœur de la Bretagne</p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {chiffres.map((chiffre, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl ${couleursClasses[chiffre.couleur]} flex items-center justify-center mx-auto mb-4`}>
                    {chiffre.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{chiffre.valeur}</div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">{chiffre.label}</div>
                  <div className="text-sm text-gray-600">{chiffre.description}</div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Les 8 communes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Les 8 communes</h2>
            <p className="text-lg text-gray-600">Un territoire unifié pour 213 000 habitants</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {communes.map((commune, index) => (
              <Card key={index} className="group cursor-pointer hover:scale-[1.01] transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{commune.nom}</h3>
                        {commune.statut === "Ville-centre" && (
                          <Badge className="bg-blue-100 text-blue-700">
                            Ville-centre
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-gray-600 text-sm">
                        <div><strong>{commune.population.toLocaleString()}</strong> habitants</div>
                        <div>Maire : {commune.maire}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Grands projets */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Grands projets du territoire</h2>
            <p className="text-lg text-gray-600">Investissements d'avenir pour une métropole moderne</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {grandsProjet.map((projet, index) => (
              <Card key={index} className="group cursor-pointer hover:scale-[1.01] transition-all">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${couleursClasses[projet.couleur]} flex-shrink-0`}>
                      {projet.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{projet.titre}</h3>
                        <Badge className={`${
                          projet.statut === 'Livré' ? 'bg-green-100 text-green-700' :
                          projet.statut === 'En construction' ? 'bg-blue-100 text-blue-700' :
                          projet.statut === 'En cours' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {projet.statut}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{projet.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Échéance : <strong>{projet.echeance}</strong></span>
                        <span className="text-blue-600 font-semibold">{projet.budget}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Économie */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Économie & Innovation</h2>
            <p className="text-lg text-gray-600">Des secteurs d'excellence au service de l'emploi</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {secteurs.map((secteur, index) => (
              <Card key={index} className="group cursor-pointer hover:scale-[1.01] transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{secteur.nom}</h3>
                      <p className="text-gray-600 mb-3">{secteur.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          <strong className="text-blue-600">{secteur.emplois}</strong> emplois
                        </span>
                        <span className={`text-sm font-medium ${
                          parseFloat(secteur.croissance) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {secteur.croissance}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Qualité de vie */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Une métropole qui ne manque pas d'air !
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Venir à Brest c'est faire le choix du collectif, de la maritimité et de l'inattendu. 
                Entre océan et terres, la métropole brestoise offre un cadre de vie unique en Bretagne.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Waves className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">13 plages surveillées l'été</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TreePine className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">40% d'espaces verts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Anchor className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">1er port de plaisance du Finistère</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">Label French Tech</span>
                </div>
              </div>

              <Button variant="primary" size="lg">
                <Globe className="w-5 h-5 mr-2" />
                Découvrir nos atouts
              </Button>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1661846141572-e52810543f57?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxicmVzdCUyMGJyaXR0YW55fGVufDB8fHxibHVlfDE3NTU3NzQ3ODd8MA&ixlib=rb-4.1.0&q=85"
                alt="Qualité de vie à Brest"
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