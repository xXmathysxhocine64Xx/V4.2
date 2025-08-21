'use client'

import { useState, useEffect } from 'react'
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
  Layers
} from 'lucide-react'

// Composants UI modernes avec design futuriste
const Button = ({ children, className = "", variant = "default", size = "default", onClick, type, disabled }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 hover:shadow-lg"
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg",
    outline: "border border-blue-300 bg-white/80 backdrop-blur-sm text-blue-600 hover:bg-blue-50 hover:border-blue-400",
    ghost: "hover:bg-blue-100/50 text-blue-600 backdrop-blur-sm",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300",
    futuristic: "bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white hover:shadow-xl hover:shadow-blue-500/25"
  }
  const sizes = {
    default: "h-11 px-6 py-2",
    lg: "h-12 px-8 text-base",
    sm: "h-9 px-4 text-sm"
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
  <div className={`rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] ${className}`}>
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
  <h3 className={`text-xl font-bold leading-none tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </h3>
)

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${className}`}>
    {children}
  </span>
)

const Input = ({ className = "", ...props }) => (
  <input 
    className={`flex h-11 w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ${className}`} 
    {...props} 
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ${className}`} 
    {...props} 
  />
)

const Select = ({ children, className = "", ...props }) => (
  <select 
    className={`flex h-11 w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </select>
)

