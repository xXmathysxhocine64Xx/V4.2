'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "",
  width = 400,
  height = 300,
  priority = false,
  loading = "lazy",
  quality = 75,
  fade = true,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [optimizedSrc, setOptimizedSrc] = useState('')
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
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

  // Vérif "complete" immédiate + retardée + polling
  useEffect(() => {
    if (!imgRef.current) return
    let cancelled = false

    const markLoaded = () => {
      if (cancelled) return
      setIsLoading(false)
      if (imgRef.current) imgRef.current.classList.add('loaded')
    }

    const checkComplete = () => {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        markLoaded()
      }
    }

    const t1 = setTimeout(checkComplete, 100)
    const t2 = setTimeout(checkComplete, 300)
    const t3 = setTimeout(checkComplete, 800)
    const t4 = setTimeout(checkComplete, 1500)

    let ticks = 0
    const int = setInterval(() => {
      checkComplete()
      if (!imgRef.current) return
      if (!isLoading) { clearInterval(int) }
      if (++ticks > 12) { clearInterval(int) }
    }, 150)

    return () => {
      cancelled = true
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
      clearInterval(int)
    }
  }, [optimizedSrc, isLoading])

  // IntersectionObserver pour lazy images
  useEffect(() => {
    if (!imgRef.current) return
    if (priority || loading === 'eager') return

    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        requestAnimationFrame(() => {
          if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
            setIsLoading(false)
            if (imgRef.current) imgRef.current.classList.add('loaded')
          }
        })
      }
    }, { rootMargin: '200px' })

    observerRef.current.observe(imgRef.current)

    return () => { if (observerRef.current) observerRef.current.disconnect() }
  }, [priority, loading, optimizedSrc])

  const handleLoad = () => { 
    setIsLoading(false); 
    setHasError(false); 
    if (imgRef.current) imgRef.current.classList.add('loaded') 
  }
  const handleError = () => { setIsLoading(false); setHasError(true) }

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
        className={`transition-opacity duration-300 w-full h-full object-cover ${fade ? '' : ''}`}
        style={{ opacity: isLoading ? 0 : 1, ...(props.style || {}) }}
        {...props}
      />
    </div>
  )
}

export default OptimizedImage