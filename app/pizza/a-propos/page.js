'use client'

import { useState } from 'react'
import { 
  ChefHat,
  Star,
  Award,
  Users,
  Heart,
  Clock,
  Globe,
  MapPin,
  X,
  Menu as MenuIcon
} from 'lucide-react'
import Link from 'next/link'

// Composants UI modernes
const Button = ({ children, className = "", variant = "default", size = "default", onClick, href }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-orange-300 bg-transparent text-orange-700 hover:bg-orange-50 focus-visible:ring-orange-500",
    ghost: "hover:bg-orange-50 text-orange-700 focus-visible:ring-orange-500"
  }
  const sizes = {
    default: "h-11 px-6 py-2",
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

export default function AProposPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <Link href="/pizza/a-propos" className="text-orange-600 hover:text-orange-700 transition-colors font-medium border-b-2 border-orange-600">À Propos</Link>
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
              <Link href="/pizza/accueil" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Accueil</Link>
              <Link href="/pizza/menu" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Menu</Link>
              <Link href="/pizza/a-propos" className="block py-2 text-orange-600 hover:text-orange-700 font-medium">À Propos</Link>
              <Link href="/pizza/contact" className="block py-2 text-gray-700 hover:text-orange-600 font-medium">Contact</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="popular" className="mb-6">
            🇮🇹 Tradition Italienne
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Notre Histoire,
            <span className="block bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Votre Plaisir
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Depuis 2018, Lucky Pizza Lannilis perpétue l'authentique tradition napolitaine 
            au cœur du Finistère. Une passion, un savoir-faire, une expérience unique.
          </p>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-orange-100 text-orange-800">
                  📖 Notre Histoire
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Depuis 2018 à Lannilis
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Tout a commencé par un rêve : apporter l'authentique saveur napolitaine 
                    au cœur du Finistère. En 2018, nous avons ouvert Lucky Pizza Lannilis 
                    avec une mission claire : respecter la tradition tout en s'adaptant aux goûts locaux.
                  </p>
                  <p>
                    Notre chef pizzaïolo Paolo Rossi, natif de Naples et formé dans les meilleures 
                    pizzerias de sa ville natale, a apporté avec lui les secrets ancestraux 
                    de la pizza napolitaine : pâte fermentée 72 heures, cuisson au four à bois à 450°C, 
                    et sélection rigoureuse des ingrédients.
                  </p>
                  <p>
                    Aujourd'hui, Lucky Pizza est devenue une référence à Lannilis et dans tout 
                    le Nord Finistère, alliant tradition italienne et produits locaux bretons 
                    pour créer des pizzas d'exception.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl transform -rotate-6 opacity-30"></div>
              <img 
                src="https://images.pexels.com/photos/784636/pexels-photo-784636.jpeg" 
                alt="Chef Paolo Rossi Lucky Pizza"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-white" />
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

      {/* Nos Valeurs */}
      <section className="py-20 px-4 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-amber-900/20"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800">
              💎 Nos Valeurs
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ce Qui Nous Rend Unique
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center group hover:scale-105 transition-transform duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Authentique</h3>
                <p className="text-gray-300 leading-relaxed">
                  Recettes traditionnelles napolitaines transmises de génération en génération. 
                  Respect absolu des méthodes ancestrales de préparation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center group hover:scale-105 transition-transform duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Local</h3>
                <p className="text-gray-300 leading-relaxed">
                  Partenariat avec les producteurs locaux bretons. Légumes de saison, 
                  fromage de chèvre de Lannilis, alliance parfaite Italie-Bretagne.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center group hover:scale-105 transition-transform duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Familial</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ambiance chaleureuse et conviviale. Chaque client est accueilli comme 
                  un membre de la famille dans notre restaurant au cœur de Lannilis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos Ingrédients */}
      <section className="py-20 px-4 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="popular" className="mb-4">
              🥫 Nos Ingrédients
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              L'Excellence dans Chaque Bouchée
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous sélectionnons minutieusement chaque ingrédient pour vous offrir 
              une expérience gustative d'exception
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🍅</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Tomates San Marzano</h3>
                <p className="text-sm text-gray-600">
                  Appellation d'origine contrôlée, cultivées sur les pentes du Vésuve. 
                  Goût unique et acidité parfaite.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🧀</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Mozzarella di Bufala</h3>
                <p className="text-sm text-gray-600">
                  DOP de Campanie, crémeuse et fondante. 
                  Livrée directement depuis l'Italie 3 fois par semaine.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Huile d'Olive</h3>
                <p className="text-sm text-gray-600">
                  Extra vierge première pression à froid de Ligurie. 
                  Arôme fruité et goût délicat.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🌾</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Farine Tipo 00</h3>
                <p className="text-sm text-gray-600">
                  Farine italienne traditionnelle, moulue finement. 
                  Pâte élastique et digeste après fermentation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="popular" className="mb-4">
              👨‍🍳 Notre Équipe
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Les Artisans de Votre Plaisir
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center overflow-hidden group hover:shadow-xl transition-shadow duration-200">
              <div className="h-64 bg-gradient-to-b from-orange-100 to-orange-200 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-16 h-16 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Paolo Rossi</h3>
                <p className="text-orange-600 font-semibold mb-3">Chef Pizzaïolo</p>
                <p className="text-sm text-gray-600">
                  Natif de Naples, formé dans les meilleures pizzerias italiennes. 
                  15 ans d'expérience dans l'art de la pizza napolitaine authentique.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center overflow-hidden group hover:shadow-xl transition-shadow duration-200">
              <div className="h-64 bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Marie Dupont</h3>
                <p className="text-orange-600 font-semibold mb-3">Manager & Service</p>
                <p className="text-sm text-gray-600">
                  Lannilisienne de cœur, elle veille à votre accueil et coordonne 
                  le service avec le sourire et la convivialité bretonne.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center overflow-hidden group hover:shadow-xl transition-shadow duration-200">
              <div className="h-64 bg-gradient-to-b from-green-100 to-green-200 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Clock className="w-16 h-16 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Équipe Livraison</h3>
                <p className="text-orange-600 font-semibold mb-3">Service Express</p>
                <p className="text-sm text-gray-600">
                  Notre équipe de livreurs assure un service rapide et soigné 
                  dans un rayon de 15km autour de Lannilis.
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
            Rejoignez la Famille Lucky Pizza
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Découvrez pourquoi nous sommes la pizzeria préférée de Lannilis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/pizza/menu" size="lg" className="bg-white text-orange-600 hover:bg-gray-50">
              Découvrir nos Pizzas
            </Button>
            <Button href="/pizza/contact" size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Nous Rendre Visite
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