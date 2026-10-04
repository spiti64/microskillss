// Fichier : src/pages/PricingPage.tsx
import { btnAmber, btnGreen, btnSlate, card } from '../ui';
import type { Page } from '../components/Navbar';

interface PricingPageProps {
  onStartGame: () => void;
  onNavigate: (page: Page) => void;
}

interface Plan {
  id: 'free' | 'pro' | 'lifetime';
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free', name: 'Gratuit', price: '0 €', period: 'pour toujours',
    tagline: 'Tout pour démarrer et progresser.',
    features: ['Les 3 cours : Calendrier, Morse, OTAN', 'Parcours, outils et mode Blitz', 'XP, série de jours et records', 'Sauvegarde sur ton appareil'],
  },
  {
    id: 'pro', name: 'Pro', price: '29,99 €', period: 'par an',
    tagline: 'Pour ceux qui veulent aller plus loin.',
    features: ['Tout le plan Gratuit', 'Nouveaux cours dès leur sortie', 'Synchronisation entre appareils', 'Statistiques de progression détaillées'],
    highlight: true, badge: 'Le plus populaire',
  },
  {
    id: 'lifetime', name: 'Lifetime', price: '49,99 €', period: 'paiement unique',
    tagline: 'Un seul paiement, accès à vie.',
    features: ['Tout le plan Pro, pour toujours', 'Tous les futurs cours inclus', 'Aucun abonnement à gérer', 'Soutien direct au projet'],
  },
];

export default function PricingPage({ onStartGame, onNavigate }: PricingPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-12">
      <header className="text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Des tarifs <span className="text-amber-400">simples</span></h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">Commence gratuitement, passe à la vitesse supérieure quand tu veux.</p>
      </header>

      <div className="mt-10 grid items-stretch gap-5 md:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.id}
            className={`${card} relative flex flex-col ${p.highlight ? 'border-2 border-amber-400 md:-translate-y-2' : ''}`}
          >
            {p.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">{p.badge}</span>
            )}
            <h2 className="text-xl font-black">{p.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
            <p className="mt-4">
              <span className="text-4xl font-black">{p.price}</span>
              <span className="ml-2 text-sm text-slate-400">{p.period}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-slate-200"><span className="font-black text-emerald-400">✓</span>{f}</li>
              ))}
            </ul>
            {p.id === 'free' ? (
              <button onClick={onStartGame} className={`${btnGreen} mt-6 py-3`}>Commencer gratuitement</button>
            ) : (
              <button onClick={() => onNavigate('contact')} className={`${p.highlight ? btnAmber : btnSlate} mt-6 py-3`}>Rejoindre la liste d'attente</button>
            )}
          </article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-sm text-slate-400">
        Le paiement en ligne des offres Pro et Lifetime n'est pas encore ouvert : laisse-nous un message via la page Contact pour être prévenu(e) dès le lancement.
      </p>
    </div>
  );
}
