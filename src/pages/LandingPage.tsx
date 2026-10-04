// Fichier : src/pages/LandingPage.tsx
import { btnAmber, btnGreen, btnSlate, card } from '../ui';
import type { Page } from '../components/Navbar';
import type { CourseId } from './GameDashboard';

interface LandingPageProps {
  onStartGame: (course?: CourseId) => void;
  onNavigate: (page: Page) => void;
}

const SKILLS: { id: CourseId; emoji: string; name: string; text: string; levels: number; ring: string; chip: string }[] = [
  {
    id: 'calendar', emoji: '📅', name: 'Calendrier',
    text: "Trouve le jour de n'importe quelle date en arithmétique modulaire, sans calculatrice.",
    levels: 9, ring: 'hover:border-sky-400', chip: 'bg-sky-500/20 text-sky-300',
  },
  {
    id: 'morse', emoji: '📻', name: 'Code Morse',
    text: 'Émets et décode les signaux sonores et visuels, de E et T jusqu\'au décodage chronométré.',
    levels: 5, ring: 'hover:border-emerald-400', chip: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'nato', emoji: '✈️', name: 'Alphabet OTAN',
    text: 'Maîtrise les codes radio internationaux : Alfa, Bravo, Charlie… jusqu\'aux plaques et indicatifs.',
    levels: 5, ring: 'hover:border-violet-400', chip: 'bg-violet-500/20 text-violet-300',
  },
];

const STEPS: { n: number; title: string; text: string }[] = [
  { n: 1, title: 'Choisis ton cours', text: 'Calendrier, Morse ou OTAN : chaque cours a son propre arbre de compétences.' },
  { n: 2, title: 'Joue des leçons de 2 minutes', text: 'Des questions rapides avec correction immédiate, explications à chaque erreur et 3 cœurs à préserver.' },
  { n: 3, title: 'Passe en mode Blitz', text: 'Un chrono de 60 secondes, des combos et un record à battre pour automatiser le réflexe.' },
  { n: 4, title: 'Garde ta série', text: 'XP, série de jours et progression sont sauvegardés sur ton appareil. Reviens chaque jour.' },
];

export default function LandingPage({ onStartGame, onNavigate }: LandingPageProps) {
  return (
    <div className="pb-16">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-12 text-center sm:pt-20">
        <span className="inline-block rounded-full bg-amber-400/15 px-4 py-1 text-sm font-bold text-amber-300">⚡ Apprentissage ludique · 100 % gratuit pour démarrer</span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Maîtrise des <span className="text-amber-400">super-pouvoirs intellectuels</span> en 2&nbsp;min/jour
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          Calcule le jour de n'importe quelle date de tête, parle en Morse, épelle comme un pilote. Des micro-compétences impressionnantes, apprises en petites sessions façon jeu.
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <button onClick={() => onStartGame()} className={`${btnGreen} px-8 py-4 text-lg`}>Commencer gratuitement</button>
          <button onClick={() => onNavigate('pricing')} className={`${btnSlate} px-8 py-4 text-lg`}>Voir les tarifs</button>
        </div>

        <div className={`${card} mx-auto mt-12 max-w-md text-left`}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Exemple de défi</p>
          <p className="mt-2 text-xl font-black">Quel jour était le 14 juillet 1789 ?</p>
          <p className="mt-3 font-mono text-sm text-amber-300">14 + 6 + 4 + 6 = 30 → 30 mod 7 = 2</p>
          <p className="mt-1 font-bold text-emerald-300">= Mardi ✔</p>
        </div>
      </section>

      {/* ── Aperçu des compétences ── */}
      <section className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="skills-title">
        <h2 id="skills-title" className="text-center text-3xl font-black">3 compétences, 1 seule appli</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-400">Chaque cours a son parcours, ses outils d'entraînement et son mode Blitz.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {SKILLS.map((s) => (
            <article key={s.id} className={`${card} flex flex-col border-2 border-slate-700 transition ${s.ring}`}>
              <div className="text-5xl">{s.emoji}</div>
              <h3 className="mt-3 text-xl font-black">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-300">{s.text}</p>
              <span className={`mt-4 w-fit rounded-full px-3 py-1 text-xs font-bold ${s.chip}`}>{s.levels} niveaux</span>
              <button onClick={() => onStartGame(s.id)} className={`${btnAmber} mt-4 py-3`}>Commencer</button>
            </article>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="how-title">
        <h2 id="how-title" className="text-center text-3xl font-black">Comment ça marche</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {STEPS.map((st) => (
            <li key={st.n} className="flex gap-4 rounded-3xl border border-slate-700 bg-slate-800/40 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-b-4 border-amber-600 bg-amber-400 text-xl font-black text-slate-900">{st.n}</span>
              <div>
                <h3 className="font-black">{st.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Appel final ── */}
      <section className="mx-auto max-w-3xl px-4 pt-10 text-center">
        <div className={`${card} border-amber-400/40`}>
          <h2 className="text-2xl font-black">Prêt à débloquer ton premier super-pouvoir ?</h2>
          <p className="mt-2 text-slate-300">Aucune inscription : ta progression est sauvegardée directement sur ton appareil.</p>
          <button onClick={() => onStartGame()} className={`${btnGreen} mt-5 px-8 py-4 text-lg`}>Lancer l'entraînement</button>
        </div>
      </section>
    </div>
  );
}
