// Fichier : src/pages/ContactPage.tsx
import { useState } from 'react';
import { btnGreen, card, input } from '../ui';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'support', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi immédiat pour le MVP
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-12">
      <header className="text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Contacte l'équipe <span className="text-amber-400">Micro-Skills</span>
        </h1>
        <p className="mt-3 text-slate-300">
          Une suggestion de compétence, un bug à signaler ou une question sur les forfaits ? Écris-nous.
        </p>
      </header>

      <div className={`${card} mt-8`}>
        {sent ? (
          <div className="py-8 text-center">
            <div className="text-5xl">⚡</div>
            <h2 className="mt-4 text-2xl font-black text-emerald-400">Message bien reçu !</h2>
            <p className="mt-2 text-slate-300">Nous te répondrons sous 24 à 48 heures.</p>
            <button onClick={() => setSent(false)} className={`${btnGreen} mt-6 px-6 py-2.5`}>
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-300">Ton nom ou prénom</label>
              <input
                required
                type="text"
                placeholder="Alex"
                className={input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-300">Ton adresse email</label>
              <input
                required
                type="email"
                placeholder="alex@exemple.com"
                className={input}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-300">Objet de ta demande</label>
              <select
                className={input}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="support">Question générale</option>
                <option value="bug">Signaler une erreur / un bug</option>
                <option value="skill">Proposer une nouvelle micro-compétence</option>
                <option value="pro">Accès Pro / Liste d'attente</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-300">Ton message</label>
              <textarea
                required
                rows={4}
                placeholder="Explique-nous tout en détails..."
                className={input}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className={`${btnGreen} w-full py-3.5 text-lg`}>
              Envoyer le message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}