export default function MairiePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'demande-generale',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Services municipaux avec nouveau design futuriste
  const services = [
    {
      id: 1,
      title: "État Civil",
      description: "Actes de naissance, mariage, décès, PACS, légalisations",
      icon: <FileText className="w-7 h-7" />,
      gradient: "from-blue-500 to-blue-600",
      link: "#services"
    },
    {
      id: 2,
      title: "Urbanisme",
      description: "Permis de construire, déclarations de travaux, PLU",
      icon: <Building2 className="w-7 h-7" />,
      gradient: "from-green-500 to-emerald-600",
      link: "#services"
    },
    {
      id: 3,
      title: "Social & Famille",
      description: "CCAS, aide sociale, logement, petite enfance",
      icon: <Heart className="w-7 h-7" />,
      gradient: "from-rose-500 to-pink-600",
      link: "#services"
    },
    {
      id: 4,
      title: "Éducation",
      description: "Inscriptions scolaires, cantine, activités périscolaires",
      icon: <GraduationCap className="w-7 h-7" />,
      gradient: "from-amber-500 to-orange-600",
      link: "#services"
    },
    {
      id: 5,
      title: "Culture & Sport",
      description: "Bibliothèque, associations, équipements sportifs",
      icon: <Users className="w-7 h-7" />,
      gradient: "from-purple-500 to-violet-600",
      link: "#services"
    },
    {
      id: 6,
      title: "Environnement",
      description: "Collecte des déchets, espaces verts, développement durable",
      icon: <TreePine className="w-7 h-7" />,
      gradient: "from-emerald-500 to-green-600",
      link: "#services"
    }
  ]

  // Nouvelles actualités avec design moderne
  const actualites = [
    {
      id: 1,
      title: "Intelligence Artificielle au service des citoyens",
      date: "15 Janvier 2025",
      category: "Innovation",
      description: "Déploiement d'un assistant virtuel IA pour simplifier vos démarches administratives 24h/7j.",
      image: "https://images.unsplash.com/photo-1651589090232-215dee24a48b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxkaWdpdGFsJTIwZ292ZXJubWVudHxlbnwwfHx8Ymx1ZXwxNzU1NzczMjIyfDA&ixlib=rb-4.1.0&q=85",
      badge: "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
    },
    {
      id: 2,
      title: "Smart City : Brest 2030 en marche",
      date: "10 Janvier 2025",
      category: "Technologie",
      description: "Lancement du projet de ville intelligente avec capteurs IoT et gestion prédictive des services urbains.",
      image: "https://images.unsplash.com/photo-1512364615838-8088a04a778b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxmdXR1cmlzdGljJTIwY2l0eXxlbnwwfHx8Ymx1ZXwxNzU1NzczMjEyfDA&ixlib=rb-4.1.0&q=85",
      badge: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
    },
    {
      id: 3,
      title: "Mobilité verte : vélos électroniques partagés",
      date: "5 Janvier 2025",
      category: "Environnement",
      description: "Nouveau service de vélos électriques en libre-service avec stations intelligentes dans toute la métropole.",
      image: "https://images.unsplash.com/photo-1602660798203-714912a9e79a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxmdXR1cmlzdGljJTIwY2l0eXxlbnwwfHx8Ymx1ZXwxNzU1NzczMjEyfDA&ixlib=rb-4.1.0&q=85",
      badge: "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
    }
  ]

  // Démarches modernisées avec nouvelles technologies
  const demarches = [
    { 
      title: "Assistant IA - Démarches", 
      status: "available", 
      description: "Notre IA vous guide pas à pas",
      icon: <Cpu className="w-5 h-5" />,
      tech: true
    },
    { 
      title: "Blockchain - Identité numérique", 
      status: "available", 
      description: "Sécurité maximale garantie",
      icon: <Shield className="w-5 h-5" />,
      tech: true
    },
    { 
      title: "AR - Visite virtuelle services", 
      status: "coming", 
      description: "Réalité augmentée bientôt disponible",
      icon: <Layers className="w-5 h-5" />,
      tech: true
    },
    { 
      title: "API Citoyenne - Intégration", 
      status: "available", 
      description: "Connectez vos apps favorites",
      icon: <Globe className="w-5 h-5" />,
      tech: true
    }
  ]

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          subject: `Mairie de Brest - ${contactForm.subject}`,
          message: `Téléphone: ${contactForm.phone}\nType de demande: ${contactForm.subject}\n\n${contactForm.message}`
        })
      })

      if (response.ok) {
        setContactForm({ name: '', email: '', phone: '', subject: 'demande-generale', message: '' })
        setSubmitStatus({ type: 'success', message: 'Votre demande a été transmise avec succès!' })
      } else {
        setSubmitStatus({ type: 'error', message: 'Erreur lors de l\'envoi' })
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Une erreur de connexion est survenue' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 relative overflow-hidden">
      {/* Fond animé avec particules */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation futuriste */}
      <nav className="relative z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Ville de Brest
                </div>
                <div className="text-xs text-blue-200">Smart City • Finistère</div>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#accueil" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-300">Accueil</a>
              <a href="#services" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-300">Services</a>
              <a href="#actualites" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-300">Actualités</a>
              <a href="#demarches" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-300">Démarches</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors hover:scale-105 transform duration-300">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <Sparkles className="w-4 h-4 mr-2" />
                Espace Digital
              </Button>

              <Button 
                variant="ghost" 
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <MenuIcon />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-6 space-y-4 border-t border-white/20 pt-6">
              <a href="#accueil" className="block py-3 text-white/80 hover:text-white">Accueil</a>
              <a href="#services" className="block py-3 text-white/80 hover:text-white">Services</a>
              <a href="#actualites" className="block py-3 text-white/80 hover:text-white">Actualités</a>
              <a href="#demarches" className="block py-3 text-white/80 hover:text-white">Démarches</a>
              <a href="#contact" className="block py-3 text-white/80 hover:text-white">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section Futuriste */}
      <section id="accueil" className="relative py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Ville Intelligente • Version 2025
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                    Brest
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Digital City
                  </span>
                </h1>
                
                <p className="text-xl text-blue-100 max-w-lg leading-relaxed">
                  Découvrez la première ville intelligente de Bretagne. Services municipaux connectés, 
                  IA intégrée et expérience citoyenne révolutionnaire.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="futuristic" className="group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Explorer les Services
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Calendar className="w-5 h-5 mr-2" />
                  Assistant IA
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">140K+</div>
                  <div className="text-sm text-blue-200">Citoyens connectés</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-blue-200">Services IA</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">100%</div>
                  <div className="text-sm text-blue-200">Smart Services</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1549791084-5f78368b208b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MHx8fGJsdWV8MTc1NTc3MzIxN3ww&ixlib=rb-4.1.0&q=85"
                  alt="Brest Smart City"
                  className="relative rounded-3xl shadow-2xl w-full h-96 object-cover border border-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section Futuriste */}
      <section id="services" className="relative py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm mb-6">
              <Cpu className="w-4 h-4 mr-2" />
              Services Municipaux Intelligents
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Technologies au Service
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                des Citoyens
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez nos services municipaux modernisés par l'IA et les technologies émergentes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className={`bg-gradient-to-r ${service.gradient} text-white p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl mb-3 group-hover:scale-105 transition-transform duration-300">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50 transition-colors">
                    Accéder au service
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistiques avancées */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-blue-200 text-sm">Satisfaction IA</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">50ms</div>
              <div className="text-blue-200 text-sm">Temps réponse</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-blue-200 text-sm">Disponibilité</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">100K+</div>
              <div className="text-blue-200 text-sm">Requêtes/jour</div>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités Section Moderne */}
      <section id="actualites" className="relative py-24 px-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-400/30 text-violet-200 text-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Innovation & Actualités
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                L'avenir de Brest
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Se dessine aujourd'hui
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez les dernières innovations technologiques et projets smart city de notre métropole
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {actualites.map((actualite) => (
              <Card key={actualite.id} className="group overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={actualite.image}
                    alt={actualite.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <Badge className={`absolute top-4 left-4 ${actualite.badge} border-0`}>
                    {actualite.category}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white/80 text-sm mb-2">{actualite.date}</div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg leading-tight group-hover:scale-105 transition-transform duration-300">
                    {actualite.title}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">{actualite.description}</p>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">
                    Lire l'article complet
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Démarches Section Tech */}
      <section id="demarches" className="relative py-24 px-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/30 text-cyan-200 text-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Technologies Émergentes
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Démarches
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Nouvelle Génération
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez nos services administratifs révolutionnés par l'IA, la blockchain et les technologies immersives
            </p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {demarches.map((demarche, index) => (
              <Card key={index} className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/30">
                      {demarche.icon}
                    </div>
                    {demarche.status === 'available' ? (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-xs text-green-400 font-medium">ACTIF</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-medium">BIENTÔT</span>
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-white text-base mb-3 group-hover:scale-105 transition-transform duration-300">
                    {demarche.title}
                  </CardTitle>
                  <p className="text-blue-100 text-sm leading-relaxed">{demarche.description}</p>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    variant={demarche.status === 'available' ? 'futuristic' : 'outline'}
                    className={`w-full ${demarche.status === 'coming' ? 'opacity-50' : ''} group-hover:scale-105 transition-transform duration-300`}
                    disabled={demarche.status === 'coming'}
                  >
                    {demarche.status === 'available' ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Démarrer
                      </>
                    ) : (
                      'Prochainement'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section Innovation */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                Expérience Citoyenne Révolutionnaire
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Nos services intègrent l'IA conversationnelle, la réalité augmentée et la blockchain 
                pour vous offrir une expérience administrative sans précédent.
              </p>
              <Button variant="futuristic" size="lg">
                <Globe className="w-5 h-5 mr-2" />
                Découvrir la démo interactive
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section Moderne */}
      <section id="contact" className="relative py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 text-green-200 text-sm mb-6">
              <Mail className="w-4 h-4 mr-2" />
              Contact & Support
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Nous sommes là
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                pour vous accompagner
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Notre équipe municipale digitale est à votre service via l'IA, le chat en direct ou les canaux traditionnels
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informations de contact futuristes */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center mb-6">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 mr-3">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    Mairie Connectée de Brest
                  </CardTitle>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 mt-1">
                        <MapPin className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Adresse</p>
                        <p className="text-blue-200">2 rue Frézier<br />29200 Brest, France</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30">
                        <Phone className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Téléphone</p>
                        <p className="text-blue-200">02 98 00 80 80</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 mt-1">
                        <Clock className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Horaires d'ouverture</p>
                        <div className="text-blue-200 text-sm space-y-1">
                          <p>Lun-Ven: 8h30 - 17h00</p>
                          <p>Samedi: 9h00 - 12h00 (état civil uniquement)</p>
                          <p>Dimanche: Fermé</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/30">
                        <Mail className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Email</p>
                        <p className="text-blue-200">contact@brest.fr</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-violet-600/10 to-purple-600/10 border-violet-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center mb-4">
                    <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                    Services d'urgence & IA
                  </CardTitle>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200"><strong>Assistant IA 24/7:</strong></span>
                      <Button size="sm" variant="futuristic" className="text-xs">
                        <Cpu className="w-3 h-3 mr-1" />
                        Démarrer
                      </Button>
                    </div>
                    <p className="text-violet-200"><strong>État civil urgent:</strong> 02 98 00 81 00</p>
                    <p className="text-violet-200"><strong>Urgences techniques:</strong> 02 98 00 82 00</p>
                    <p className="text-violet-200"><strong>Astreinte weekend:</strong> 02 98 00 80 80</p>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Formulaire de contact moderne */}
            <Card className="bg-gradient-to-br from-white/15 to-white/5 border-white/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Contactez-nous
                </CardTitle>
                <p className="text-blue-200">Envoyez-nous votre demande, notre IA ou notre équipe vous répondra rapidement.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-blue-200">
                        Nom complet *
                      </label>
                      <Input
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        required
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3 text-blue-200">
                        Téléphone
                      </label>
                      <Input
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        placeholder="02 98 00 00 00"
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-blue-200">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-blue-200">
                      Type de demande
                    </label>
                    <Select
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/30 text-white"
                    >
                      <option value="demande-generale">Demande générale</option>
                      <option value="etat-civil">État civil</option>
                      <option value="urbanisme">Urbanisme</option>
                      <option value="social">Action sociale</option>
                      <option value="education">Éducation</option>
                      <option value="culture-sport">Culture et sport</option>
                      <option value="environnement">Environnement</option>
                      <option value="reclamation">Réclamation</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-blue-200">
                      Votre message *
                    </label>
                    <Textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande en détail..."
                      rows={5}
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-300"
                    />
                  </div>

                  {submitStatus && (
                    <div className={`p-4 rounded-xl text-sm border ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-600/20 text-green-200 border-green-400/30' 
                        : 'bg-red-600/20 text-red-200 border-red-400/30'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="futuristic"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Cpu className="w-5 h-5 mr-2 animate-spin" />
                        Traitement IA en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Envoyer ma demande
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-blue-300 text-center">
                    ⚡ Réponse automatique IA instantanée • Suivi humain sous 2h ouvrées
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Futuriste */}
      <footer className="relative py-16 px-6 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Ville de Brest
                  </div>
                  <div className="text-sm text-blue-300">Smart City • Finistère • Bretagne</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Brest, première ville intelligente du Finistère, vous accueille avec ses 
                140 000 habitants connectés et son écosystème technologique d'avant-garde. 
                Découvrez l'avenir de l'administration municipale.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Propulsé par l'Intelligence Artificielle</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  <span>Sécurisé par blockchain</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Connecté au réseau Smart Cities Europe</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-cyan-400" />
                Services IA
              </h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4 mr-2 text-cyan-400" />
                  Assistant virtuel 24/7
                </li>
                <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4 mr-2 text-purple-400" />
                  Démarches automatisées
                </li>
                <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4 mr-2 text-blue-400" />
                  Analyse prédictive
                </li>
                <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4 mr-2 text-green-400" />
                  Support multilingue
                </li>
                <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4 mr-2 text-orange-400" />
                  API développeurs
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Contact Digital
              </h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-400" />
                  02 98 00 80 80
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  ia@brest.digital
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                  2 rue Frézier, Brest
                </li>
                <li className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                  Smart City Hub
                </li>
                <li className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-400" />
                  IA: 24h/7j • Humains: 8h30-17h
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 lg:mb-0">
                <p>&copy; 2025 Ville de Brest • Site de démonstration Smart City</p>
                <p className="text-xs text-gray-500 mt-1">
                  ⚡ Créé avec GetYourSite.fr • Propulsé par l'IA • Design futuriste
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-400">
                  <Globe className="w-4 h-4 mr-2" />
                  API Docs
                </Button>
                <Button size="sm" variant="futuristic">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Lab Innovation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}