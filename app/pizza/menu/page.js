'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Plus,
  Minus,
  ChefHat,
  CreditCard,
  Check,
  Loader2,
  X,
  Menu as MenuIcon
} from 'lucide-react'
import Link from 'next/link'
import OptimizedImage from '../components/OptimizedImage'
import useEdgeOptimization from '../hooks/useEdgeOptimization'

// Composants UI modernes
const Button = ({ children, className = "", variant = "default", size = "default", onClick, loading, disabled }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-orange-300 bg-transparent text-orange-700 hover:bg-orange-50 focus-visible:ring-orange-500",
    ghost: "hover:bg-orange-50 text-orange-700 focus-visible:ring-orange-500",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 shadow-md"
  }
  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-sm"
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
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
    popular: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Fonction pour obtenir les paramètres URL
function getUrlParameter(name) {
  if (typeof window === 'undefined') return ''
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export default function MenuPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const { getOptimizedClasses, shouldReduceAnimations } = useEdgeOptimization()

  // Menu des pizzas Lucky Pizza Lannilis avec images optimisées
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
            source: 'menu_page'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session')
      }

      const data = await response.json()
      
      if (data.url) {
        setPaymentStatus({
          type: 'success',
          message: 'Redirection vers le paiement...'
        })
        
        // Attendre un peu pour que l'utilisateur voie le message
        setTimeout(() => {
          window.location.href = data.url
        }, 1000)
      } else {
        throw new Error('Aucune URL de paiement reçue')
      }
    } catch (error) {
      console.error('Erreur paiement:', error)
      setPaymentStatus({
        type: 'error',
        message: 'Erreur lors du paiement. Veuillez réessayer.'
      })
      setIsProcessingPayment(false)
    }
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
              <Link href="/pizza/menu" className="text-orange-600 hover:text-orange-700 transition-colors font-medium border-b-2 border-orange-600">Menu</Link>
              <Link href="/pizza/a-propos" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">À Propos</Link>
              <Link href="/pizza/contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Panier */}
              <Button 
                variant="outline" 
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Panier
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
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
              <Link href="/pizza/accueil" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Accueil</Link>
              <Link href="/pizza/menu" className="block py-2 text-orange-600 hover:text-orange-700 font-medium">Menu</Link>
              <Link href="/pizza/a-propos" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">À Propos</Link>
              <Link href="/pizza/contact" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Contact</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Notification de paiement */}
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

      {/* Menu Section - Optimisé pour Edge */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="popular" className="mb-4">
              🍕 Nos Spécialités
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Menu Lucky Pizza
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque pizza est préparée à la commande avec des ingrédients sélectionnés 
              et cuite dans notre four à bois traditionnel à 450°C
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzaMenu.map((pizza, index) => (
              <Card 
                key={pizza.id} 
                className={getOptimizedClasses(
                  "overflow-hidden group",
                  shouldReduceAnimations 
                    ? "hover:shadow-xl transition-shadow duration-300"
                    : "hover:shadow-xl transition-all duration-300"
                )}
              >
                {pizza.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="popular" className="shadow-md">
                      ⭐ Populaire
                    </Badge>
                  </div>
                )}
                
                <div className="relative h-56 overflow-hidden">
                  {/* Image optimisée avec lazy loading intelligent */}
                  <OptimizedImage
                    src={pizza.image}
                    alt={pizza.name}
                    className={getOptimizedClasses(
                      "w-full h-full",
                      shouldReduceAnimations 
                        ? "group-hover:scale-105 transition-transform duration-200"
                        : "group-hover:scale-110 transition-transform duration-300"
                    )}
                    width={400}
                    height={224}
                    quality={80}
                    priority={index < 3} // Précharger les 3 premières images
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  
                  {!shouldReduceAnimations && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
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
                      className={getOptimizedClasses(
                        "flex-1",
                        shouldReduceAnimations ? "" : "group/btn"
                      )}
                      size="default"
                    >
                      <Plus className={getOptimizedClasses(
                        "w-4 h-4 mr-2",
                        shouldReduceAnimations 
                          ? "transition-colors" 
                          : "group-hover/btn:rotate-90 transition-transform"
                      )} />
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

      {/* Panier modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Votre Panier</h2>
              <Button variant="ghost" onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍕</div>
                  <p className="text-gray-600 text-lg">Votre panier est vide</p>
                  <Button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4"
                  >
                    Parcourir le menu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.price.toFixed(2)}€</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {getCartTotal().toFixed(2)}€
                  </span>
                </div>
                <Button className="w-full" size="default">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Passer commande
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

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