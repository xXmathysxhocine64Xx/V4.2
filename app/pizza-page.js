'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Plus,
  Minus,
  MapPin,
  Phone,
  Clock,
  Star,
  Users,
  Award,
  X,
  Menu as MenuIcon,
  Mail
} from 'lucide-react'

// Composants UI simples
const Button = ({ children, className = "", variant = "default", size = "default", onClick, type, disabled }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-red-300 bg-transparent text-red-600 hover:bg-red-50",
    ghost: "hover:bg-red-100 text-red-600",
    secondary: "bg-yellow-500 text-black hover:bg-yellow-600"
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
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
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
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
    {...props} 
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea 
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
    {...props} 
  />
)

export default function PizzaPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Menu des pizzas
  const pizzaMenu = [
    {
      id: 1,
      name: "Pizza Margherita",
      description: "Sauce tomate, mozzarella, basilic frais, huile d'olive",
      price: 12.90,
      image: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzU1NzI3MzAwfDA&ixlib=rb-4.1.0&q=85",
      popular: true
    },
    {
      id: 2,
      name: "Pizza Quattro Formaggi",
      description: "Mozzarella, gorgonzola, parmesan, chèvre",
      price: 16.90,
      image: "https://images.unsplash.com/photo-1713393281034-c7c9b046e1d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaXp6YXxlbnwwfHx8fDE3NTU3MjczMDZ8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: 3,
      name: "Pizza Prosciutto",
      description: "Sauce tomate, mozzarella, jambon de Parme, roquette",
      price: 18.90,
      image: "https://images.pexels.com/photos/33457533/pexels-photo-33457533.jpeg"
    },
    {
      id: 4,
      name: "Pizza Végétarienne",
      description: "Sauce tomate, mozzarella, courgettes, aubergines, poivrons, champignons",
      price: 15.90,
      image: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzU1NzI3MzAwfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: 5,
      name: "Pizza Diavola",
      description: "Sauce tomate, mozzarella, salami piquant, piment",
      price: 17.90,
      image: "https://images.unsplash.com/photo-1713393281034-c7c9b046e1d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaXp6YXxlbnwwfHx8fDE3NTU3MjczMDZ8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: 6,
      name: "Pizza Capricciosa",
      description: "Sauce tomate, mozzarella, jambon, champignons, artichauts, olives",
      price: 19.90,
      image: "https://images.pexels.com/photos/33457533/pexels-photo-33457533.jpeg"
    }
  ]

  // Ajouter au panier
  const addToCart = (pizza) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === pizza.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...pizza, quantity: 1 }]
      }
    })
  }

  // Modifier quantité
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id))
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  // Calculer le total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Nombre d'articles dans le panier
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

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
          subject: "Commande Pizza Bella Vita",
          message: `Téléphone: ${contactForm.phone}\n\n${contactForm.message}`
        })
      })

      if (response.ok) {
        setContactForm({ name: '', email: '', phone: '', message: '' })
        setSubmitStatus({ type: 'success', message: 'Votre message a été envoyé avec succès!' })
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-red-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-red-800">
                Pizza <span className="text-yellow-500">Bella Vita</span>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#accueil" className="text-gray-600 hover:text-red-600 transition-colors">Accueil</a>
              <a href="#menu" className="text-gray-600 hover:text-red-600 transition-colors">Menu</a>
              <a href="#apropos" className="text-gray-600 hover:text-red-600 transition-colors">À Propos</a>
              <a href="#contact" className="text-gray-600 hover:text-red-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              {/* Panier */}
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Panier
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                    {getCartItemsCount()}
                  </Badge>
                )}
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
            <div className="md:hidden mt-4 space-y-2">
              <a href="#accueil" className="block py-2 text-gray-600 hover:text-red-600">Accueil</a>
              <a href="#menu" className="block py-2 text-gray-600 hover:text-red-600">Menu</a>
              <a href="#apropos" className="block py-2 text-gray-600 hover:text-red-600">À Propos</a>
              <a href="#contact" className="block py-2 text-gray-600 hover:text-red-600">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                Authentique
                <span className="text-red-600 block">Pizza Italienne</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
                Découvrez nos pizzas artisanales préparées avec des ingrédients frais 
                et une pâte traditionnelle pétrie à la main chaque jour.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <a href="#menu">Voir notre Menu</a>
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Commander: 01 23 45 67 89
                </Button>
              </div>
              
              <div className="flex items-center gap-8 justify-center md:justify-start pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">5★</div>
                  <div className="text-sm text-gray-600">Avis clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">30min</div>
                  <div className="text-sm text-gray-600">Livraison</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">100%</div>
                  <div className="text-sm text-gray-600">Artisanale</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-500 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzU1NzI3MzAwfDA&ixlib=rb-4.1.0&q=85" 
                alt="Pizzas artisanales"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Notre Menu
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des pizzas authentiques préparées avec des ingrédients de première qualité
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzaMenu.map((pizza) => (
              <Card key={pizza.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                {pizza.popular && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-black z-10">
                    Populaire
                  </Badge>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl flex justify-between items-center">
                    {pizza.name}
                    <span className="text-red-600 font-bold">{pizza.price.toFixed(2)}€</span>
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{pizza.description}</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => addToCart(pizza)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter au panier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* À Propos Section */}
      <section id="apropos" className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Notre Histoire
              </h2>
              <p className="text-gray-300 text-lg">
                Depuis 1985, Pizza Bella Vita perpétue la tradition italienne avec 
                des recettes authentiques transmises de génération en génération.
              </p>
              <p className="text-gray-300">
                Notre chef pizzaïolo, originaire de Naples, prépare chaque pizza 
                avec passion dans notre four à bois traditionnel. Nous sélectionnons 
                rigoureusement nos ingrédients : mozzarella di bufala, tomates San Marzano, 
                basilic frais et huile d'olive extra vierge.
              </p>
              
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <Award className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Authentique</h3>
                  <p className="text-sm text-gray-400">Recettes traditionnelles</p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Familial</h3>
                  <p className="text-sm text-gray-400">Ambiance chaleureuse</p>
                </div>
                <div className="text-center">
                  <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                  <h3 className="font-semibold">Qualité</h3>
                  <p className="text-sm text-gray-400">Ingrédients premium</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6605189/pexels-photo-6605189.jpeg" 
                alt="Chef pizzaïolo au travail"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Contact & Commandes
            </h2>
            <p className="text-xl text-gray-600">
              Contactez-nous pour vos commandes ou réservations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Informations
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-800">Adresse</p>
                      <p className="text-gray-600">123 Rue de la Pizza, 75001 Paris</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-800">Téléphone</p>
                      <p className="text-gray-600">01 23 45 67 89</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Clock className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-800">Horaires</p>
                      <p className="text-gray-600">Lun-Dim: 11h00 - 23h00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">contact@pizzabellavita.fr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🚀 Livraison Rapide
                </h4>
                <p className="text-gray-600 text-sm">
                  Livraison gratuite à partir de 25€ - Délai moyen: 30 minutes
                </p>
              </div>
            </div>

            {/* Formulaire de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Passer une commande</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
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
                        Téléphone *
                      </label>
                      <Input
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        placeholder="01 23 45 67 89"
                        required
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
                      Votre commande / Message *
                    </label>
                    <Textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder="Détaillez votre commande ou votre message..."
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
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la commande'}
                  </Button>
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
              <div className="text-2xl font-bold mb-4">
                Pizza <span className="text-yellow-400">Bella Vita</span>
              </div>
              <p className="text-gray-300 mb-4">
                La plus authentique des pizzerias parisiennes. Venez découvrir 
                nos pizzas traditionnelles dans une ambiance familiale et chaleureuse.
              </p>
              <div className="text-sm text-gray-400">
                <p>🍕 Site de démonstration créé par GetYourSite</p>
                <p>Un exemple de ce que nous pouvons créer pour votre business</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Pizzas Classiques</li>
                <li>Pizzas Spéciales</li>
                <li>Antipasti</li>
                <li>Desserts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>01 23 45 67 89</li>
                <li>contact@pizzabellavita.fr</li>
                <li>123 Rue de la Pizza</li>
                <li>75001 Paris</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pizza Bella Vita. Site de démonstration - Créé avec GetYourSite.fr</p>
          </div>
        </div>
      </footer>

      {/* Panier Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Votre Panier</h3>
                <Button variant="ghost" onClick={() => setIsCartOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Votre panier est vide</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.price.toFixed(2)}€</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold text-red-600">
                        {getCartTotal().toFixed(2)}€
                      </span>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Passer Commande
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Ceci est une démonstration - aucune commande réelle ne sera passée
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}