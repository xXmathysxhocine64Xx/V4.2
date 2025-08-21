'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, Clock, Search, Send, CheckCircle, AlertCircle } from 'lucide-react'

const Button = ({ children, variant = 'primary', size = 'md', href, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:pointer-events-none'
  const variants = { primary: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow', secondary: 'bg-white text-red-700 border border-red-200 hover:bg-red-50', ghost: 'text-red-700 hover:bg-red-50' }
  const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-6 text-sm', lg: 'h-12 px-7 text-base' }
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link href={href} className={cls} {...props}>{children}</Link>
  return <button className={cls} {...props}>{children}</button>
}

const Input = (props) => <input {...props} className={`flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${props.className||''}`} />
const Textarea = (props) => <textarea {...props} className={`flex min-h-[120px] w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${props.className||''}`} />
const Select = (props) => <select {...props} className={`flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${props.className||''}`} />

export default function ContactRefonte() {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = [
    { name: 'Accueil', href: '/mairie/accueil' },
    { name: 'Démarches', href: '/mairie/services' },
    { name: 'Actualités', href: '/mairie/actualites' },
    { name: 'Agenda', href: '/mairie/agenda' },
    { name: 'La Métropole', href: '/mairie/metropole' },
    { name: 'Contact', href: '/mairie/contact' },
  ]

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'demande-generale', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Mairie de Brest - ${form.subject}`,
          message: `Téléphone: ${form.phone}\nType de demande: ${form.subject}\n\n${form.message}`
        })
      })
      if (res.ok) {
        setForm({ name: '', email: '', phone: '', subject: 'demande-generale', message: '' })
        setStatus({ type: 'success', message: 'Votre message a été envoyé avec succès !' })
      } else {
        setStatus({ type: 'error', message: "Une erreur est survenue. Veuillez réessayer." })
      }
    } catch {
      setStatus({ type: 'error', message: 'Erreur de connexion. Réessayez.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-red-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/mairie/accueil" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600 shadow-sm"><Building2 className="w-6 h-6 text-white" /></div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-gray-900">Brest</div>
              <div className="text-[10px] uppercase text-red-700 font-semibold -mt-1">Mairie & Métropole</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => <Link key={n.name} href={n.href} className="text-sm font-medium text-gray-700 hover:text-red-700">{n.name}</Link>)}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="sm"><Search className="w-4 h-4 mr-2" /> Rechercher</Button>
            <Button variant="primary" size="sm" href="/mairie/contact">Contact</Button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden rounded-lg border border-red-200 p-2 text-red-700">☰</button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-white" />
        <div className="container relative mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Nous contacter</h1>
            <p className="text-gray-600">L'équipe de Brest métropole est à votre service.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-red-100 p-6 bg-white shadow-sm">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Nom complet *</label>
                    <Input name="name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Votre nom et prénom" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Téléphone</label>
                    <Input name="phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} placeholder="02 98 00 00 00" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
                  <Input type="email" name="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="votre@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Type de demande</label>
                  <Select name="subject" value={form.subject} onChange={(e)=>setForm({...form, subject:e.target.value})}>
                    <option value="demande-generale">Demande générale</option>
                    <option value="etat-civil">État civil</option>
                    <option value="urbanisme">Urbanisme</option>
                    <option value="social">Action sociale</option>
                    <option value="education">Éducation</option>
                    <option value="culture-sport">Culture et sport</option>
                    <option value="environnement">Environnement</option>
                    <option value="transport">Transport</option>
                    <option value="reclamation">Réclamation</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Votre message *</label>
                  <Textarea name="message" rows={6} value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} placeholder="Décrivez votre demande en détail..." required />
                </div>

                {status && (
                  <div className={`p-4 rounded-lg text-sm ${status.type==='success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <div className="flex items-start">
                      {status.type==='success' ? <CheckCircle className="w-5 h-5 mr-2 mt-0.5" /> : <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />} {status.message}
                    </div>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours…' : (<><Send className="w-5 h-5 mr-2" /> Envoyer</>)}
                </Button>
                <p className="text-xs text-gray-500 text-center">* Champs obligatoires • Réponse sous 48h ouvrées</p>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-red-100 p-6 bg-white">
                <div className="font-semibold text-red-700 mb-2">Coordonnées</div>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> 2 rue Frézier, 29200 Brest</div>
                  <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> 02 98 00 80 80</div>
                  <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> contact@brest.fr</div>
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Lun-Ven : 8h30-17h00 • Sam : 9h-12h (état civil)</div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-100 p-6 bg-white">
                <div className="font-semibold text-red-700 mb-2">Transports</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>• Bus : Lignes 1, 2, 3 - Arrêt "Hôtel de Ville"</div>
                  <div>• Tram : Ligne A - Station "Liberté"</div>
                  <div>• Parking : Liberté (payant)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-red-100">
        <div className="container mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-600 shadow-sm"><Building2 className="w-6 h-6 text-white" /></div>
              <div>
                <div className="text-lg font-extrabold">Ville de Brest</div>
                <div className="text-xs uppercase text-red-700 font-semibold -mt-1">Métropole • Finistère</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md">Brest métropole facilite vos démarches.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-3">Liens</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/services">Mes démarches</Link></li>
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/actualites">Actualités</Link></li>
              <li><Link className="text-gray-600 hover:text-red-700" href="/mairie/agenda">Agenda</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-3">Contact</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> 02 98 00 80 80</li>
              <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> contact@brest.fr</li>
              <li className="flex items-start"><MapPin className="w-4 h-4 mr-2 mt-0.5" /> 2 rue Frézier, 29200 Brest</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-red-100 py-4 text-center text-xs text-gray-500">© 2025 Ville de Brest — Refonte</div>
      </footer>
    </div>
  )
}