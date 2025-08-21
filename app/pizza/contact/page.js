'use client'

import { useState } from 'react'
import { 
  ChefHat,
  MapPin,
  Phone,
  Clock,
  Mail,
  Check,
  Instagram,
  Facebook,
  X,
  Menu as MenuIcon,
  Star
} from 'lucide-react'
import Link from 'next/link'

// Composants UI modernes
const Button = ({ children, className = "", variant = "default", size = "default", onClick, type, disabled, href }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-orange-300 bg-transparent text-orange-700 hover:bg-orange-50 focus-visible:ring-orange-500",
    ghost: "hover:bg-orange-50 text-orange-700 focus-visible:ring-orange-500"
  }
  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-sm",
    lg: "h-12 px-8 text-base"
  }
  
  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
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

const Input = ({ className = "", ...props }) => (
  <input 
    className={`flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
    {...props} 
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
    {...props} 
  />
)

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-orange-100 text-orange-800",
    popular: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
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
          subject: "Contact Lucky Pizza Lannilis",
          message: `Téléphone: ${contactForm.phone}\n\n${contactForm.message}`
        })
      })

      if (response.ok) {
        setContactForm({ name: '', email: '', phone: '', message: '' })
        setSubmitStatus({ type: 'success', message: 'Votre message a été envoyé avec succès! Nous vous répondrons rapidement.' })
      } else {
        setSubmitStatus({ type: 'error', message: 'Erreur lors de l\'envoi du message' })
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <Link href="/pizza/accueil" className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                Lucky Pizza <span className="text-lg text-gray-600">Lannilis</span>
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/pizza/accueil" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Accueil</Link>
              <Link href="/pizza/menu" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Menu</Link>
              <Link href="/pizza/a-propos" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">À Propos</Link>
              <Link href="/pizza/contact" className="text-orange-600 hover:text-orange-700 transition-colors font-medium border-b-2 border-orange-600">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
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
            <div className="md:hidden mt-4 space-y-2 border-t border-orange-100 pt-4">
              <Link href="/pizza/accueil" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Accueil</Link>
              <Link href="/pizza/menu" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Menu</Link>
              <Link href="/pizza/a-propos" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">À Propos</Link>
              <Link href="/pizza/contact" className="block py-2 text-orange-600 hover:text-orange-700 font-medium">Contact</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="popular" className="mb-6">
            📍 Trouvez-nous
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Lucky Pizza
            <span className="block bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Lannilis
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Venez découvrir notre restaurant au cœur de Lannilis ou commandez en ligne. 
            Notre équipe vous accueille avec le sourire et la passion de la pizza authentique.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Informations Restaurant
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Adresse</p>
                      <p className="text-gray-600">12 Place du Général Leclerc<br />29870 Lannilis, France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Téléphone</p>
                      <p className="text-gray-600">02 98 04 12 34</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Horaires</p>
                      <div className="text-gray-600">
                        <p>Mar-Dim: 11h30 - 14h00 & 18h00 - 22h00</p>
                        <p className="text-sm text-red-600">Fermé le lundi</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contact@luckypizza-lannilis.fr</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-r from-orange-600 to-amber-500 text-white">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  🚀 Livraison Express
                </h3>
                <div className="space-y-3">
                  <p className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Livraison gratuite dès 25€
                  </p>
                  <p className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Zone: 15km autour de Lannilis
                  </p>
                  <p className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Délai moyen: 25-30 minutes
                  </p>
                  <p className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Paiement en ligne sécurisé
                  </p>
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Avis Clients
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">4.8/5</span>
                    <span className="text-gray-600">(+500 avis)</span>
                  </div>
                  <p className="text-gray-600 italic">
                    "Les meilleures pizzas du Finistère ! Paolo est un vrai artiste, 
                    et l'équipe est toujours souriante. Lucky Pizza, c'est notre cantine !"
                  </p>
                  <p className="text-sm text-gray-500">- Marie L., Cliente fidèle</p>
                </div>
              </Card>
            </div>

            {/* Formulaire de contact */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Contactez-nous
                  </h2>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Nom *
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
                          placeholder="02 98 04 12 34"
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
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="Votre message, question ou suggestion..."
                        rows={5}
                        required
                      />
                    </div>

                    {submitStatus && (
                      <div className={`p-4 rounded-lg text-sm ${
                        submitStatus.type === 'success' 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {submitStatus.message}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Photo du restaurant */}
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1689915972091-debe902f72fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzU1Nzc3NDI3fDA&ixlib=rb-4.1.0&q=85" 
                  alt="Lucky Pizza Lannilis Restaurant"
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Notre Restaurant
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Venez découvrir notre cadre chaleureux au cœur de Lannilis. 
                    Salle climatisée avec 45 places, terrasse ensoleillée et vue sur notre four à bois traditionnel.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Google Maps
                    </Button>
                    <Button href="/pizza/menu" className="flex-1">
                      Voir le Menu
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Réseaux sociaux */}
              <Card className="p-6 text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Suivez-nous
                </h4>
                <p className="text-gray-600 mb-4">
                  Restez connectés pour nos actualités, nouveautés et offres spéciales
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-amber-500">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Une Envie de Pizza ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Commandez en ligne ou appelez-nous directement. 
            Votre pizza sera prête en 25-30 minutes !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/pizza/menu" size="lg" className="bg-white text-orange-600 hover:bg-gray-50">
              Commander en Ligne
            </Button>
            <Button href="tel:0298041234" size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="w-4 h-4 mr-2" />
              02 98 04 12 34
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-white" />
                </div>
                <div className="text-2xl font-bold">
                  Lucky Pizza <span className="text-orange-400">Lannilis</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                La tradition napolitaine au cœur du Finistère. 
                Pizzas artisanales, ingrédients d'exception, four à bois traditionnel. 
                Une expérience authentique depuis 2018.
              </p>
              <div className="text-sm text-gray-400">
                <p>🍕 Site de démonstration - Refonte moderne par GetYourSite</p>
                <p>Exemple de ce que nous créons pour votre business</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Navigation</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/pizza/accueil" className="hover:text-orange-400 transition-colors">Accueil</Link></li>
                <li><Link href="/pizza/menu" className="hover:text-orange-400 transition-colors">Menu</Link></li>
                <li><Link href="/pizza/a-propos" className="hover:text-orange-400 transition-colors">À Propos</Link></li>
                <li><Link href="/pizza/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>02 98 04 12 34</li>
                <li>contact@luckypizza-lannilis.fr</li>
                <li>12 Place du Général Leclerc</li>
                <li>29870 Lannilis, France</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lucky Pizza Lannilis. Refonte moderne - Propulsé par GetYourSite.fr</p>
          </div>
        </div>
      </footer>
    </div>
  )
}