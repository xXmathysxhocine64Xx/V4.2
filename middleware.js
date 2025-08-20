import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Configuration de sécurité
const SECURITY_HEADERS = {
  // Protection contre les attaques XSS
  'X-XSS-Protection': '1; mode=block',
  // Empêche le MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Contrôle l'embedding dans des frames
  'X-Frame-Options': 'SAMEORIGIN',
  // Politique de référence
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Permissions restrictives
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // Pas de cache par défaut
  'Cache-Control': 'no-store, max-age=0'
};

// Domaines autorisés (à adapter selon l'environnement)
const ALLOWED_ORIGINS = [
  'https://getyoursite.fr',
  'https://www.getyoursite.fr',
  'https://pizza.getyoursite.fr',
  'http://localhost:3000', // Pour le développement
  'http://127.0.0.1:3000'  // Pour le développement
];

export function middleware(request) {
  const { hostname, pathname } = request.nextUrl;
  
  // Routage pour le sous-domaine pizza
  if (hostname === 'pizza.getyoursite.fr') {
    // Si c'est une route API, la laisser passer normalement
    if (pathname.startsWith('/api/')) {
      // Continue avec la logique normale
    }
    // Si c'est la racine ou toute autre route, rediriger vers /pizza
    else if (pathname === '/' || (!pathname.startsWith('/_next/') && !pathname.startsWith('/favicon'))) {
      const url = request.nextUrl.clone();
      url.pathname = '/pizza';
      return NextResponse.rewrite(url);
    }
  }
  
  const response = NextResponse.next();
  const requestId = uuidv4();
  
  // Ajout de l'ID de requête pour le traçage
  response.headers.set('X-Request-ID', requestId);
  
  // Application des headers de sécurité
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Gestion spécifique des routes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Vérification de l'origine pour les requêtes API
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Vérification CORS pour les requêtes API
    if (request.method !== 'GET' && origin) {
      if (!ALLOWED_ORIGINS.includes(origin)) {
        console.warn('Blocked request from unauthorized origin:', {
          origin,
          referer,
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          requestId,
          timestamp: new Date().toISOString()
        });
        
        return new NextResponse(
          JSON.stringify({ error: 'Origin non autorisée' }),
          { 
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              ...SECURITY_HEADERS
            }
          }
        );
      }
    }
    
    // Headers spécifiques aux API
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
  } else {
    // Headers pour les pages statiques
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    
    // CSP pour les pages
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js a besoin d'inline scripts
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: https://images.unsplash.com https://unsplash.com https://images.pexels.com https://pexels.com",
      "connect-src 'self' https://getyoursite.fr",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', csp);
    
    // HSTS uniquement en HTTPS
    if (request.nextUrl.protocol === 'https:') {
      response.headers.set(
        'Strict-Transport-Security', 
        'max-age=31536000; includeSubDomains; preload'
      );
    }
  }
  
  // Logging des requêtes sensibles
  if (request.method !== 'GET' || request.nextUrl.pathname.startsWith('/api/')) {
    console.log('Request:', {
      method: request.method,
      path: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      requestId,
      timestamp: new Date().toISOString()
    });
  }
  
  return response;
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Correspondre à tous les chemins sauf :
     * - api (géré différemment)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};