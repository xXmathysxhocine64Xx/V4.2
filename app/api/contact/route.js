import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'isomorphic-dompurify';

// Rate limiting en mémoire (pour production, utiliser Redis)
const rateLimitMap = new Map();

// Configuration de sécurité
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '10');
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '900000'); // 15 minutes
const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;

// Rate limiting middleware
const checkRateLimit = (identifier) => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);
  
  if (!userLimit) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: userLimit.resetTime };
  }
  
  userLimit.count += 1;
  rateLimitMap.set(identifier, userLimit);
  return { allowed: true, remaining: RATE_LIMIT_MAX - userLimit.count };
};

// Validation avancée des inputs
const validateInput = (data) => {
  const errors = [];
  
  // Validation du nom
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Le nom est requis');
  } else if (data.name.length > MAX_NAME_LENGTH) {
    errors.push(`Le nom doit contenir moins de ${MAX_NAME_LENGTH} caractères`);
  } else if (!/^[a-zA-ZÀ-ÿ\s\-\.\']+$/.test(data.name.trim())) {
    errors.push('Le nom contient des caractères non autorisés');
  }
  
  // Validation de l'email
  if (!data.email || typeof data.email !== 'string') {
    errors.push('L\'email est requis');
  } else if (!validator.isEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
  } else if (data.email.length > 254) {
    errors.push('L\'email est trop long');
  }
  
  // Validation du message
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Le message est requis');
  } else if (data.message.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Le message doit contenir moins de ${MAX_MESSAGE_LENGTH} caractères`);
  } else if (data.message.trim().length < 10) {
    errors.push('Le message doit contenir au moins 10 caractères');
  }
  
  // Validation du sujet (optionnel)
  if (data.subject && typeof data.subject === 'string' && data.subject.length > MAX_SUBJECT_LENGTH) {
    errors.push(`Le sujet doit contenir moins de ${MAX_SUBJECT_LENGTH} caractères`);
  }
  
  return errors;
};

// Sanitization des données
const sanitizeData = (data) => {
  return {
    name: DOMPurify.sanitize(data.name?.trim() || ''),
    email: validator.normalizeEmail(data.email?.trim() || ''),
    subject: DOMPurify.sanitize(data.subject?.trim() || 'Contact GetYourSite'),
    message: DOMPurify.sanitize(data.message?.trim() || '')
  };
};

// Headers de sécurité pour les réponses API
const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache'
});

// Headers CORS avec gestion des domaines autorisés
const getCORSHeaders = (request) => {
  const origin = request.headers.get('origin');
  const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(',') || ['https://getyoursite.fr'];
  
  // Add localhost for development
  const allowedOrigins = [
    ...trustedOrigins,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];
  
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };
};

export async function GET(request) {
  try {
    const headers = getSecurityHeaders();
    
    return NextResponse.json({
      message: 'API Contact GetYourSite',
      status: 'active',
      timestamp: new Date().toISOString(),
      version: '2.0'
    }, { headers });
    
  } catch (error) {
    console.error('API GET Error:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      requestId: uuidv4()
    });
    
    const headers = getSecurityHeaders();
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500, headers }
    );
  }
}

export async function POST(request) {
  const requestId = uuidv4();
  const startTime = Date.now();
  
  try {
    // Récupération de l'IP pour le rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Vérification du rate limiting
    const rateLimitResult = checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      console.warn('Rate limit exceeded:', {
        ip,
        resetTime: resetDate.toISOString(),
        requestId,
        timestamp: new Date().toISOString()
      });
      
      const headers = {
        ...getSecurityHeaders(),
        'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      };
      
      return NextResponse.json(
        { 
          error: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
          resetTime: resetDate.toISOString()
        },
        { status: 429, headers }
      );
    }
    
    // Vérification du Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const headers = getSecurityHeaders();
      return NextResponse.json(
        { error: 'Content-Type doit être application/json' },
        { status: 400, headers }
      );
    }
    
    // Parsing du JSON avec gestion d'erreur
    let rawData;
    try {
      rawData = await request.json();
    } catch (parseError) {
      console.warn('JSON Parse Error:', {
        error: parseError.message,
        ip,
        requestId,
        timestamp: new Date().toISOString()
      });
      
      const headers = getSecurityHeaders();
      return NextResponse.json(
        { error: 'Format JSON invalide' },
        { status: 400, headers }
      );
    }
    
    // Validation des données
    const validationErrors = validateInput(rawData);
    if (validationErrors.length > 0) {
      console.warn('Validation Error:', {
        errors: validationErrors,
        ip,
        requestId,
        timestamp: new Date().toISOString()
      });
      
      const headers = {
        ...getSecurityHeaders(),
        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      };
      
      return NextResponse.json(
        { error: validationErrors.join('. ') },
        { status: 400, headers }
      );
    }
    
    // Sanitization des données
    const sanitizedData = sanitizeData(rawData);
    
    // Log sécurisé (sans données sensibles complètes)
    console.log('Contact form submission:', {
      name: sanitizedData.name,
      email: sanitizedData.email.replace(/(.{2}).*@/, '$1***@'), // Masquer une partie de l'email
      subject: sanitizedData.subject,
      messageLength: sanitizedData.message.length,
      ip: ip.replace(/\.\d+$/, '.***'), // Masquer une partie de l'IP
      requestId,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    });
    
    // Envoi email si Gmail configuré et sécurisé
    let emailSent = false;
    if (process.env.GMAIL_USER && 
        process.env.GMAIL_APP_PASSWORD && 
        process.env.GMAIL_USER !== 'votre-email@gmail.com' &&
        validator.isEmail(process.env.GMAIL_USER)) {
      
      try {
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
          secure: true,
          requireTLS: true
        });
        
        // Vérification de la connexion avant envoi
        await transporter.verify();
        
        await transporter.sendMail({
          from: `"GetYourSite Contact" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_RECIPIENT || process.env.GMAIL_USER,
          replyTo: sanitizedData.email,
          subject: `[GetYourSite] ${sanitizedData.subject}`,
          text: `Nouveau message de GetYourSite\n\nNom: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nSujet: ${sanitizedData.subject}\n\nMessage:\n${sanitizedData.message}\n\n---\nID de requête: ${requestId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Nouveau message de GetYourSite</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Nom:</strong> ${validator.escape(sanitizedData.name)}</p>
                <p><strong>Email:</strong> ${validator.escape(sanitizedData.email)}</p>
                <p><strong>Sujet:</strong> ${validator.escape(sanitizedData.subject)}</p>
              </div>
              <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h3>Message:</h3>
                <p style="white-space: pre-wrap; word-wrap: break-word;">${validator.escape(sanitizedData.message)}</p>
              </div>
              <div style="margin-top: 20px; font-size: 12px; color: #64748b;">
                <p>ID de requête: ${requestId}</p>
                <p>Reçu le: ${new Date().toLocaleString('fr-FR')}</p>
              </div>
            </div>
          `
        });
        
        emailSent = true;
        
      } catch (emailError) {
        console.error('Email Error:', {
          error: emailError.message,
          requestId,
          timestamp: new Date().toISOString()
        });
        // Ne pas faire échouer la requête si l'email échoue
      }
    }
    
    // CORS headers
    const origin = request.headers.get('origin');
    const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(',') || ['https://getyoursite.fr'];
    
    // Add localhost for development
    const allowedOrigins = [
      ...trustedOrigins,
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    
    const headers = {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
    };
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({ 
      success: true, 
      message: emailSent ? 'Message envoyé avec succès!' : 'Message reçu avec succès!',
      requestId,
      processingTime: `${processingTime}ms`
    }, { headers });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('API POST Error:', {
      error: error.message,
      stack: error.stack,
      requestId,
      timestamp: new Date().toISOString(),
      processingTime
    });
    
    const headers = getSecurityHeaders();
    return NextResponse.json(
      { 
        error: 'Erreur serveur temporaire. Veuillez réessayer.',
        requestId
      },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(',') || ['https://getyoursite.fr'];
  
  // Add localhost for development
  const allowedOrigins = [
    ...trustedOrigins,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];
  
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  const headers = {
    ...getSecurityHeaders(),
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };
  
  return new NextResponse(null, { status: 200, headers });
}