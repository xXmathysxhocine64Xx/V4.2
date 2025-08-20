import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  return NextResponse.json({
    message: 'API Contact GetYourSite',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  try {
    const { name, email, message, subject = 'Contact GetYourSite' } = await request.json();
    
    // Validation simple
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nom, email et message requis' },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Log du message (toujours fonctionnel)
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message: message.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });

    // Envoi email si Gmail configuré
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && 
        process.env.GMAIL_USER !== 'votre-email@gmail.com') {
      
      try {
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });
        
        await transporter.sendMail({
          from: `"GetYourSite" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_RECIPIENT || process.env.GMAIL_USER,
          replyTo: email,
          subject: subject,
          text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <h3>Nouveau message de GetYourSite</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Message envoyé avec succès!' 
        });
        
      } catch (emailError) {
        console.error('Email error:', emailError.message);
        return NextResponse.json({ 
          success: true, 
          message: 'Message reçu (email en attente)' 
        });
      }
    }
    
    // Fallback: message reçu
    return NextResponse.json({ 
      success: true, 
      message: 'Message reçu avec succès!' 
    });
    
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}