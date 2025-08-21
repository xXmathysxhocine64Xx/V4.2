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
  Mail,
  CreditCard,
  Check,
  Loader2,
  ChefHat,
  Heart,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react'

// Composants UI modernes
const Button = ({ children, className = "", variant = "default", size = "default", onClick, type, disabled, loading }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-orange-300 bg-transparent text-orange-700 hover:bg-orange-50 focus-visible:ring-orange-500",
    ghost: "hover:bg-orange-50 text-orange-700 focus-visible:ring-orange-500",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 shadow-md"
  }
  const sizes = {
    default: "h-11 px-6 py-2",
    lg: "h-12 px-8 text-base",
    sm: "h-9 px-4 text-sm",
    xl: "h-14 px-10 text-lg"
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
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
  <h3 className={`text-xl font-semibold leading-none tracking-tight text-gray-900 ${className}`}>
    {children}
  </h3>
)

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-orange-100 text-orange-800",
    success: "bg-green-100 text-green-800",
    popular: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
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

// Fonction pour obtenir les paramètres URL
function getUrlParameter(name) {
  if (typeof window === 'undefined') return ''
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export default function LuckyPizzaPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Menu des pizzas Lucky Pizza Lannilis
  const pizzaMenu = [
    {
      id: 1,
      package_id: 'margherita',
      name: "Margherita Authentique",
      description: "Sauce tomate San Marzano, mozzarella di bufala, basilic frais, huile d'olive extra vierge",
      price: 12.90,
      image: "https://images.unsplash.com/photo-1713393281034-c7c9b046e1d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaXp6YXxlbnwwfHx8fDE3NTU3Nzc0Mzh8MA&ixlib=rb-4.1.0&q=85",
      popular: true
    },
    {
      id: 2,
      package_id: 'napoletana',
      name: "Napoletana Traditionelle",
      description: "Sauce tomate, mozzarella, anchois, olives noires, origan, ail",
      price: 15.90,
      image: "https://images.pexels.com/photos/784636/pexels-photo-784636.jpeg"
    },
    {
      id: 3,
      package_id: 'quattro_formaggi',
      name: "Quattro Formaggi Déluxe",
      description: "Mozzarella, gorgonzola DOP, parmesan vieilli 24 mois, chèvre de Lannilis",
      price: 18.90,
      image: "https://images.pexels.com/photos/6969975/pexels-photo-6969975.jpeg"
    },
    {
      id: 4,
      package_id: 'diavola',
      name: "Diavola Piccante",
      description: "Sauce tomate épicée, mozzarella, salami piquant, piment de Calabre, huile piquante",
      price: 17.90,
      image: "https://images.unsplash.com/photo-1689915972091-debe902f72fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzU1Nzc3NDI3fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: 5,
      package_id: 'vegetariana',
      name: "Végétarienne du Terroir",
      description: "Sauce tomate, mozzarella, légumes de saison locaux, herbes de Provence, pesto basilic",
      price: 16.90,
      image: "https://images.unsplash.com/photo-1573586698223-e9502ddf5b07?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzU1Nzc3NDI3fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: 6,
      package_id: 'prosciutto',
      name: "Prosciutto & Roquette",
      description: "Sauce tomate, mozzarella, prosciutto di Parma 18 mois, roquette fraîche, copeaux de parmesan",
      price: 19.90,
      image: "https://images.unsplash.com/photo-1713393281034-c7c9b046e1d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaXp6YXxlbnwwfHx8fDE3NTU3Nzc0Mzh8MA&ixlib=rb-4.1.0&q=85"
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

  // Fonction de paiement
  const handlePayment = async (packageId, pizzaName) => {
    setIsProcessingPayment(true)
    setPaymentStatus(null)
    
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: packageId,
          metadata: {
            pizza_name: pizzaName,
            restaurant: 'Lucky Pizza Lannilis'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      const data = await response.json()
      
      if (data.url) {
        // Redirection vers Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('URL de paiement non reçue')
      }
    } catch (error) {
      console.error('Erreur de paiement:', error)
      setPaymentStatus({ type: 'error', message: 'Erreur lors du paiement: ' + error.message })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Polling du statut de paiement
  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5
    const pollInterval = 2000

    if (attempts >= maxAttempts) {
      setPaymentStatus({ 
        type: 'error', 
        message: 'Vérification du paiement expirée. Veuillez vérifier votre email.' 
      })
      return
    }

    try {
      const response = await fetch(`/api/payments/status/${sessionId}`)
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification')
      }

      const data = await response.json()
      
      if (data.payment_status === 'paid') {
        setPaymentStatus({ 
          type: 'success', 
          message: 'Paiement réussi ! Merci pour votre commande.' 
        })
        setCart([]) // Vider le panier
        return
      } else if (data.status === 'expired') {
        setPaymentStatus({ 
          type: 'error', 
          message: 'Session de paiement expirée. Veuillez recommencer.' 
        })
        return
      }

      // Si le paiement est toujours en cours, continuer le polling
      setPaymentStatus({ 
        type: 'pending', 
        message: 'Traitement du paiement en cours...' 
      })
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval)
    } catch (error) {
      console.error('Erreur lors de la vérification:', error)
      setPaymentStatus({ 
        type: 'error', 
        message: 'Erreur de vérification. Veuillez réessayer.' 
      })
    }
  }

  // Vérifier si on revient de Stripe
  useEffect(() => {
    const sessionId = getUrlParameter('session_id')
    if (sessionId) {
      setPaymentStatus({ 
        type: 'pending', 
        message: 'Vérification du paiement...' 
      })
      pollPaymentStatus(sessionId)
    }
  }, [])

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
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                Lucky Pizza <span className="text-lg text-gray-600">Lannilis</span>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#accueil" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Accueil</a>
              <a href="#menu" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Menu</a>
              <a href="#apropos" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">À Propos</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</a>
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
                  <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full">
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
            <div className="md:hidden mt-4 space-y-2 border-t border-orange-100 pt-4">
              <a href="#accueil" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Accueil</a>
              <a href="#menu" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Menu</a>
              <a href="#apropos" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">À Propos</a>
              <a href="#contact" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* Status de paiement */}
      {paymentStatus && (
        <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          paymentStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : paymentStatus.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {paymentStatus.type === 'success' && <Check className="w-5 h-5 mr-2" />}
              {paymentStatus.type === 'pending' && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              <span>{paymentStatus.message}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPaymentStatus(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="accueil" className="py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="popular" className="text-sm px-4 py-2">
                  🏆 Meilleure Pizzeria de Lannilis 2024
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  L'Art de la
                  <span className="block bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                    Pizza Italienne
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  Découvrez nos pizzas artisanales préparées avec passion selon les traditions napolitaines. 
                  Ingrédients frais, pâte fermentée 72h, four à bois traditionnel.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" className="group">
                  <a href="#menu" className="flex items-center">
                    Découvrir notre Menu
                    <ChefHat className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                  </a>
                </Button>
                <Button size="xl" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  02 98 04 12 34
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-400 mr-1" />
                    4.8
                  </div>
                  <div className="text-sm text-gray-600">+500 avis Google</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">25min</div>
                  <div className="text-sm text-gray-600">Livraison moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-500 mr-1" />
                    100%
                  </div>
                  <div className="text-sm text-gray-600">Fait maison</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl transform rotate-3 opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1713393281034-c7c9b046e1d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaXp6YXxlbnwwfHx8fDE3NTU3Nzc0Mzh8MA&ixlib=rb-4.1.0&q=85" 
                alt="Pizza artisanale Lucky Pizza"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Commande en ligne</div>
                    <div className="text-sm text-gray-600">Paiement sécurisé</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="popular" className="mb-4">
              🍕 Nos Spécialités
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Menu Lucky Pizza
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque pizza est préparée à la commande avec des ingrédients sélectionnés 
              et cuite dans notre four à bois traditionnel à 450°C
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzaMenu.map((pizza) => (
              <Card key={pizza.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {pizza.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="popular" className="shadow-md">
                      ⭐ Populaire
                    </Badge>
                  </div>
                )}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-xl text-gray-900">{pizza.name}</CardTitle>
                    <div className="text-2xl font-bold text-orange-600">{pizza.price.toFixed(2)}€</div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{pizza.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => addToCart(pizza)}
                      className="flex-1 group/btn"
                      size="default"
                    >
                      <Plus className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform" />
                      Ajouter au panier
                    </Button>
                    <Button 
                      onClick={() => handlePayment(pizza.package_id, pizza.name)}
                      variant="secondary"
                      size="default"
                      loading={isProcessingPayment}
                      className="px-4"
                    >
                      <CreditCard className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* À Propos Section */}
      <section id="apropos" className="py-20 px-4 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-amber-900/20"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-orange-100 text-orange-800">
                  🇮🇹 Tradition Italienne
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Notre Passion, 
                  <span className="text-orange-400">Votre Plaisir</span>
                </h2>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  Depuis 2018, Lucky Pizza Lannilis perpétue l'authentique tradition napolitaine 
                  au cœur du Finistère. Notre chef pizzaïolo, formé à Naples, 
                  apporte son savoir-faire unique à chaque création.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Nous sélectionnons minutieusement nos ingrédients : mozzarella di bufala DOP, 
                  tomates San Marzano, farine tipo 00, huile d'olive extra vierge et produits locaux bretons. 
                  Notre pâte fermente lentement 72 heures pour développer tous ses arômes.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">Certifié</h3>
                  <p className="text-sm text-gray-400">Tradition napolitaine</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">Local</h3>
                  <p className="text-sm text-gray-400">Cœur de Lannilis</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">Artisanal</h3>
                  <p className="text-sm text-gray-400">Fait main</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl transform -rotate-6 opacity-30"></div>
              <img 
                src="https://images.pexels.com/photos/784636/pexels-photo-784636.jpeg" 
                alt="Chef pizzaïolo Lucky Pizza"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Paolo Rossi</div>
                    <div className="text-sm text-gray-600">Maître Pizzaïolo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="popular" className="mb-4">
              📍 Trouvez-nous
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lucky Pizza Lannilis
            </h2>
            <p className="text-xl text-gray-600">
              Venez découvrir notre restaurant ou commandez en ligne
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Informations Restaurant
                </h3>
                
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
                      <p className="text-gray-600">
                        Mar-Dim: 11h30 - 14h00 & 18h00 - 22h00<br />
                        Fermé le lundi
                      </p>
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
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  🚀 Livraison Express
                </h4>
                <div className="space-y-3">
                  <p className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Livraison gratuite dès 25€
                  </p>
                  <p className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Zone de livraison: 15km autour de Lannilis
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
            </div>

            {/* Photo du restaurant */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1689915972091-debe902f72fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzU1Nzc3NDI3fDA&ixlib=rb-4.1.0&q=85" 
                  alt="Lucky Pizza Lannilis Restaurant"
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    Notre Restaurant
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Venez découvrir notre cadre chaleureux au cœur de Lannilis. 
                    Salle climatisée, terrasse ensoleillée et vue sur notre four à bois traditionnel.
                  </p>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Voir sur Google Maps
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Suivez-nous
                </h4>
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
              <h4 className="font-semibold mb-4 text-white">Menu</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Pizzas Traditionnelles</li>
                <li>Pizzas Spéciales</li>
                <li>Antipasti</li>
                <li>Desserts Italiens</li>
                <li>Boissons</li>
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

      {/* Panier Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Votre Panier</h3>
                <Button variant="ghost" onClick={() => setIsCartOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Votre panier est vide</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
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
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
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
                  
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-bold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-orange-600">
                        {getCartTotal().toFixed(2)}€
                      </span>
                    </div>
                    <Button className="w-full" size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Commander Maintenant
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Paiement sécurisé par Stripe - Livraison en 25-30 min
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