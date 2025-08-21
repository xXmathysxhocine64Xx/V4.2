'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PizzaRoute() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/pizza/accueil')
  }, [router])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
        <p className="text-gray-600">Redirection vers Lucky Pizza Lannilis...</p>
      </div>
    </div>
  )
}