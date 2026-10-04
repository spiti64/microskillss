// Fichier : src/App.tsx
import { useState } from 'react';
import Navbar, { type Page } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import GameDashboard, { type CourseId } from './pages/GameDashboard';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedCourse, setSelectedCourse] = useState<CourseId | undefined>(undefined);

  const handleStartGame = (course?: CourseId) => {
    setSelectedCourse(course);
    setPage('game');
  };

  // Si l'utilisateur est dans le jeu, GameDashboard prend tout l'écran
  if (page === 'game') {
    return (
      <GameDashboard
        onExitGame={() => setPage('home')}
        initialCourse={selectedCourse}
      />
    );
  }

  // Sinon, on affiche le site public avec la barre de navigation
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar
        page={page}
        onNavigate={setPage}
        onStartGame={() => handleStartGame()}
      />
      <main className="flex-1">
        {page === 'home' && (
          <LandingPage
            onStartGame={handleStartGame}
            onNavigate={setPage}
          />
        )}
        {page === 'pricing' && (
          <PricingPage
            onStartGame={() => handleStartGame()}
            onNavigate={setPage}
          />
        )}
        {page === 'contact' && <ContactPage />}
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        © 2026 Micro-Skills · Développe tes super-pouvoirs intellectuels en 2 min/jour.
      </footer>
    </div>
  );
}