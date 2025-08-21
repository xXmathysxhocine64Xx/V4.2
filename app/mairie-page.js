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

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nos Services Municipaux
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez l'ensemble de nos services pour vous accompagner dans vos démarches administratives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardHeader className="pb-4">
                  <div className={`${service.color} text-white p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {service.title}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    Accéder au service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités Section */}
      <section id="actualites" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Actualités de la Ville
            </h2>
            <p className="text-xl text-gray-600">
              Restez informé des dernières nouvelles et événements brestois
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {actualites.map((actualite) => (
              <Card key={actualite.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={actualite.image}
                    alt={actualite.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                    {actualite.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="text-sm text-gray-500 mb-2">{actualite.date}</div>
                  <CardTitle className="text-lg leading-tight">
                    {actualite.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{actualite.description}</p>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between">
                    Lire la suite
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Démarches Section */}
      <section id="demarches" className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Démarches en Ligne
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Simplifiez vos démarches administratives depuis chez vous, 24h/24 et 7j/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demarches.map((demarche, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-6 h-6" />
                    {demarche.status === 'available' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <CardTitle className="text-base">
                    {demarche.title}
                  </CardTitle>
                  <p className="text-blue-100 text-sm">{demarche.description}</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white hover:text-blue-600"
                    disabled={demarche.status === 'coming'}
                  >
                    {demarche.status === 'available' ? 'Commencer' : 'Bientôt'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nous Contacter
            </h2>
            <p className="text-xl text-gray-600">
              Notre équipe municipale est à votre service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Mairie de Brest
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Adresse</p>
                      <p className="text-gray-600">2 rue Frézier<br />29200 Brest, France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">Téléphone</p>
                      <p className="text-gray-600">02 98 00 80 80</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Horaires d'ouverture</p>
                      <div className="text-gray-600 text-sm">
                        <p>Lun-Ven: 8h30 - 17h00</p>
                        <p>Samedi: 9h00 - 12h00 (état civil uniquement)</p>
                        <p>Dimanche: Fermé</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">contact@brest.fr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                  Services d'urgence
                </h4>
                <div className="text-gray-600 text-sm space-y-1">
                  <p><strong>État civil urgent:</strong> 02 98 00 81 00</p>
                  <p><strong>Urgences techniques:</strong> 02 98 00 82 00</p>
                  <p><strong>Astreinte weekend:</strong> 02 98 00 80 80</p>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
                <p className="text-gray-600">Envoyez-nous votre demande, nous vous répondrons rapidement.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Nom complet *
                      </label>
                      <Input
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Téléphone
                      </label>
                      <Input
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        placeholder="02 98 00 00 00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Type de demande
                    </label>
                    <Select
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
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
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Votre message *
                    </label>
                    <Textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande en détail..."
                      rows={5}
                      required
                    />
                  </div>

                  {submitStatus && (
                    <div className={`p-4 rounded-md text-sm ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Nous nous engageons à vous répondre sous 48h ouvrées
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-xl font-bold">Ville de Brest</div>
                  <div className="text-sm text-gray-400">Finistère - Bretagne</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 text-sm">
                Brest, ville maritime du Finistère, vous accueille avec ses 
                140 000 habitants et son riche patrimoine maritime et culturel.
              </p>
              <div className="text-xs text-gray-400">
                <p>🏛️ Site de démonstration créé par GetYourSite</p>
                <p>Un exemple de portail municipal professionnel</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>État Civil</li>
                <li>Urbanisme</li>
                <li>Action Sociale</li>
                <li>Éducation</li>
                <li>Culture & Sport</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>02 98 00 80 80</li>
                <li>contact@brest.fr</li>
                <li>2 rue Frézier</li>
                <li>29200 Brest</li>
                <li>Lun-Ven: 8h30-17h</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Ville de Brest. Site de démonstration - Créé avec GetYourSite.fr</p>
          </div>
        </div>
      </footer>
    </div>
  )
}