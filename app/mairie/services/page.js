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
  UserCheck,
  Car,
  Trash2,
  Waves,
  Construction
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

// Composant Navigation - Thème Rouge
const Navigation = ({ currentPage = "services" }) => {
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

export default function ServicesPage() {
  // Services municipaux organisés par catégories - Palette Rouge
  const categoriesServices = [
    {
      title: "État Civil & Citoyenneté",
      icon: <UserCheck className="w-8 h-8" />,
      color: "red",
      services: [
        {
          name: "Carte d'identité et passeport",
          description: "Demandes, renouvellements CNI et passeports",
          status: "disponible",
          info: "Sur rendez-vous uniquement"
        },
        {
          name: "Actes d'état civil",
          description: "Actes de naissance, mariage, décès",
          status: "disponible",
          info: "En ligne ou en mairie"
        },
        {
          name: "PACS et mariages",
          description: "Déclaration PACS, célébrations",
          status: "disponible",
          info: "Sur rendez-vous"
        },
        {
          name: "Légalisations",
          description: "Légalisation de signatures",
          status: "disponible",
          info: "Aux horaires d'ouverture"
        }
      ]
    },
    {
      title: "Urbanisme & Habitat",
      icon: <Building2 className="w-8 h-8" />,
      color: "rose",
      services: [
        {
          name: "Permis de construire",
          description: "Dépôt et suivi des demandes",
          status: "disponible",
          info: "Instruction 2-3 mois"
        },
        {
          name: "Déclaration de travaux",
          description: "Travaux de rénovation",
          status: "disponible",
          info: "Instruction 1 mois"
        },
        {
          name: "Plan Local d'Urbanisme",
          description: "Consultation du PLU",
          status: "disponible",
          info: "Consultation libre"
        },
        {
          name: "Certificat d'urbanisme",
          description: "Renseignements d'urbanisme",
          status: "disponible",
          info: "Gratuit"
        }
      ]
    },
    {
      title: "Transport & Mobilité",
      icon: <Car className="w-8 h-8" />,
      color: "burgundy",
      services: [
        {
          name: "Travaux en cours",
          description: "Information trafic et chantiers",
          status: "disponible",
          info: "Mise à jour quotidienne"
        },
        {
          name: "Stationnement",
          description: "Zones, tarifs, abonnements",
          status: "disponible",
          info: "Centre-ville payant"
        },
        {
          name: "Transport en commun",
          description: "Bibus - lignes et horaires",
          status: "disponible",
          info: "24h/24 info trafic"
        },
        {
          name: "Vélos en libre service",
          description: "Vélib Brest métropole",
          status: "disponible",
          info: "45 stations"
        }
      ]
    },
    {
      title: "Environnement & Déchets",
      icon: <Trash2 className="w-8 h-8" />,
      color: "crimson",
      services: [
        {
          name: "Déchetteries",
          description: "Horaires et accès aux 8 déchetteries",
          status: "disponible",
          info: "Carte d'accès obligatoire"
        },
        {
          name: "Collecte des déchets",
          description: "Calendrier de collecte",
          status: "disponible",
          info: "Par quartier"
        },
        {
          name: "Compostage",
          description: "Composteurs individuels et collectifs",
          status: "disponible",
          info: "Formation gratuite"
        },
        {
          name: "Espaces verts",
          description: "Entretien et développement durable",
          status: "disponible",
          info: "Zéro phyto"
        }
      ]
    },
    {
      title: "Loisirs & Maritime",
      icon: <Waves className="w-8 h-8" />,
      color: "coral",
      services: [
        {
          name: "Plages de la métropole",
          description: "13 plages surveillées en été",
          status: "disponible",
          info: "Surveillance juillet-août"
        },
        {
          name: "Piscines municipales",
          description: "4 piscines + centre aquatique",
          status: "disponible",
          info: "Horaires variables"
        },
        {
          name: "Équipements sportifs",
          description: "Réservation terrains et salles",
          status: "disponible",
          info: "En ligne ou par téléphone"
        },
        {
          name: "Port de plaisance",
          description: "Mouillages et services portuaires",
          status: "disponible",
          info: "1er port de plaisance du Finistère"
        }
      ]
    },
    {
      title: "Emploi & Social",
      icon: <Briefcase className="w-8 h-8" />,
      color: "maroon",
      services: [
        {
          name: "Emplois et stages",
          description: "Offres de la métropole",
          status: "disponible",
          info: "Mise à jour hebdomadaire"
        },
        {
          name: "CCAS",
          description: "Centre Communal d'Action Sociale",
          status: "disponible",
          info: "Aide sociale et accompagnement"
        },
        {
          name: "Petite enfance",
          description: "Crèches et modes de garde",
          status: "disponible",
          info: "Inscription dès la naissance"
        },
        {
          name: "Logement social",
          description: "Demandes et attributions",
          status: "disponible",
          info: "Dossier unique Finistère"
        }
      ]
    }
  ]

  const colorClasses = {
    red: "bg-red-50 text-red-600 border-red-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200", 
    burgundy: "bg-red-100 text-red-700 border-red-300",
    crimson: "bg-red-50 text-red-700 border-red-200",
    coral: "bg-red-50 text-red-600 border-red-200",
    maroon: "bg-red-100 text-red-800 border-red-300"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="services" />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Services & Démarches
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Brest métropole facilite votre quotidien et vos démarches administratives. 
              Retrouvez tous les services municipaux organisés par thématiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="primary">
                <Search className="w-5 h-5 mr-2" />
                Rechercher un service
              </Button>
              <Button size="lg" variant="outline" href="/mairie/contact">
                <Phone className="w-5 h-5 mr-2" />
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Accès rapides */}
      <section className="py-12 bg-red-50 border-t border-red-100">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Accès les plus demandés</h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Carte d'identité</h3>
                <p className="text-sm text-gray-600">Rendez-vous en ligne</p>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Emplois</h3>
                <p className="text-sm text-gray-600">Offres de la métropole</p>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 text-red-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Construction className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Travaux</h3>
                <p className="text-sm text-gray-600">Infos trafic</p>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Waves className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Plages</h3>
                <p className="text-sm text-gray-600">13 plages surveillées</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services par catégories */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="space-y-12">
            {categoriesServices.map((categorie, index) => (
              <div key={index} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-xl ${colorClasses[categorie.color]} flex items-center justify-center`}>
                    {categorie.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{categorie.title}</h2>
                    <p className="text-gray-600">Services et démarches disponibles</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {categorie.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="group cursor-pointer hover:scale-[1.01] transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                              {service.status === 'disponible' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Disponible
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{service.description}</p>
                            <p className="text-sm text-red-600 font-medium">{service.info}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Besoin d'aide ?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner dans vos démarches. 
            N'hésitez pas à nous contacter pour tout renseignement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="primary" href="/mairie/contact">
              <Phone className="w-5 h-5 mr-2" />
              Nous contacter
            </Button>
            <Button size="lg" variant="outline">
              <Clock className="w-5 h-5 mr-2" />
              Prendre rendez-vous
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