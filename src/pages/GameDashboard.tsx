// Fichier : src/pages/GameDashboard.tsx
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { btn3d, btnGreen, btnBlue, btnSlate, btnAmber, card, input } from '../ui';

/* ═════════════════════════ Icônes SVG intégrées ═════════════════════════ */

type IconProps = { size?: number; className?: string; strokeWidth?: number };
const makeIcon = (children: ReactElement) =>
  function Icon({ size = 24, className, strokeWidth = 2 }: IconProps) {
    return (
      <svg
        width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        className={className} aria-hidden="true"
      >
        {children}
      </svg>
    );
  };

const Check = makeIcon(<path d="M20 6 9 17l-5-5" />);
const X = makeIcon(<path d="M18 6 6 18M6 6l12 12" />);
const ChevronLeft = makeIcon(<path d="m15 18-6-6 6-6" />);
const ChevronRight = makeIcon(<path d="m9 18 6-6-6-6" />);
const ChevronDown = makeIcon(<path d="m6 9 6 6 6-6" />);
const Play = makeIcon(<polygon points="6 3 20 12 6 21 6 3" />);
const Square = makeIcon(<rect x="4" y="4" width="16" height="16" rx="2" />);
const Lock = makeIcon(<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>);
const Heart = makeIcon(<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />);
const Star = makeIcon(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />);
const Zap = makeIcon(<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />);
const Flame = makeIcon(<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />);
const Trophy = makeIcon(<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />);
const Timer = makeIcon(<><path d="M10 2h4M12 14l3-3" /><circle cx="12" cy="14" r="8" /></>);
const Volume2 = makeIcon(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" /></>);
const RotateCcw = makeIcon(<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>);
const MapIcon = makeIcon(<><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" /><path d="M9 3v15M15 6v15" /></>);
const Sliders = makeIcon(<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />);

/* ═════════════════════════ Utilitaires ═════════════════════════ */

const mod7 = (n: number) => ((n % 7) + 7) % 7;
const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
function pick<T>(arr: T[]): T {
  return arr[ri(0, arr.length - 1)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const L = (s: string) => s.split('');

/** Confettis maison (canvas plein écran temporaire, aucune dépendance) */
const boom = () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const colors = ['#fbbf24', '#34d399', '#38bdf8', '#fb7185', '#a78bfa', '#fb923c'];
  const parts = Array.from({ length: 150 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const speed = 8 + Math.random() * 11;
    return {
      x: canvas.width / 2, y: canvas.height * 0.65,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 7, rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.4, color: pick(colors),
    };
  });
  let frame = 0;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    parts.forEach((p) => {
      p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - frame / 130);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (frame < 130) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
};

/* ═════════════════════════ Moteur audio (Web Audio API pure) ═════════════════════════ */

let audioCtx: AudioContext | null = null;
let sfxOn = true;
let morseNodes: OscillatorNode[] = [];

function getCtx(): AudioContext {
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AC();
  }
  void audioCtx.resume();
  return audioCtx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.25, track = false) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.006);
  g.gain.setValueAtTime(vol, start + Math.max(0.007, dur - 0.008));
  g.gain.linearRampToValueAtTime(0, start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
  if (track) morseNodes.push(osc);
}

function stopMorse() {
  morseNodes.forEach((o) => { try { o.stop(); } catch { /* déjà arrêté */ } });
  morseNodes = [];
}

/** Synthétise un texte en Morse (bip 600 Hz). Retourne la durée totale en ms. */
function playMorse(text: string, unit = 0.08): number {
  stopMorse();
  const c = getCtx();
  let t = c.currentTime + 0.05;
  text.toUpperCase().split(/\s+/).filter(Boolean).forEach((w) => {
    w.split('').forEach((ch) => {
      const code = MORSE[ch];
      if (!code) return;
      code.split('').forEach((sym) => {
        const dur = sym === '.' ? unit : unit * 3;
        tone(600, t, dur, 'sine', 0.25, true);
        t += dur + unit;
      });
      t += unit * 2;
    });
    t += unit * 4;
  });
  return Math.max(0, (t - c.currentTime) * 1000);
}

/** Bip continu tant que la touche est pressée ; renvoie la fonction d'arrêt. */
function startKey(): () => void {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.frequency.value = 600;
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.25, c.currentTime + 0.01);
  osc.connect(g).connect(c.destination);
  osc.start();
  return () => {
    g.gain.setTargetAtTime(0, c.currentTime, 0.01);
    osc.stop(c.currentTime + 0.06);
  };
}

function sfx(kind: 'ok' | 'ko' | 'win') {
  if (!sfxOn) return;
  const t = getCtx().currentTime + 0.01;
  if (kind === 'ok') {
    tone(660, t, 0.09, 'triangle', 0.2);
    tone(880, t + 0.09, 0.14, 'triangle', 0.2);
  } else if (kind === 'ko') {
    tone(220, t, 0.18, 'sawtooth', 0.12);
    tone(160, t + 0.16, 0.25, 'sawtooth', 0.12);
  } else {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.11, 0.16, 'triangle', 0.2));
  }
}

function speakSeq(words: string[], rate = 0.8) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  words.forEach((w) => {
    const u = new SpeechSynthesisUtterance(w);
    u.lang = 'en-US';
    u.rate = rate;
    window.speechSynthesis.speak(u);
  });
}

function useMorse() {
  const timer = useRef<number | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const stop = useCallback(() => {
    stopMorse();
    window.clearTimeout(timer.current);
    setPlaying(false);
  }, []);
  const play = useCallback((text: string, unit = 0.08) => {
    window.clearTimeout(timer.current);
    const ms = playMorse(text, unit);
    setPlaying(true);
    timer.current = window.setTimeout(() => setPlaying(false), ms + 100);
  }, []);
  useEffect(() => stop, [stop]);
  return { play, stop, playing };
}

/* ═════════════════════════ Données : calendrier ═════════════════════════ */

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTH_KEYS = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
const NUM = ['0', '1', '2', '3', '4', '5', '6'];

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
/** 1900 = 0, 2000 = 6 (≡ −1), 2100 = 4, 1800 = 2 … (cycle de 400 ans) */
const centuryKey = (y: number) => mod7(6 - 2 * (Math.floor(y / 100) % 4));
/** m : 0 = janvier. Décalage de −1 pour janvier et février en année bissextile. */
const monthKey = (m: number, y: number) => MONTH_KEYS[m] - (m < 2 && isLeap(y) ? 1 : 0);
const yearKey = (y: number) => {
  const aa = y % 100;
  const k = Math.round(aa / 28);
  const r = aa - 28 * k;
  return { aa, k, r, a: mod7(r + Math.floor(r / 4)) };
};
const weekday = (y: number, m: number, d: number) => mod7(d + monthKey(m, y) + centuryKey(y) + yearKey(y).a);
const fmtDate = (y: number, m: number, d: number) => `${d} ${MONTHS[m]} ${y}`;

interface DateQ { y: number; m: number; d: number; ans: number }
const randDate = (): DateQ => {
  const y = ri(1900, 2099);
  const m = ri(0, 11);
  const d = ri(1, new Date(y, m + 1, 0).getDate());
  return { y, m, d, ans: weekday(y, m, d) };
};

/* ═════════════════════════ Données : Morse & OTAN ═════════════════════════ */

