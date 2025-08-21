'use client'

import { useState, useEffect } from 'react'

/**
 * Hook personnalisé pour optimiser les performances sur Edge
 * - Détection du navigateur Edge
 * - Réduction des animations pour Edge
 * - Optimisation des transitions CSS
 */
const useEdgeOptimization = () => {
  const [isEdge, setIsEdge] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Détecter Microsoft Edge
    const detectEdge = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      return userAgent.includes('edge') || userAgent.includes('edg/')
    }

    // Détecter les préférences de mouvement réduit
    const detectReducedMotion = () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    setIsEdge(detectEdge())
    setReducedMotion(detectReducedMotion())

    // Écouter les changements de préférences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReducedMotion(mediaQuery.matches)
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Fallback pour les navigateurs plus anciens
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  // Classes CSS optimisées pour Edge
  const getOptimizedClasses = (baseClasses, animations = {}) => {
    let classes = baseClasses

    if (isEdge || reducedMotion) {
      // Réduire les animations complexes sur Edge
      if (animations.hover) {
        classes = classes.replace(animations.hover, animations.edgeHover || '')
      }
      if (animations.transform) {
        classes = classes.replace(animations.transform, animations.edgeTransform || '')
      }
      if (animations.gradient) {
        classes = classes.replace(animations.gradient, animations.edgeGradient || animations.gradient)
      }
    }

    return classes
  }

  // Styles inline optimisés pour Edge
  const getOptimizedStyles = (baseStyles = {}) => {
    if (!isEdge) return baseStyles

    return {
      ...baseStyles,
      // Optimisations spécifiques à Edge
      willChange: 'auto', // Réduire les couches de composition
      backfaceVisibility: 'hidden', // Améliorer les performances 3D
      perspective: '1000px', // Optimiser les transformations 3D
      transform: baseStyles.transform ? `${baseStyles.transform} translateZ(0)` : 'translateZ(0)', // Forcer l'accélération matérielle
    }
  }

  // Animation config optimisée pour Edge
  const getAnimationConfig = (defaultConfig = {}) => {
    if (isEdge || reducedMotion) {
      return {
        ...defaultConfig,
        duration: Math.min(defaultConfig.duration || 200, 200), // Limiter la durée
        easing: 'ease-out', // Utiliser des easings plus simples
        reduce: true
      }
    }
    return defaultConfig
  }

  return {
    isEdge,
    reducedMotion,
    getOptimizedClasses,
    getOptimizedStyles,
    getAnimationConfig,
    
    // Utilitaires
    shouldReduceAnimations: isEdge || reducedMotion,
    shouldOptimizeGradients: isEdge,
    shouldLazyLoad: true, // Toujours activer le lazy loading
  }
}

export default useEdgeOptimization