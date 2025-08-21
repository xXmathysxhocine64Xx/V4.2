'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Composant d'image optimisée pour les performances sur Edge
 * - Lazy loading natif
 * - Optimisation des paramètres Unsplash/Pexels
 * - Format WebP avec fallback
 * - Gestion des erreurs
 * - Placeholder de chargement
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = "",
  width = 400,
  height = 300,
  priority = false,
  loading = "lazy",
  quality = 75,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [optimizedSrc, setOptimizedSrc] = useState('')

  useEffect(() => {
    // Optimiser les URLs d'images externes
    const optimizeImageUrl = (originalSrc) => {
      try {
        const url = new URL(originalSrc)
        
        // Optimisation Unsplash
        if (url.hostname.includes('unsplash')) {
          url.searchParams.set('w', width.toString())
          url.searchParams.set('h', height.toString())
          url.searchParams.set('q', quality.toString())
          url.searchParams.set('fm', 'webp')
          url.searchParams.set('fit', 'crop')
          url.searchParams.set('crop', 'entropy')
          return url.toString()
        }
        
        // Optimisation Pexels (ajouter des paramètres si possible)
        if (url.hostname.includes('pexels')) {
          // Pexels utilise un format différent pour les paramètres
          const photoId = url.pathname.split('/').pop()?.split('-').pop()?.split('.')[0]
          if (photoId) {
            return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}`
          }
        }
        
        return originalSrc
      } catch (error) {
        console.warn('Erreur lors de l\'optimisation de l\'URL d\'image:', error)
        return originalSrc
      }
    }

    if (src) {
      setOptimizedSrc(optimizeImageUrl(src))
    }
  }, [src, width, height, quality])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (!optimizedSrc) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin mb-2 mx-auto" />
            <div className="text-xs text-gray-500">Chargement...</div>
          </div>
        </div>
      )}

      {/* Placeholder d'erreur */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center z-10">
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🍕</div>
            <div className="text-xs text-gray-600">Image indisponible</div>
          </div>
        </div>
      )}

      {/* Image optimisée */}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? "eager" : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } w-full h-full object-cover`}
        {...props}
      />
    </div>
  )
}

export default OptimizedImage