const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
  N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
};
const REV: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
const ALPHA = L('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const DIGITS = L('0123456789');
const NATO = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
const ICAO_DIGITS = ['Zero', 'One', 'Two', 'Tree', 'Fower', 'Fife', 'Six', 'Seven', 'Ait', 'Niner'];
const natoWord = (ch: string) => (/\d/.test(ch) ? ICAO_DIGITS[Number(ch)] : NATO[ch.charCodeAt(0) - 65]);
const pat = (ch: string) => MORSE[ch].split('').map((c) => (c === '.' ? '●' : '▬')).join(' ');

const toMorse = (text: string) =>
  text.toUpperCase().split(/\s+/).filter(Boolean)
    .map((w) => w.split('').filter((c) => MORSE[c]).map((c) => MORSE[c]).join(' '))
    .join('   ');

/* ═════════════════════════ Modèle : questions, niveaux, cours ═════════════════════════ */

interface Q {
  prompt: string;
  sub?: string;
  big?: string;
  audio?: string;
  choices: string[];
  answer: number;
  explain: string;
}
interface Level {
  id: number;
  title: string;
  desc: string;
  gen: () => Q;
  count?: number;
  timer?: number;
  unit?: number;
}
export type CourseId = 'calendar' | 'morse' | 'nato';
interface Course {
  id: CourseId;
  emoji: string;
  name: string;
  tagline: string;
  intro: string;
  code: string;
  tool: string;
  theme: { node: string; text: string; soft: string };
  levels: Level[];
}

/* ── Cours 1 : Calendrier ── */

const TRIPLETS = 'Triplets : 0-3-3 · 6-1-4 · 6-2-5 · 0-3-5';
const genMonth = (from: number, to: number): Q => {
  const m = ri(from, to);
  return {
    prompt: `Clé de ${MONTHS[m]} ?`,
    sub: TRIPLETS,
    choices: NUM,
    answer: MONTH_KEYS[m],
    explain: `Les mois se retiennent par triplets : 0-3-3 (janv.-févr.-mars), 6-1-4 (avr.-mai-juin), 6-2-5 (juil.-août-sept.), 0-3-5 (oct.-nov.-déc.). Ici ${MONTHS[m]} = ${MONTH_KEYS[m]}.`,
  };
};

const CAL_LEVELS: Level[] = [
  {
    id: 1, title: 'Les jours', desc: '0 = dimanche … 6 = samedi',
    gen: () => {
      const n = ri(0, 6);
      const explain = `Dimanche = 0, lundi = 1, mardi = 2, mercredi = 3, jeudi = 4, vendredi = 5, samedi = 6. Donc ${DAYS[n].toLowerCase()} = ${n}.`;
      return Math.random() < 0.5
        ? { prompt: `Quel jour porte le numéro ${n} ?`, choices: DAYS, answer: n, explain }
        : { prompt: `Quel numéro pour ${DAYS[n].toLowerCase()} ?`, choices: NUM, answer: n, explain };
    },
  },
  {
    id: 2, title: 'Clés des siècles', desc: '1900 = 0 · 2000 = −1 (6)',
    gen: () => {
      const c = pick([1700, 1800, 1900, 2000, 2100]);
      return {
        prompt: `Clé du siècle ${c} ?`,
        sub: '1900 = 0 · 2000 = 6 (−1) · 1800 = 2 · 2100 = 4',
        choices: NUM, answer: centuryKey(c),
        explain: `Les clés de siècle se répètent tous les 400 ans : 1700 = 4, 1800 = 2, 1900 = 0, 2000 = 6 (soit −1), 2100 = 4. Pour ${c} : ${centuryKey(c)}.`,
      };
    },
  },
  { id: 3, title: 'Mois · janvier–juin', desc: 'Triplets 0-3-3 et 6-1-4', gen: () => genMonth(0, 5) },
  { id: 4, title: 'Mois · juillet–décembre', desc: 'Triplets 6-2-5 et 0-3-5', gen: () => genMonth(6, 11) },
  {
    id: 5, title: 'Multiples de 28', desc: '0 · 28 · 56 · 84 · 112',
    gen: () => {
      const aa = ri(0, 99);
      const k = Math.round(aa / 28);
      return {
        prompt: `Multiple de 28 le plus proche de ${aa} ?`,
        choices: ['0', '28', '56', '84', '112'], answer: k,
        explain: `On compare ${aa} aux multiples 0, 28, 56, 84, 112 : le plus proche est ${28 * k} (écart de ${Math.abs(aa - 28 * k)}). On pourra alors travailler avec un petit reste r = ${aa - 28 * k}.`,
      };
    },
  },
  {
    id: 6, title: 'Le reste', desc: 'A = (r + ⌊r/4⌋) mod 7',
    gen: () => {
      const { aa, k, r, a } = yearKey(ri(1900, 2099));
      return {
        prompt: `Clé d'année pour aa = ${aa} ?`,
        sub: `r = ${aa} − 28×${k} = ${r}`,
        choices: NUM, answer: a,
        explain: `r = ${aa} − 28×${k} = ${r}. Puis A = (r + ⌊r/4⌋) mod 7 = (${r} + ${Math.floor(r / 4)}) mod 7 = ${a}. Le ⌊ ⌋ arrondit vers le bas, même pour un r négatif.`,
      };
    },
  },
  {
    id: 7, title: 'Formule complète', desc: '(J + M + S + A) mod 7',
    gen: () => {
      const J = ri(1, 31), M = pick(MONTH_KEYS), S = pick([0, 6, 4, 2]), A = ri(0, 6);
      const sum = J + M + S + A;
      return {
        prompt: `(${J} + ${M} + ${S} + ${A}) mod 7 = ?`,
        choices: NUM, answer: mod7(sum),
        explain: `${J} + ${M} + ${S} + ${A} = ${sum}. On retire des multiples de 7 : ${sum} = 7×${Math.floor(sum / 7)} + ${mod7(sum)}, donc le reste est ${mod7(sum)}.`,
      };
    },
  },
  {
    id: 8, title: 'Années bissextiles', desc: 'Janvier et février : −1',
    gen: () => {
      const y = pick([1900, 2000, 2100, 1996, 2024, 2023, 2028, ri(1900, 2099)]);
      const rule = `Une année est bissextile si elle est divisible par 4, sauf les années séculaires non divisibles par 400. ${y} ${isLeap(y) ? 'est bissextile' : "n'est pas bissextile"}.`;
      return Math.random() < 0.5
        ? { prompt: `${y} est-elle bissextile ?`, choices: ['Oui', 'Non'], answer: isLeap(y) ? 0 : 1, explain: rule }
        : {
            prompt: `Clé de février ${y} ?`, sub: 'Février = 3, moins 1 si bissextile',
            choices: NUM, answer: monthKey(1, y),
            explain: `${rule} Février vaut 3, et on retire 1 en année bissextile : ${monthKey(1, y)}.`,
          };
    },
  },
  {
    id: 9, title: 'Synthèse finale', desc: 'Dates complètes',
    gen: () => {
      const q = randDate();
      const M = monthKey(q.m, q.y), S = centuryKey(q.y), A = yearKey(q.y).a;
      return {
        prompt: `Quel jour : ${fmtDate(q.y, q.m, q.d)} ?`,
        choices: DAYS, answer: q.ans,
        explain: `J = ${q.d}, M = ${M}, S = ${S}, A = ${A}. Somme = ${q.d + M + S + A}, mod 7 = ${q.ans}, soit ${DAYS[q.ans].toLowerCase()}.`,
      };
    },
  },
];

/* ── Cours 2 : Morse ── */

const MNEMO: Record<string, string> = {
  E: 'le plus court : un seul point.', T: 'un seul trait.', A: 'point puis trait ; N est son inverse.',
  N: "trait puis point, l'inverse de A.", M: 'deux traits.', I: 'deux points.', S: 'trois points (comme dans SOS).',
  D: 'trait puis deux points.', U: 'deux points puis un trait.', K: 'trait, point, trait.', R: 'point, trait, point.',
};

type MMode = 'audio' | 'read' | 'write';
function genMorse(target: string[], pool: string[], modes: MMode[]): Q {
  const ch = pick(target);
  const mode = pick(modes);
  const opts = shuffle([ch, ...shuffle(pool.filter((c) => c !== ch)).slice(0, 3)]);
  const base = `${ch} s'écrit ${pat(ch)} : ● = bip court, ▬ = bip long (3 fois plus long). ${MNEMO[ch] ? `Astuce : ${ch} = ${MNEMO[ch]}` : ''}`;
  if (mode === 'write') {
    return { prompt: `Comment s'écrit « ${ch} » en Morse ?`, choices: opts.map(pat), answer: opts.indexOf(ch), explain: base };
  }
  if (mode === 'read') {
    return { prompt: 'Quelle lettre représente ce signal ?', big: pat(ch), choices: opts, answer: opts.indexOf(ch), explain: base };
  }
  return {
    prompt: 'Écoute le signal : quelle lettre ?', sub: 'Tu peux le réécouter autant que tu veux.', audio: ch,
    choices: opts, answer: opts.indexOf(ch),
    explain: `${base} À l'oreille : compte les bips courts et les bips longs.`,
  };
}

const ALL_MODES: MMode[] = ['read', 'audio', 'write'];
const MORSE_LEVELS: Level[] = [
  { id: 1, title: 'Les bases', desc: 'E · T · A · M · I · S', unit: 0.1, gen: () => genMorse(L('ETAMIS'), L('ETAMIS'), ALL_MODES) },
  { id: 2, title: 'Opposés & compléments', desc: 'N · D · U · K · R', unit: 0.1, gen: () => genMorse(L('NDUKR'), L('ETAMISNDUKR'), ALL_MODES) },
  { id: 3, title: "L'alphabet complet", desc: 'A à Z', unit: 0.09, gen: () => genMorse(ALPHA, ALPHA, ALL_MODES) },
  { id: 4, title: 'Les chiffres', desc: '0 à 9', unit: 0.09, gen: () => genMorse(DIGITS, DIGITS, ALL_MODES) },
  { id: 5, title: 'Décodage chronométré', desc: '⏱ 10 s par signal', unit: 0.07, timer: 10, count: 10, gen: () => genMorse([...ALPHA, ...DIGITS], [...ALPHA, ...DIGITS], ['audio']) },
];

/* ── Cours 3 : Alphabet OTAN ── */

const NATO_NOTE: Record<string, string> = {
  A: 'Orthographe officielle : « Alfa » (et non Alpha).', J: '« Juliett » prend deux t.',
  X: '« X-ray » s\'écrit avec un tiret.', Q: '« Quebec » se prononce « Kébec ».',
  H: '« Hotel » est accentué sur la 2e syllabe.', V: '« Victor » (et non Victoire).',
};

function genNato(letters: string[]): Q {
  const ch = pick(letters);
  const word = natoWord(ch);
  const note = NATO_NOTE[ch] ?? `${word} commence par ${ch}.`;
  const explain = `${ch} → ${word}. ${note}`;
  if (Math.random() < 0.5) {
    const opts = shuffle([ch, ...shuffle(letters.filter((c) => c !== ch)).slice(0, 3)]);
    return { prompt: `« ${word} » correspond à quelle lettre ?`, choices: opts, answer: opts.indexOf(ch), explain };
  }
  const opts = shuffle([word, ...shuffle(letters.filter((c) => c !== ch)).slice(0, 3).map(natoWord)]);
  return { prompt: `Quel mot code la lettre « ${ch} » ?`, choices: opts, answer: opts.indexOf(word), explain };
}

function genCallsign(): Q {
  const l = () => pick(ALPHA);
  const d = () => String(ri(0, 9));
  const plate = Math.random() < 0.5;
  const chars = plate ? [l(), l(), '-', d(), d(), d(), '-', l(), l()] : ['F', '-', l(), l(), l(), l()];
  const spelled = chars.filter((c) => c !== '-').map(natoWord).join(' · ');
  const correct = chars.join('');
  const options = new Set<string>([correct]);
  const idxs = chars.map((c, i) => (c === '-' ? -1 : i)).filter((i) => i >= 0);
  while (options.size < 4) {
    const c = [...chars];
    const k = pick(idxs);
    c[k] = /\d/.test(c[k]) ? d() : l();
    options.add(c.join(''));
  }
  const choices = shuffle([...options]);
  return {
    prompt: plate ? "Le contrôleur épelle une plaque d'immatriculation. Qu'as-tu noté ?" : "Le contrôleur épelle l'immatriculation d'un avion. Qu'as-tu noté ?",
    big: spelled, choices, answer: choices.indexOf(correct),
    explain: `Décodage lettre par lettre : ${chars.filter((c) => c !== '-').map((c) => `${natoWord(c)} = ${c}`).join(', ')}. Rappel des chiffres OACI : 3 = Tree, 4 = Fower, 5 = Fife, 9 = Niner.`,
  };
}

const NATO_LEVELS: Level[] = [
  { id: 1, title: 'A à F', desc: 'Alfa → Foxtrot', gen: () => genNato(L('ABCDEF')) },
  { id: 2, title: 'G à M', desc: 'Golf → Mike', gen: () => genNato(L('GHIJKLM')) },
  { id: 3, title: 'N à S', desc: 'November → Sierra', gen: () => genNato(L('NOPQRS')) },
  { id: 4, title: 'T à Z', desc: 'Tango → Zulu', gen: () => genNato(L('TUVWXYZ')) },
  { id: 5, title: 'Indicatifs & plaques', desc: 'Décodage radio réel', gen: genCallsign },
];

const COURSES: Course[] = [
  {
    id: 'calendar', emoji: '📅', name: 'Calcul du Calendrier',
    tagline: "Trouve le jour de n'importe quelle date en arithmétique modulaire",
    intro: '0 = dimanche … 6 = samedi. Termine les 9 niveaux pour calculer n\'importe quelle date de tête.',
    code: '(J + M + S + A) mod 7', tool: 'Calculateur',
    theme: { node: 'bg-sky-500 border-sky-700', text: 'text-sky-300', soft: 'bg-sky-500/20' },
    levels: CAL_LEVELS,
  },
  {
    id: 'morse', emoji: '📻', name: 'Code Morse',
    tagline: 'Apprends à émettre et décoder les signaux sonores et visuels',
    intro: '● = bip court, ▬ = bip long (3 fois plus long). Écoute, lis et écris les signaux, du plus simple au décodage chronométré.',
    code: '● ▬ ● ●   ▬ ▬ ▬', tool: 'Manipulateur',
    theme: { node: 'bg-emerald-500 border-emerald-700', text: 'text-emerald-300', soft: 'bg-emerald-500/20' },
    levels: MORSE_LEVELS,
  },
  {
    id: 'nato', emoji: '✈️', name: 'Alphabet OTAN',
    tagline: 'Maîtrise les codes radio aéronautiques internationaux (Alfa, Bravo...)',
    intro: 'Chaque lettre a son mot, compris par toutes les radios du monde. Apprends l\'alphabet par blocs, puis décode de vrais indicatifs.',
    code: 'Alfa · Bravo · Charlie', tool: 'Épelleur',
    theme: { node: 'bg-violet-500 border-violet-700', text: 'text-violet-300', soft: 'bg-violet-500/20' },
    levels: NATO_LEVELS,
  },
];

/* ═════════════════════════ Persistance (localStorage) ═════════════════════════ */

interface Save {
  completedLevelsByCourse: Record<CourseId, number[]>;
  totalXp: number;
  streak: number;
  lastActiveDate: string;
  lastCourse: CourseId;
  bestByCourse: Record<CourseId, number>;
  sound: boolean;
}
const STORE_KEY = 'microdrill-v2';
const DEFAULT_SAVE: Save = {
  completedLevelsByCourse: { calendar: [], morse: [], nato: [] },
  totalXp: 0, streak: 0, lastActiveDate: '', lastCourse: 'calendar',
  bestByCourse: { calendar: 0, morse: 0, nato: 0 }, sound: true,
};
const isoDay = (d: Date) => d.toLocaleDateString('sv-SE');
const today = () => isoDay(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return isoDay(d); };

function loadSave(): Save {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const p = JSON.parse(raw) as Partial<Save>;
    return {
      ...DEFAULT_SAVE, ...p,
      completedLevelsByCourse: { ...DEFAULT_SAVE.completedLevelsByCourse, ...p.completedLevelsByCourse },
      bestByCourse: { ...DEFAULT_SAVE.bestByCourse, ...p.bestByCourse },
    };
  } catch {
    return DEFAULT_SAVE;
  }
}
const bumpStreak = (s: Save): Pick<Save, 'streak' | 'lastActiveDate'> => {
  const t = today();
  if (s.lastActiveDate === t) return { streak: s.streak, lastActiveDate: t };
  return { streak: s.lastActiveDate === yesterday() ? s.streak + 1 : 1, lastActiveDate: t };
};
const liveStreak = (s: Save) => (s.lastActiveDate === today() || s.lastActiveDate === yesterday() ? s.streak : 0);


