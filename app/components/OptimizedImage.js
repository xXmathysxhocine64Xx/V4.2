'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Composant d'image optimisée
 * - Lazy loading natif
 * - Optimisation Unsplash/Pexels
 * - WebP si possible
 * - Gestion d'erreur
 * - Placeholder
 * - Sécurisation du rendu: détecte l'état "complete" pour éviter les images qui restent transparentes
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
  fade = true, // contrôle la transition d'opacité
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [optimizedSrc, setOptimizedSrc] = useState('')
  const imgRef = useRef(null)

  useEffect(() => {
    // Optimiser l'URL
    const optimizeImageUrl = (originalSrc) => {
      try {
        const url = new URL(originalSrc)
        if (url.hostname.includes('unsplash')) {
          url.searchParams.set('w', width.toString())
          url.searchParams.set('h', height.toString())
          url.searchParams.set('q', quality.toString())
          url.searchParams.set('fm', 'webp')
          url.searchParams.set('fit', 'crop')
          url.searchParams.set('crop', 'entropy')
          return url.toString()
        }
        if (url.hostname.includes('pexels')) {
          const photoId = url.pathname.split('/').pop()?.split('-').pop()?.split('.')[0]
          if (photoId) {
            return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}`
          }
        }
        return originalSrc
      } catch (error) {
        console.warn('Erreur optimisation URL image:', error)
        return originalSrc
      }
    }

    if (src) {
      setHasError(false)
      setIsLoading(true)
      setOptimizedSrc(optimizeImageUrl(src))
    }
  }, [src, width, height, quality])

  // Sécurisation: si l'évènement onLoad est manqué (cache, lazy, timing),
  // vérifier l'état complete de l'élément image et basculer en affichage
  useEffect(() => {
    if (!imgRef.current) return
    let cancelled = false
    const checkComplete = () => {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        if (!cancelled) setIsLoading(false)
      }
    }
    // vérif immédiate + recheck après un court délai
    checkComplete()
    const t = setTimeout(checkComplete, 300)
    const t2 = setTimeout(checkComplete, 800)
    return () => { cancelled = true; clearTimeout(t); clearTimeout(t2) }
  }, [optimizedSrc])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Placeholder pendant chargement
  const showPlaceholder = isLoading && !hasError

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showPlaceholder && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin mb-2 mx-auto" />
            <div className="text-xs text-gray-500">Chargement...</div>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center z-10">
          <div className="text-center p-4">
            <div className="text-xs text-gray-600">Image indisponible</div>
          </div>
        </div>
      )}

      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        loading={priority ? "eager" : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${fade ? (isLoading ? 'opacity-0' : 'opacity-100') : 'opacity-100'} transition-opacity duration-300 w-full h-full object-cover`}
        {...props}
      />
    </div>
  )
}

export default OptimizedImage