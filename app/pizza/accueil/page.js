'use client'

import { useState } from 'react'
import { 
  ChefHat,
  Star,
  Heart,
  Phone,
  ArrowRight,
  Award,
  Clock,
  MapPin,
  X,
  Menu as MenuIcon
} from 'lucide-react'
import Link from 'next/link'
import OptimizedImage from '../components/OptimizedImage'
import useEdgeOptimization from '../hooks/useEdgeOptimization'

// Composants UI modernes
const Button = ({ children, className = "", variant = "default", size = "default", onClick, href }) => {
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
    xl: "h-14 px-10 text-lg"
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
    >
      {children}
    </button>
  )
}

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

export default function AccueilPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getOptimizedClasses, getOptimizedStyles, shouldReduceAnimations } = useEdgeOptimization()

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
              <Link href="/pizza/accueil" className="text-orange-600 hover:text-orange-700 transition-colors font-medium border-b-2 border-orange-600">Accueil</Link>
              <Link href="/pizza/menu" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Menu</Link>
              <Link href="/pizza/a-propos" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">À Propos</Link>
              <Link href="/pizza/contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contact</Link>
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
              <Link href="/pizza/accueil" className="block py-2 text-orange-600 hover:text-orange-700 font-medium">Accueil</Link>
              <Link href="/pizza/menu" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Menu</Link>
              <Link href="/pizza/a-propos" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">À Propos</Link>
              <Link href="/pizza/contact" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Contact</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 overflow-hidden">
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
                <Button href="/pizza/menu" size="xl" className="group">
                  Découvrir notre Menu
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button href="tel:0298041234" size="xl" variant="outline">
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
                    <ChefHat className="w-6 h-6 text-green-600" />
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

      {/* Nos Spécialités */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="popular" className="mb-4">
              🍕 Nos Spécialités
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi Lucky Pizza ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center group hover:scale-105 transition-transform duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Authenticité Napolitaine</h3>
                <p className="text-gray-600 leading-relaxed">
                  Notre chef pizzaïolo Paolo, formé à Naples, respecte les traditions séculaires. 
                  Pâte fermentée 72h, cuisson au four à bois à 450°C.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 transition-transform duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Produits Locaux</h3>
                <p className="text-gray-600 leading-relaxed">
                  Mozzarella di bufala DOP, tomates San Marzano, légumes de saison bretons. 
                  Alliance parfaite entre Italie et Bretagne.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 transition-transform duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Express</h3>
                <p className="text-gray-600 leading-relaxed">
                  Commande en ligne, livraison en 25-30 minutes dans un rayon de 15km. 
                  Gratuite dès 25€ d'achat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-amber-500">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à Déguster ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Découvrez nos 6 pizzas artisanales et commandez en ligne avec paiement sécurisé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/pizza/menu" size="xl" className="bg-white text-orange-600 hover:bg-gray-50">
              Voir notre Menu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button href="/pizza/contact" size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
              Nous Contacter
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