/* ═════════════════════════ Roue mod 7 ═════════════════════════ */

function Wheel({ value, size = 280 }: { value: number; size?: number }) {
  const [rot, setRot] = useState(value);
  const [delta, setDelta] = useState(0);
  const prev = useRef(value);

  useEffect(() => {
    let d = mod7(value - prev.current);
    if (d > 3) d -= 7;
    prev.current = value;
    setDelta(d);
    setRot((r) => r + d);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 300 300" width={size} height={size} role="img" aria-label={`Roue mod 7, position ${value} : ${DAYS[value]}`} className="max-w-full">
        <circle cx="150" cy="150" r="144" fill="#0f172a" stroke="#334155" strokeWidth="4" />
        <circle cx="150" cy="150" r="108" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 6" />
        <g style={{ transform: `rotate(${(rot * 360) / 7}deg)`, transformOrigin: '150px 150px', transition: 'transform .7s cubic-bezier(.34,1.4,.64,1)' }}>
          <line x1="150" y1="150" x2="150" y2="90" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
          <polygon points="150,66 140,92 160,92" fill="#fbbf24" />
        </g>
        {DAYS.map((name, i) => {
          const a = ((i * 360) / 7 - 90) * (Math.PI / 180);
          const x = 150 + 108 * Math.cos(a);
          const y = 150 + 108 * Math.sin(a);
          const on = i === value;
          return (
            <g key={name}>
              <circle cx={x} cy={y} r="23" fill={on ? '#fbbf24' : '#1e293b'} stroke={on ? '#f59e0b' : '#475569'} strokeWidth="3" />
              <text x={x} y={y + 1} textAnchor="middle" fontSize="16" fontWeight="800" fill={on ? '#0f172a' : '#e2e8f0'}>{i}</text>
              <text x={x} y={y + 14} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={on ? '#0f172a' : '#94a3b8'}>{name.slice(0, 3)}</text>
            </g>
          );
        })}
        <circle cx="150" cy="150" r="13" fill="#fbbf24" />
        <circle cx="150" cy="150" r="5" fill="#0f172a" />
      </svg>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">Pas relatif</span>
        <span className={`min-w-14 rounded-full px-3 py-1 text-center font-black ${delta > 0 ? 'bg-emerald-500/20 text-emerald-300' : delta < 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'}`}>
          {delta > 0 ? `+${delta}` : delta < 0 ? `−${-delta}` : '±0'}
        </span>
        <span className="font-bold text-amber-300">{DAYS[value]}</span>
      </div>
    </div>
  );
}

/* ═════════════════════════ Moteur universel de leçon ═════════════════════════ */

function Lesson({ course, level, onExit, onDone }: { course: Course; level: Level; onExit: () => void; onDone: (id: number, xp: number) => void }) {
  const count = level.count ?? 8;
  const limit = level.timer;
  const unit = level.unit ?? 0.09;
  const [seed, setSeed] = useState(0);
  const qs = useMemo(() => Array.from({ length: count }, () => level.gen()), [level, count, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [hearts, setHearts] = useState(3);
  const [ok, setOk] = useState(0);
  const [end, setEnd] = useState<null | 'win' | 'lose'>(null);
  const [tl, setTl] = useState(1);
  const pending = useRef<{ nh: number; nok: number } | null>(null);
  const startRef = useRef(Date.now());
  const { play, playing } = useMorse();
  const q = qs[i];

  const restart = () => {
    setSeed((s) => s + 1); setI(0); setPicked(null); setHearts(3); setOk(0); setEnd(null); pending.current = null;
  };

  const advance = () => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    if (p.nh <= 0) { setEnd('lose'); return; }
    if (i + 1 >= qs.length) {
      setEnd('win');
      sfx('win');
      boom();
      onDone(level.id, p.nok * 10);
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  const choose = (c: number) => {
    if (picked !== null || end) return;
    setPicked(c);
    const good = c === q.answer;
    sfx(good ? 'ok' : 'ko');
    const nh = good ? hearts : hearts - 1;
    const nok = good ? ok + 1 : ok;
    if (good) setOk(nok); else setHearts(nh);
    pending.current = { nh, nok };
    if (good) window.setTimeout(advance, 750);
  };

  const chooseRef = useRef(choose);
  chooseRef.current = choose;

  // Nouvelle question : remise à zéro du chrono et lecture automatique de l'audio
  useEffect(() => {
    startRef.current = Date.now();
    setTl(1);
    if (!q.audio || end) return;
    const a = q.audio;
    const t = window.setTimeout(() => play(a, unit), 350);
    return () => window.clearTimeout(t);
  }, [i, seed, end]); // eslint-disable-line react-hooks/exhaustive-deps

  // Chronomètre par question (niveaux chronométrés)
  useEffect(() => {
    if (!limit || picked !== null || end) return;
    const id = window.setInterval(() => {
      const r = 1 - (Date.now() - startRef.current) / (limit * 1000);
      if (r <= 0) { window.clearInterval(id); chooseRef.current(-1); } else setTl(r);
    }, 100);
    return () => window.clearInterval(id);
  }, [limit, picked, end, i, seed]);

  if (end) {
    return (
      <div className={`${card} mx-auto mt-6 max-w-md text-center`}>
        <div className="text-6xl">{end === 'win' ? '🏆' : '💔'}</div>
        <h2 className="mt-3 text-2xl font-black">{end === 'win' ? 'Niveau validé !' : 'Plus de cœurs'}</h2>
        <p className="mt-2 text-slate-300">
          {end === 'win' ? `${ok}/${count} bonnes réponses · +${ok * 10} XP` : 'Relis les explications et relance une série.'}
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={restart} className={`${btnSlate} flex-1 py-3`}>Rejouer</button>
          <button onClick={onExit} className={`${btnGreen} flex-1 py-3`}>Continuer</button>
        </div>
      </div>
    );
  }

  const compact = q.choices.length > 2 && q.choices.every((c) => c.length <= 3);
  const good = picked === q.answer;

  return (
    <div className="mx-auto max-w-xl pb-6">
      <div className="flex items-center gap-3">
        <button onClick={onExit} aria-label="Quitter" className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X /></button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${(i / qs.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-1 font-black text-rose-400"><Heart className="fill-rose-500" size={22} />{hearts}</div>
      </div>
      {limit && (
        <div className="mt-3 flex items-center gap-2">
          <Timer size={16} className="text-slate-400" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
            <div className={`h-full rounded-full ${tl < 0.3 ? 'bg-rose-500' : 'bg-amber-400'}`} style={{ width: `${tl * 100}%` }} />
          </div>
        </div>
      )}
      <p className={`mt-6 text-sm font-bold ${course.theme.text}`}>{course.emoji} Niveau {level.id} · {level.title}</p>
      <h2 className="mt-1 text-2xl font-black sm:text-3xl">{q.prompt}</h2>
      {q.sub && <p className="mt-2 text-sm text-slate-400">{q.sub}</p>}
      {q.audio && (
        <button onClick={() => play(q.audio as string, unit)} aria-label="Réécouter le signal" className={`${btnBlue} mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full ${playing ? 'animate-pulse' : ''}`}>
          <Volume2 size={40} />
        </button>
      )}
      {q.big && <div className="mt-5 break-words rounded-2xl bg-slate-900 p-4 text-center font-mono text-2xl font-black leading-relaxed tracking-widest text-amber-300 sm:text-3xl">{q.big}</div>}
      <div className={`mt-6 grid gap-3 ${compact ? 'grid-cols-4' : 'grid-cols-2'}`}>
        {q.choices.map((c, idx) => {
          let cls = btnSlate;
          if (picked !== null) {
            if (idx === q.answer) cls = btnGreen;
            else if (idx === picked) cls = `${btn3d} bg-rose-500 border-rose-700 text-white`;
          }
          return (
            <button key={`${c}-${idx}`} disabled={picked !== null && idx !== q.answer && idx !== picked} onClick={() => choose(idx)} className={`${cls} break-words px-2 py-4 text-lg`}>
              {c}
            </button>
          );
        })}
      </div>
      {picked !== null && good && <p className="mt-5 rounded-2xl bg-emerald-500/15 p-3 font-bold text-emerald-300">Exact !</p>}
      {picked !== null && !good && (
        <div className="mt-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="font-black text-rose-300">{picked === -1 ? 'Temps écoulé !' : 'Pas tout à fait…'}</p>
          <p className="mt-1 text-sm text-slate-200">Bonne réponse : <span className="font-bold text-white">{q.choices[q.answer]}</span></p>
          <p className="mt-2 text-sm text-slate-300">💡 {q.explain}</p>
          <button onClick={advance} className={`${btnBlue} mt-4 w-full py-3`}>Continuer</button>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════ Arbre de compétences ═════════════════════════ */

function SkillTree({ course, done, onOpen }: { course: Course; done: number[]; onOpen: (l: Level) => void }) {
  const offsets = [0, 44, 68, 44, 0, -44, -68, -44];
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {course.levels.map((l, i) => {
        const completed = done.includes(l.id);
        const unlocked = i === 0 || done.includes(course.levels[i - 1].id);
        const current = unlocked && !completed;
        return (
          <div key={l.id} className="flex flex-col items-center text-center" style={{ transform: `translateX(${offsets[i % offsets.length]}px)` }}>
            <button
              disabled={!unlocked} onClick={() => onOpen(l)} aria-label={`Niveau ${l.id} : ${l.title}`}
              className={`flex h-20 w-20 items-center justify-center rounded-full border-b-8 text-3xl font-black transition active:translate-y-1 active:border-b-4 ${
                completed ? 'border-amber-600 bg-amber-400 text-slate-900'
                : current ? `animate-pulse ${course.theme.node} text-white`
                : 'cursor-not-allowed border-slate-900 bg-slate-700 text-slate-500'}`}
            >
              {completed ? <Check size={36} strokeWidth={4} /> : unlocked ? l.id : <Lock size={28} />}
            </button>
            <div className="mt-2 w-44 text-sm font-bold">{l.title}</div>
            <div className="w-44 text-xs text-slate-400">{l.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ═════════════════════════ Outil : calculateur (Calendrier) ═════════════════════════ */

function CalcTool() {
  const [date, setDate] = useState('2026-10-02');
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);

  const [y, m, d] = date.split('-').map(Number);
  const valid = !!y && !!m && !!d && y >= 1600 && y <= 2399;
  const safeY = valid ? y : 2000;
  const safeM = valid ? m - 1 : 0;
  const safeD = valid ? d : 1;

  const M = monthKey(safeM, safeY);
  const S = centuryKey(safeY);
  const yk = yearKey(safeY);
  const total = safeD + M + S + yk.a;
  const res = mod7(total);
  const cum = [0, mod7(safeD), mod7(safeD + M), mod7(safeD + M + S), res];

  useEffect(() => {
    if (!auto) return;
    if (step >= 4) { setAuto(false); return; }
    const t = window.setTimeout(() => setStep((s) => s + 1), 1100);
    return () => window.clearTimeout(t);
  }, [auto, step]);

  const rows = [
    { k: 'J', label: 'Jour', val: safeD, note: 'Le quantième du mois' },
    { k: 'M', label: 'Clé du mois', val: M, note: safeM < 2 && isLeap(safeY) ? `${MONTH_KEYS[safeM]} − 1 (année bissextile)` : `Triplets de ${MONTHS[safeM]}` },
    { k: 'S', label: 'Clé du siècle', val: S, note: `Siècle ${Math.floor(safeY / 100) * 100}${S > 3 ? ` (≡ ${S - 7})` : ''}` },
    { k: 'A', label: "Clé de l'année", val: yk.a, note: `r = ${yk.aa} − 28×${yk.k} = ${yk.r} → (${yk.r} + ⌊${yk.r}/4⌋) mod 7` },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={`${card} flex flex-col items-center`}>
        <label className="mb-3 w-full text-sm font-bold text-slate-300">
          Choisis une date (1600–2399)
          <input
            type="date" value={date} min="1600-01-01" max="2399-12-31" className={input}
            onChange={(e) => { setDate(e.target.value); setStep(0); setAuto(false); }}
          />
        </label>
        <Wheel value={valid ? cum[step] : 0} />
        <div className="mt-4 grid w-full grid-cols-4 gap-2">
          <button onClick={() => { setAuto(false); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0} aria-label="Étape précédente" className={`${btnSlate} flex justify-center py-3`}><ChevronLeft /></button>
          <button onClick={() => { setAuto(false); setStep((s) => Math.min(4, s + 1)); }} disabled={step === 4} className={`${btnGreen} col-span-2 flex items-center justify-center gap-1 py-3`}>Étape suivante <ChevronRight size={18} /></button>
          <button onClick={() => { setAuto(!auto); if (step >= 4) setStep(0); }} aria-label="Lecture automatique" className={`${btnBlue} flex justify-center py-3`}>{auto ? <Square size={20} /> : <Play size={20} />}</button>
        </div>
      </div>
      <div className="space-y-3">
        {!valid && <p className="rounded-2xl bg-rose-500/15 p-3 font-bold text-rose-300">Entre une date complète entre 1600 et 2399.</p>}
        {rows.map((r, idx) => (
          <div key={r.k} className={`flex items-center gap-4 rounded-2xl border p-4 transition ${step > idx ? 'border-amber-400/60 bg-amber-400/10' : 'border-slate-700 bg-slate-800/40 opacity-50'}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-black ${step > idx ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>{r.k}</div>
            <div className="min-w-0 flex-1">
              <div className="font-bold">{r.label}</div>
              <div className="truncate text-xs text-slate-400">{r.note}</div>
            </div>
            <div className="text-2xl font-black">{step > idx ? r.val : '?'}</div>
          </div>
        ))}
        <div className={`rounded-2xl border p-4 transition ${step === 4 ? 'border-emerald-400 bg-emerald-500/15' : 'border-slate-700 bg-slate-800/40 opacity-50'}`}>
          {step === 4 ? (
            <>
              <div className="font-mono text-sm text-slate-300">({safeD} + {M} + {S} + {yk.a}) = {total} → mod 7 = {res}</div>
              <div className="mt-1 text-2xl font-black text-emerald-300">{fmtDate(safeY, safeM, safeD)} = {DAYS[res]}</div>
            </>
          ) : <div className="font-bold text-slate-400">Résultat : (J + M + S + A) mod 7</div>}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════ Outil : manipulateur Morse ═════════════════════════ */

function MorseKey() {
  const [buf, setBuf] = useState('');
  const [out, setOut] = useState('');
  const [down, setDown] = useState(false);
  const bufRef = useRef('');
  const downAt = useRef(0);
  const stopTone = useRef<null | (() => void)>(null);
  const timer = useRef<number | undefined>(undefined);

  const commit = () => {
    if (bufRef.current) setOut((o) => o + (REV[bufRef.current] ?? '?'));
    bufRef.current = '';
    setBuf('');
  };
  const press = () => {
    if (stopTone.current) return;
    window.clearTimeout(timer.current);
    downAt.current = Date.now();
    stopTone.current = startKey();
    setDown(true);
  };
  const release = () => {
    if (!stopTone.current) return;
    stopTone.current();
    stopTone.current = null;
    setDown(false);
    bufRef.current += Date.now() - downAt.current < 220 ? '.' : '-';
    setBuf(bufRef.current);
    timer.current = window.setTimeout(commit, 900);
  };
  useEffect(() => () => { window.clearTimeout(timer.current); stopTone.current?.(); }, []);

  return (
    <div className={card}>
      <h3 className="font-black">Manipulateur télégraphique</h3>
      <p className="mt-1 text-sm text-slate-400">Appui court = point, appui long = trait. La lettre est décodée après une courte pause.</p>
      <button
        onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
        className={`${down ? btnAmber : btnGreen} mt-4 w-full touch-none py-10 text-xl`}
      >
        {down ? '● ▬ …' : 'Maintiens pour émettre'}
      </button>
      <div className="mt-3 flex items-center gap-3 font-mono">
        <span className="min-h-8 flex-1 rounded-xl bg-slate-900 px-3 py-2 text-xl tracking-widest text-amber-300">{buf ? buf.split('').map((c) => (c === '.' ? '●' : '▬')).join(' ') : '…'}</span>
        <span className="text-sm text-slate-400">{buf && (REV[buf] ? `= ${REV[buf]}` : '= ?')}</span>
      </div>
      <div className="mt-3 min-h-12 rounded-xl bg-slate-900 p-3 text-2xl font-black tracking-widest text-emerald-300">{out || <span className="text-slate-600">Message décodé</span>}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={() => setOut((o) => o + ' ')} className={`${btnSlate} py-2`}>Espace</button>
        <button onClick={() => { setOut(''); bufRef.current = ''; setBuf(''); }} className={`${btnSlate} py-2`}>Effacer</button>
      </div>
    </div>
  );
}

function MorseTool() {
  const [text, setText] = useState('SOS');
  const [slow, setSlow] = useState(false);
  const { play, stop, playing } = useMorse();
  const unit = slow ? 0.14 : 0.08;
  return (
    <div className="space-y-4">
      <div className={card}>
        <label className="text-sm font-bold text-slate-300">
          Traducteur : texte → Morse (bip 600 Hz)
          <input value={text} onChange={(e) => setText(e.target.value)} className={`${input} uppercase`} />
        </label>
        <div className="mt-3 overflow-x-auto whitespace-pre rounded-xl bg-slate-900 p-3 font-mono text-2xl tracking-widest text-amber-300">{toMorse(text) || '…'}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => (playing ? stop() : play(text, unit))} className={`${playing ? btnAmber : btnGreen} flex items-center gap-2 px-5 py-3`}>
            {playing ? <><Square size={18} /> Stop</> : <><Volume2 size={18} /> Écouter</>}
          </button>
          <button onClick={() => setSlow(!slow)} className={`${slow ? btnBlue : btnSlate} px-4 py-3`}>{slow ? 'Lent' : 'Rapide'}</button>
          <button onClick={() => setText('SOS')} className={`${btnSlate} px-4 py-3`}>SOS</button>
        </div>
      </div>
      <MorseKey />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {[...ALPHA, ...DIGITS].map((ch) => (
          <button key={ch} onClick={() => play(ch, unit)} className={`${btnSlate} py-2`}>
            <div className="text-lg font-black">{ch}</div>
            <div className="text-xs text-amber-300">{pat(ch)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════ Outil : épelleur OTAN ═════════════════════════ */

function NatoTool() {
  const [text, setText] = useState('Marseille 13');
  const supported = 'speechSynthesis' in window;
  const words = useMemo(
    () => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().split('').filter((c) => /[A-Z0-9]/.test(c)).map(natoWord),
    [text],
  );
  return (
    <div className="space-y-4">
      <div className={card}>
        <label className="text-sm font-bold text-slate-300">
          Épelle un mot, un indicatif ou une plaque
          <input value={text} onChange={(e) => setText(e.target.value)} className={input} />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {words.length === 0 && <span className="text-slate-500">…</span>}
          {words.map((w, i) => (
            <button key={`${w}-${i}`} onClick={() => speakSeq([w])} className="rounded-xl bg-slate-900 px-3 py-1 text-sm font-bold text-violet-300 hover:bg-slate-700">{w}</button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => speakSeq(words)} disabled={!supported || words.length === 0} className={`${btnGreen} flex items-center gap-2 px-5 py-3`}><Volume2 size={18} /> Tout lire</button>
          <button onClick={() => window.speechSynthesis?.cancel()} disabled={!supported} className={`${btnSlate} px-4 py-3`}>Stop</button>
        </div>
        {!supported && <p className="mt-2 text-sm text-rose-300">La synthèse vocale n'est pas disponible dans ce navigateur.</p>}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ALPHA.map((ch) => (
          <button key={ch} onClick={() => speakSeq([natoWord(ch)])} className={`${btnSlate} flex items-center gap-3 px-3 py-2 text-left`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500 text-lg font-black text-white">{ch}</span>
            <span className="font-bold">{natoWord(ch)}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {DIGITS.map((d) => (
          <button key={d} onClick={() => speakSeq([ICAO_DIGITS[Number(d)]])} className={`${btnSlate} py-2`}>
            <div className="text-lg font-black">{d}</div>
            <div className="text-xs text-violet-300">{ICAO_DIGITS[Number(d)]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════ Blitz (Time Attack) adapté au cours ═════════════════════════ */

const blitzQuestion = (course: CourseId, mode: 'num' | 'day'): Q => {
  if (course === 'calendar') {
    const q = randDate();
    return { prompt: fmtDate(q.y, q.m, q.d), choices: mode === 'num' ? NUM : DAYS, answer: q.ans, explain: '' };
  }
  if (course === 'morse') return genMorse([...ALPHA, ...DIGITS], [...ALPHA, ...DIGITS], ['audio']);
  return genNato(ALPHA);
};

function Blitz({ course, best, onResult }: { course: Course; best: number; onResult: (score: number) => void }) {
  const [phase, setPhase] = useState<'idle' | 'run' | 'over'>('idle');
  const [left, setLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);
  const [mode, setMode] = useState<'num' | 'day'>('num');
  const [q, setQ] = useState<Q>(() => blitzQuestion(course.id, 'num'));
  const [flash, setFlash] = useState<'ok' | 'ko' | null>(null);
  const endAt = useRef(0);
  const { play, stop } = useMorse();
  const mult = 1 + Math.floor(combo / 5);

  const start = () => {
    setScore(0); setCombo(0); setMaxCombo(0); setGood(0); setBad(0); setFlash(null);
    setQ(blitzQuestion(course.id, mode));
    endAt.current = Date.now() + 60000;
    setLeft(60);
    setPhase('run');
  };

  useEffect(() => {
    if (phase !== 'run') return;
    const id = window.setInterval(() => {
      const l = Math.max(0, (endAt.current - Date.now()) / 1000);
      setLeft(l);
      if (l <= 0) { window.clearInterval(id); setPhase('over'); }
    }, 100);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'over') return;
    stop();
    sfx('win');
    onResult(score);
    if (score > best && score > 0) boom();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'run' && q.audio) {
      const a = q.audio;
      const t = window.setTimeout(() => play(a, 0.07), 150);
      return () => window.clearTimeout(t);
    }
  }, [q, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (idx: number) => {
    if (phase !== 'run') return;
    if (idx === q.answer) {
      setScore((s) => s + 10 * mult);
      setCombo(combo + 1);
      setMaxCombo((m) => Math.max(m, combo + 1));
      setGood((g) => g + 1);
      setFlash('ok');
      sfx('ok');
    } else {
      setCombo(0);
      setBad((b) => b + 1);
      setFlash('ko');
      sfx('ko');
    }
    setQ(blitzQuestion(course.id, mode));
    window.setTimeout(() => setFlash(null), 250);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!/^[0-9]$/.test(e.key)) return;
      const n = Number(e.key);
      const idx = course.id === 'calendar' ? n : n - 1;
      if (idx >= 0 && idx < q.choices.length) answer(idx);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const descr: Record<CourseId, string> = {
    calendar: 'Trouve le jour de chaque date, le plus vite possible.',
    morse: 'Écoute chaque signal et trouve la lettre ou le chiffre.',
    nato: 'Associe lettres et mots radio le plus vite possible.',
  };

  if (phase !== 'run') {
    return (
      <div className={`${card} mx-auto max-w-md text-center`}>
        <Zap className="mx-auto text-amber-400" size={48} />
        <h2 className="mt-2 text-3xl font-black">Blitz 60 secondes</h2>
        <p className="mt-2 text-slate-300">{descr[course.id]} Un combo de 5 bonnes réponses augmente le multiplicateur.</p>
        {phase === 'over' && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-slate-900 p-3"><div className="text-2xl font-black text-amber-300">{score}</div><div className="text-xs text-slate-400">Score</div></div>
            <div className="rounded-2xl bg-slate-900 p-3"><div className="text-2xl font-black text-emerald-300">{good}/{good + bad}</div><div className="text-xs text-slate-400">Justes</div></div>
            <div className="rounded-2xl bg-slate-900 p-3"><div className="text-2xl font-black text-orange-300">×{maxCombo}</div><div className="text-xs text-slate-400">Combo max</div></div>
          </div>
        )}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-300"><Trophy size={16} className="text-amber-400" /> Record : {Math.max(best, phase === 'over' ? score : 0)}</div>
        {course.id === 'calendar' && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => setMode('num')} className={`${mode === 'num' ? btnBlue : btnSlate} py-2`}>Chiffres 0–6</button>
            <button onClick={() => setMode('day')} className={`${mode === 'day' ? btnBlue : btnSlate} py-2`}>Noms des jours</button>
          </div>
        )}
        <button onClick={start} className={`${btnGreen} mt-4 flex w-full items-center justify-center gap-2 py-4 text-xl`}>
          {phase === 'over' ? <><RotateCcw size={22} /> Rejouer</> : <><Play size={22} /> Lancer</>}
        </button>
      </div>
    );
  }

  const cols = course.id === 'calendar' && mode === 'num' ? 'grid-cols-4' : 'grid-cols-2';
  return (
    <div className="mx-auto max-w-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 font-black text-amber-300"><Star size={20} className="fill-amber-300" />{score}</div>
        <div className="flex items-center gap-1 font-black text-orange-400"><Flame size={20} />×{mult} <span className="text-xs text-slate-400">({combo})</span></div>
        <div className="flex items-center gap-1 font-mono font-black text-sky-300"><Timer size={20} />{left.toFixed(1)}s</div>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${left < 10 ? 'bg-rose-500' : 'bg-sky-500'}`} style={{ width: `${(left / 60) * 100}%` }} />
      </div>
      <div className={`mt-6 rounded-3xl border-2 p-6 text-center transition-colors duration-150 ${flash === 'ok' ? 'border-emerald-400 bg-emerald-500/20' : flash === 'ko' ? 'border-rose-500 bg-rose-500/20' : 'border-slate-700 bg-slate-800'}`}>
        {q.audio ? (
          <button onClick={() => play(q.audio as string, 0.07)} aria-label="Réécouter" className={`${btnBlue} mx-auto flex h-20 w-20 items-center justify-center rounded-full`}><Volume2 size={34} /></button>
        ) : (
          <div className="text-2xl font-black sm:text-4xl">{q.prompt}</div>
        )}
        {q.audio && <div className="mt-2 text-sm text-slate-400">Quelle lettre ou quel chiffre ?</div>}
      </div>
      <div className={`mt-5 grid gap-3 ${cols}`}>
        {q.choices.map((c, idx) => (
          <button key={`${c}-${idx}`} onClick={() => answer(idx)} className={`${course.id === 'calendar' && mode === 'num' ? btnSlate : btnBlue} break-words py-5 text-xl`}>{c}</button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">Clavier : touches {course.id === 'calendar' ? '0 à 6' : `1 à ${q.choices.length}`}</p>
    </div>
  );
}

/* ═════════════════════════ Sélecteur de cours ═════════════════════════ */

function CourseSwitcher({ current, pct, onPick, onClose }: { current: CourseId; pct: Record<CourseId, number>; onPick: (id: CourseId) => void; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Choisir un cours">
      <div className="w-full max-w-md rounded-t-3xl border border-slate-700 bg-slate-800 p-4 shadow-2xl sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">Choisis ton cours</h2>
          <button onClick={onClose} aria-label="Fermer" className="rounded-full p-2 text-slate-400 hover:bg-slate-700 hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          {COURSES.map((c) => (
            <button
              key={c.id} onClick={() => onPick(c.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition hover:bg-slate-700 ${c.id === current ? 'border-amber-400 bg-slate-700/60' : 'border-slate-700 bg-slate-900/40'}`}
            >
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${c.theme.soft}`}>{c.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-black">{c.name}</span>
                  <span className={`text-sm font-black ${c.theme.text}`}>{pct[c.id]}%</span>
                </span>
                <span className="block text-xs text-slate-400">{c.tagline}</span>
                <span className="mt-2 block h-2 overflow-hidden rounded-full bg-slate-700">
                  <span className="block h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct[c.id]}%` }} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════ Application ═════════════════════════ */

type Tab = 'path' | 'tool' | 'blitz';

export default function GameDashboard({ onExitGame, initialCourse }: { onExitGame: () => void; initialCourse?: CourseId }) {
  const [save, setSave] = useState<Save>(() => {
    const loaded = loadSave();
    return initialCourse ? { ...loaded, lastCourse: initialCourse } : loaded;
  });
  const [tab, setTab] = useState<Tab>('path');
  const [lesson, setLesson] = useState<Level | null>(null);
  const [switcher, setSwitcher] = useState(false);

  const course = COURSES.find((c) => c.id === save.lastCourse) ?? COURSES[0];
  const done = save.completedLevelsByCourse[course.id];

  useEffect(() => {
    sfxOn = save.sound;
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(save)); } catch { /* stockage indisponible */ }
  }, [save]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const pct = useMemo(() => {
    const out = { calendar: 0, morse: 0, nato: 0 } as Record<CourseId, number>;
    COURSES.forEach((c) => {
      const n = save.completedLevelsByCourse[c.id].filter((id) => c.levels.some((l) => l.id === id)).length;
      out[c.id] = Math.round((n / c.levels.length) * 100);
    });
    return out;
  }, [save.completedLevelsByCourse]);

  const finishLesson = (id: number, gain: number) =>
    setSave((s) => {
      const list = s.completedLevelsByCourse[course.id];
      return {
        ...s,
        completedLevelsByCourse: { ...s.completedLevelsByCourse, [course.id]: list.includes(id) ? list : [...list, id] },
        totalXp: s.totalXp + gain,
        ...bumpStreak(s),
      };
    });

  const blitzResult = (score: number) =>
    setSave((s) => ({
      ...s,
      totalXp: s.totalXp + Math.round(score / 10),
      bestByCourse: { ...s.bestByCourse, [course.id]: Math.max(s.bestByCourse[course.id], score) },
      ...bumpStreak(s),
    }));

  const pickCourse = (id: CourseId) => {
    setSave((s) => ({ ...s, lastCourse: id }));
    setTab('path');
    setLesson(null);
    setSwitcher(false);
  };

  const tabs: { id: Tab; label: string; icon: ReactElement }[] = [
    { id: 'path', label: 'Parcours', icon: <MapIcon size={22} /> },
    { id: 'tool', label: course.tool, icon: <Sliders size={22} /> },
    { id: 'blitz', label: 'Blitz', icon: <Zap size={22} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-28 text-slate-100">
      <style>{`@media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}`}</style>

      <div className="border-b border-slate-800 bg-slate-950/60">
        <div className="mx-auto max-w-4xl px-3 py-1">
          <button onClick={onExitGame} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white">
            ← Revenir au site
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-2">
          <button
            onClick={() => setSwitcher(true)} aria-haspopup="dialog"
            className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-left transition hover:bg-slate-700"
          >
            <span className="text-2xl">{course.emoji}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black">{course.name}</span>
              <span className="block text-xs text-slate-400">{pct[course.id]}% · changer de cours</span>
            </span>
            <ChevronDown size={18} className="shrink-0 text-slate-400" />
          </button>
          <div className="flex shrink-0 items-center gap-3 text-sm font-black">
            <span className="flex items-center gap-1 text-orange-400" title="Série de jours"><Flame size={18} className={liveStreak(save) > 0 ? 'fill-orange-400' : ''} />{liveStreak(save)}</span>
            <span className="flex items-center gap-1 text-amber-300" title="XP total"><Star size={18} className="fill-amber-300" />{save.totalXp}</span>
            <button
              onClick={() => setSave((s) => ({ ...s, sound: !s.sound }))}
              aria-label={save.sound ? 'Couper les effets sonores' : 'Activer les effets sonores'}
              className={`relative rounded-full p-1.5 hover:bg-slate-800 ${save.sound ? 'text-slate-200' : 'text-slate-600'}`}
            >
              <Volume2 size={20} />
              {!save.sound && <X size={12} className="absolute right-0 top-0 text-rose-400" strokeWidth={3} />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-6">
        {lesson ? (
          <Lesson key={`${course.id}-${lesson.id}`} course={course} level={lesson} onExit={() => setLesson(null)} onDone={finishLesson} />
        ) : (
          <>
            {tab === 'path' && (
              <>
                <div className={`${card} mb-4`}>
                  <div className={`font-mono text-lg font-bold ${course.theme.text}`}>{course.code}</div>
                  <p className="mt-1 text-sm text-slate-300">{course.intro}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct[course.id]}%` }} />
                  </div>
                </div>
                <SkillTree course={course} done={done} onOpen={setLesson} />
              </>
            )}
            {tab === 'tool' && (
              <>
                {course.id === 'calendar' && <CalcTool />}
                {course.id === 'morse' && <MorseTool />}
                {course.id === 'nato' && <NatoTool />}
              </>
            )}
            {tab === 'blitz' && <Blitz key={course.id} course={course} best={save.bestByCourse[course.id]} onResult={blitzResult} />}
          </>
        )}
      </main>

      {!lesson && (
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-1 p-2">
            {tabs.map((t) => (
              <button
                key={t.id} onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-xs font-bold transition ${tab === t.id ? `${course.theme.soft} ${course.theme.text}` : 'text-slate-400 hover:text-slate-200'}`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {switcher && <CourseSwitcher current={course.id} pct={pct} onPick={pickCourse} onClose={() => setSwitcher(false)} />}
    </div>
  );
}
