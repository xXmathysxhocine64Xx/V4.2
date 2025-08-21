'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Loader2, ChefHat, Clock, MapPin, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'

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

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
)

// Composant wrapper pour useSearchParams avec Suspense
function PaymentSuccessContent() {
  const [paymentStatus, setPaymentStatus] = useState('checking')
  const [orderDetails, setOrderDetails] = useState(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus(sessionId)
    }
  }, [sessionId])

  const checkPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5
    const pollInterval = 2000

    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout')
      return
    }

    try {
      const response = await fetch(`/api/payments/status/${sessionId}`)
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification')
      }

      const data = await response.json()
      
      if (data.payment_status === 'paid') {
        setPaymentStatus('success')
        setOrderDetails({
          sessionId: data.session_id,
          amount: (data.amount_total / 100).toFixed(2), // Stripe returns cents
          currency: data.currency,
          pizzaName: data.metadata?.pizza_name || 'Pizza',
          orderNumber: data.session_id.substring(0, 8).toUpperCase()
        })
        return
      } else if (data.status === 'expired') {
        setPaymentStatus('expired')
        return
      }

      // Continue polling if still pending
      setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), pollInterval)
    } catch (error) {
      console.error('Erreur lors de la vérification:', error)
      setPaymentStatus('error')
    }
  }

  if (paymentStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vérification du paiement...
          </h1>
          <p className="text-gray-600">
            Nous vérifions votre commande, veuillez patienter.
          </p>
        </Card>
      </div>
    )
  }

  if (paymentStatus === 'success' && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                Lucky Pizza <span className="text-lg text-gray-600">Lannilis</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Commande Confirmée !
            </h1>
            <p className="text-xl text-gray-600">
              Merci pour votre commande chez Lucky Pizza Lannilis
            </p>
          </div>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Détails de votre commande</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Numéro de commande</span>
                <span className="font-bold text-gray-900">#{orderDetails.orderNumber}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Pizza commandée</span>
                <span className="font-semibold text-gray-900">{orderDetails.pizzaName}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">Montant payé</span>
                <span className="text-xl font-bold text-green-600">
                  {orderDetails.amount}€
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="font-medium text-gray-700">Statut du paiement</span>
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Payé</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Temps de préparation</h3>
              </div>
              <p className="text-gray-600 mb-2">Votre pizza sera prête dans :</p>
              <p className="text-2xl font-bold text-orange-600">25-30 minutes</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Retrait en magasin</h3>
              </div>
              <p className="text-gray-600 text-sm">
                12 Place du Général Leclerc<br />
                29870 Lannilis, France
              </p>
            </Card>
          </div>

          <Card className="p-6 bg-gradient-to-r from-orange-600 to-amber-500 text-white mb-8">
            <h3 className="text-xl font-semibold mb-3">🍕 Votre pizza est en préparation !</h3>
            <p className="mb-4">
              Notre pizzaïolo Paolo prépare votre pizza avec soin dans notre four à bois traditionnel. 
              Vous recevrez une notification dès qu'elle sera prête.
            </p>
            <div className="flex items-center text-sm opacity-90">
              <Clock className="w-4 h-4 mr-2" />
              <span>Commande passée à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </Card>

          <div className="text-center space-y-4">
            <Button href="/pizza" size="lg" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au menu
            </Button>
            <p className="text-sm text-gray-600">
              Une question sur votre commande ? Appelez-nous au <strong>02 98 04 12 34</strong>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Error states
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {paymentStatus === 'timeout' ? 'Vérification expirée' : 
           paymentStatus === 'expired' ? 'Session expirée' : 'Erreur de paiement'}
        </h1>
        <p className="text-gray-600 mb-6">
          {paymentStatus === 'timeout' 
            ? 'La vérification du paiement a pris trop de temps. Veuillez nous contacter.'
            : paymentStatus === 'expired'
            ? 'Votre session de paiement a expiré. Veuillez recommencer votre commande.'
            : 'Une erreur est survenue lors de la vérification de votre paiement.'}
        </p>
        <div className="space-x-4">
          <Button href="/pizza" variant="outline">
            Retour au menu
          </Button>
          <Button href="tel:0298041234">
            Nous contacter
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Composant principal avec Suspense boundary
export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chargement...
          </h1>
          <p className="text-gray-600">
            Préparation de votre page de confirmation.
          </p>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}