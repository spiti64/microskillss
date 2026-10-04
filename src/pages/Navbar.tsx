// Fichier : src/components/Navbar.tsx
import { btnGreen } from '../ui';

export type Page = 'home' | 'game' | 'pricing' | 'contact';

interface NavbarProps {
  page: Page;
  onNavigate: (page: Page) => void;
  onStartGame: () => void;
}

const LINKS: { id: Exclude<Page, 'game'>; label: string }[] = [
  { id: 'home', label: 'Accueil' },
  { id: 'pricing', label: 'Tarifs' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ page, onNavigate, onStartGame }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-black tracking-tight transition hover:opacity-80"
          aria-label="Micro-Skills, retour à l'accueil"
        >
          Micro-Skills <span className="text-amber-400">⚡</span>
        </button>

        <nav aria-label="Navigation principale" className="order-3 flex w-full justify-center gap-1 sm:order-none sm:w-auto">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              aria-current={page === l.id ? 'page' : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                page === l.id ? 'bg-slate-800 text-amber-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button onClick={onStartGame} className={`${btnGreen} px-4 py-2 text-sm sm:px-5 sm:py-2.5`}>
          Lancer l'entraînement
        </button>
      </div>
    </header>
  );
}
