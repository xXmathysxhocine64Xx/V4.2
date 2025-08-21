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
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink
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

const Input = ({ className = "", ...props }) => (
  <input 
    className={`flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`} 
    {...props} 
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`} 
    {...props} 
  />
)

const Select = ({ children, className = "", ...props }) => (
  <select 
    className={`flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </select>
)

// Composant Navigation - Thème Rouge
const Navigation = ({ currentPage = "contact" }) => {
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

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'demande-generale',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

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
        setSubmitStatus({ type: 'success', message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les meilleurs délais.' })
      } else {
        setSubmitStatus({ type: 'error', message: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.' })
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.' })
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

  // Informations de contact - Thème Rouge
  const contactInfos = [
    {
      title: "Adresse",
      icon: <MapPin className="w-5 h-5 text-red-600" />,
      content: ["2 rue Frézier", "29200 Brest", "France"],
      color: "red"
    },
    {
      title: "Téléphone",
      icon: <Phone className="w-5 h-5 text-rose-600" />,
      content: ["Standard : 02 98 00 80 80", "Accueil : 02 98 00 80 00"],
      color: "rose"
    },
    {
      title: "Email",
      icon: <Mail className="w-5 h-5 text-red-700" />,
      content: ["contact@brest.fr", "info@brest-metropole.fr"],
      color: "burgundy"
    },
    {
      title: "Horaires",
      icon: <Clock className="w-5 h-5 text-red-600" />,
      content: ["Lun-Ven : 8h30 - 17h00", "Sam : 9h00 - 12h00 (état civil)", "Dim : Fermé"],
      color: "crimson"
    }
  ]

  // Services d'urgence
  const urgences = [
    { service: "État civil urgent", numero: "02 98 00 81 00", horaires: "7j/7 - 24h/24" },
    { service: "Urgences techniques", numero: "02 98 00 82 00", horaires: "7j/7 - 24h/24" },
    { service: "Astreinte weekend", numero: "02 98 00 80 80", horaires: "Sam-Dim : 9h-17h" },
    { service: "Police municipale", numero: "02 98 00 83 00", horaires: "Lun-Sam : 8h-20h" }
  ]

  // Mairies annexes
  const mairiesAnnexes = [
    { nom: "Mairie de Bellevue", adresse: "1 Place Napoléon III", tel: "02 98 00 81 10" },
    { nom: "Mairie de Saint-Marc", adresse: "2 rue de la Paix", tel: "02 98 00 81 20" },
    { nom: "Mairie des Quatre Moulins", adresse: "Place des Quatre Moulins", tel: "02 98 00 81 30" },
    { nom: "Mairie de Lambézellec", adresse: "Place de Lambézellec", tel: "02 98 00 81 40" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="contact" />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Nous Contacter
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              L'équipe de Brest métropole est à votre service pour vous accompagner 
              dans vos démarches et répondre à toutes vos questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="primary">
                <Phone className="w-5 h-5 mr-2" />
                02 98 00 80 80
              </Button>
              <Button size="lg" variant="outline">
                <Mail className="w-5 h-5 mr-2" />
                contact@brest.fr
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Informations de contact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nos coordonnées</h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {contactInfos.map((info, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {info.icon}
                  </div>
                  <CardTitle className="text-lg mb-3">{info.title}</CardTitle>
                  <div className="space-y-1 text-gray-600">
                    {info.content.map((line, lineIndex) => (
                      <div key={lineIndex} className="text-sm">{line}</div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Envoyer un message
                </CardTitle>
                <p className="text-gray-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Nom complet *
                      </label>
                      <Input
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom et prénom"
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
                      <option value="transport">Transport</option>
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
                    <div className={`p-4 rounded-lg text-sm ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <div className="flex items-start">
                        {submitStatus.type === 'success' ? (
                          <CheckCircle className="w-5 h-5 mr-2 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                        )}
                        {submitStatus.message}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    * Champs obligatoires • Réponse sous 48h ouvrées
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Informations complémentaires */}
            <div className="space-y-8">
              {/* Services d'urgence */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">Services d'urgence</CardTitle>
                  <p className="text-gray-600 text-sm">
                    Pour les demandes urgentes en dehors des heures d'ouverture
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {urgences.map((urgence, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{urgence.service}</div>
                          <div className="text-sm text-gray-600">{urgence.horaires}</div>
                        </div>
                        <div className="text-right">
                          <a 
                            href={`tel:${urgence.numero.replace(/\s/g, '')}`}
                            className="font-bold text-red-600 hover:underline"
                          >
                            {urgence.numero}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mairies annexes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mairies de quartier</CardTitle>
                  <p className="text-gray-600 text-sm">
                    Services de proximité dans les quartiers de Brest
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mairiesAnnexes.map((mairie, index) => (
                      <div key={index} className="border-l-4 border-red-200 pl-4">
                        <div className="font-medium text-gray-900">{mairie.nom}</div>
                        <div className="text-sm text-gray-600">{mairie.adresse}</div>
                        <div className="text-sm text-red-600 font-medium">{mairie.tel}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Localisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nous trouver</CardTitle>
                  <p className="text-gray-600 text-sm">
                    Hôtel de Ville au cœur de Brest
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <MapPin className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <div className="font-medium">2 rue Frézier</div>
                      <div className="text-gray-600">29200 Brest</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Transports :</strong></p>
                      <p>• Bus : Lignes 1, 2, 3 - Arrêt "Hôtel de Ville"</p>
                      <p>• Tram : Ligne A - Station "Liberté"</p>
                      <p>• Parking : Liberté (payant)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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