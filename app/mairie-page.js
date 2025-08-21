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

// Composants UI simples
const Button = ({ children, className = "", variant = "default", size = "default", onClick, type, disabled }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-300 bg-transparent text-blue-600 hover:bg-blue-50",
    ghost: "hover:bg-blue-100 text-blue-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8",
    sm: "h-8 px-3 text-sm"
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
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
)

const Input = ({ className = "", ...props }) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
    {...props} 
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
    {...props} 
  />
)

const Select = ({ children, className = "", ...props }) => (
  <select 
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
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

  // Services municipaux
  const services = [
    {
      id: 1,
      title: "État Civil",
      description: "Actes de naissance, mariage, décès, PACS, légalisations",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-500",
      link: "#services"
    },
    {
      id: 2,
      title: "Urbanisme",
      description: "Permis de construire, déclarations de travaux, PLU",
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-green-500",
      link: "#services"
    },
    {
      id: 3,
      title: "Social & Famille",
      description: "CCAS, aide sociale, logement, petite enfance",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-rose-500",
      link: "#services"
    },
    {
      id: 4,
      title: "Éducation",
      description: "Inscriptions scolaires, cantine, activités périscolaires",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "bg-amber-500",
      link: "#services"
    },
    {
      id: 5,
      title: "Culture & Sport",
      description: "Bibliothèque, associations, équipements sportifs",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500",
      link: "#services"
    },
    {
      id: 6,
      title: "Environnement",
      description: "Collecte des déchets, espaces verts, développement durable",
      icon: <TreePine className="w-6 h-6" />,
      color: "bg-emerald-500",
      link: "#services"
    }
  ]

  // Actualités
  const actualites = [
    {
      id: 1,
      title: "Nouvelle ligne de bus écologique",
      date: "15 Janvier 2024",
      category: "Transport",
      description: "Mise en service d'une ligne de bus électrique reliant le centre-ville au port de commerce.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      id: 2,
      title: "Rénovation du centre culturel",
      date: "10 Janvier 2024",
      category: "Culture",
      description: "Lancement des travaux de modernisation du centre culturel avec une réouverture prévue en septembre.",
      image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      title: "Concours jeunes entrepreneurs",
      date: "5 Janvier 2024",
      category: "Économie",
      description: "Candidatures ouvertes pour le concours d'aide à la création d'entreprise destiné aux jeunes brestois.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    }
  ]

  // Démarches en ligne
  const demarches = [
    { title: "Demande d'acte de naissance", status: "available", description: "Obtenez votre acte en ligne" },
    { title: "Inscription scolaire", status: "available", description: "Inscrivez votre enfant pour la rentrée" },
    { title: "Déclaration de travaux", status: "coming", description: "Bientôt disponible en ligne" },
    { title: "Demande de logement social", status: "available", description: "Déposez votre dossier" }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-xl font-bold text-blue-800">Ville de Brest</div>
                <div className="text-xs text-gray-600">Finistère - Bretagne</div>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#accueil" className="text-gray-600 hover:text-blue-600 transition-colors">Accueil</a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#actualites" className="text-gray-600 hover:text-blue-600 transition-colors">Actualités</a>
              <a href="#demarches" className="text-gray-600 hover:text-blue-600 transition-colors">Démarches</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Espace Citoyen
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
            <div className="md:hidden mt-4 space-y-2 border-t border-gray-200 pt-4">
              <a href="#accueil" className="block py-2 text-gray-600 hover:text-blue-600">Accueil</a>
              <a href="#services" className="block py-2 text-gray-600 hover:text-blue-600">Services</a>
              <a href="#actualites" className="block py-2 text-gray-600 hover:text-blue-600">Actualités</a>
              <a href="#demarches" className="block py-2 text-gray-600 hover:text-blue-600">Démarches</a>
              <a href="#contact" className="block py-2 text-gray-600 hover:text-blue-600">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                Bienvenue à
                <span className="text-blue-600 block">Brest</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Votre ville maritime au cœur de la Bretagne. Découvrez nos services 
                municipaux, actualités et démarches en ligne pour faciliter votre quotidien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <a href="#services">Nos Services</a>
                </Button>
                <Button size="lg" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Prendre RDV
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">140 000</div>
                  <div className="text-sm text-gray-600">Habitants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24h/7j</div>
                  <div className="text-sm text-gray-600">Services urgents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600">Démat. progressif</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Port de Brest"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
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