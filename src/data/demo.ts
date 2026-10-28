export type DemoTheme = 'amber' | 'teal' | 'violet' | 'rose';

export type DemoCollection = {
  id: string;
  name: string;
  count: number;
  accent: DemoTheme;
  description: string;
};

export type DemoQr = {
  id: string;
  title: string;
  subtitle: string;
  type: 'Text' | 'URL' | 'Contact' | 'Wi-Fi' | 'Event';
  content: string;
  folder: string;
  favorite: boolean;
  scans: number;
  updatedAt: string;
  accent: DemoTheme;
};

export type DemoActivity = {
  title: string;
  detail: string;
  time: string;
  tone: DemoTheme;
};

export type DemoStat = {
  label: string;
  value: string;
  change: string;
};

export type DemoOnboardingSlide = {
  eyebrow: string;
  title: string;
  description: string;
  accent: DemoTheme;
};

export const demoStats: DemoStat[] = [
  { label: 'QR générés', value: '128', change: '+18% cette semaine' },
  { label: 'Scans actifs', value: '8.4k', change: '+32% MoM' },
  { label: 'Favoris', value: '24', change: '8 ajoutés aujourd’hui' },
  { label: 'Collections', value: '12', change: '3 dossiers partagés' },
];

export const demoCollections: DemoCollection[] = [
  {
    id: 'branding',
    name: 'Branding',
    count: 18,
    accent: 'amber',
    description: 'Assets, cartes de visite et landing pages.',
  },
  {
    id: 'events',
    name: 'Events',
    count: 9,
    accent: 'teal',
    description: 'Billetterie, check-in et RSVP.',
  },
  {
    id: 'products',
    name: 'Products',
    count: 27,
    accent: 'violet',
    description: 'Séries dédiées aux produits digitaux.',
  },
  {
    id: 'private',
    name: 'Private',
    count: 6,
    accent: 'rose',
    description: 'Codes sensibles pour les démos internes.',
  },
];

export const demoQrs: DemoQr[] = [
  {
    id: 'qr-aurora',
    title: 'Aurum Launch Kit',
    subtitle: 'Page de lancement',
    type: 'URL',
    content: 'https://aurum.design/launch',
    folder: 'Branding',
    favorite: true,
    scans: 1248,
    updatedAt: 'il y a 12 min',
    accent: 'amber',
  },
  {
    id: 'qr-atelier',
    title: 'Atelier RSVP',
    subtitle: 'Inscription à un événement',
    type: 'Event',
    content: 'Atelier premium - 17 juillet - Paris',
    folder: 'Events',
    favorite: false,
    scans: 842,
    updatedAt: 'hier',
    accent: 'teal',
  },
  {
    id: 'qr-vcard',
    title: 'Founder vCard',
    subtitle: 'Carte de contact',
    type: 'Contact',
    content: 'Mickael Delormes · hello@aurum.studio',
    folder: 'Private',
    favorite: true,
    scans: 512,
    updatedAt: 'il y a 2 jours',
    accent: 'violet',
  },
  {
    id: 'qr-wifi',
    title: 'Showroom Wi-Fi',
    subtitle: 'Accès au réseau',
    type: 'Wi-Fi',
    content: 'Aurum_Showroom / premium2026',
    folder: 'Events',
    favorite: false,
    scans: 291,
    updatedAt: 'il y a 4 jours',
    accent: 'rose',
  },
];

export const demoActivity: DemoActivity[] = [
  {
    title: 'Aurum Launch Kit scanné 34 fois',
    detail: 'La campagne social ads surperforme sur mobile.',
    time: 'Aujourd’hui, 09:40',
    tone: 'amber',
  },
  {
    title: 'Nouveau dossier “Private” créé',
    detail: 'Accès restreint pour les démonstrations confidentielles.',
    time: 'Hier, 18:12',
    tone: 'violet',
  },
  {
    title: 'Favoris synchronisés',
    detail: 'Le flux visuel a été épinglé au tableau de bord.',
    time: 'Hier, 12:05',
    tone: 'teal',
  },
];

export const weeklyScans = [
  { day: 'Lun', value: 35 },
  { day: 'Mar', value: 42 },
  { day: 'Mer', value: 28 },
  { day: 'Jeu', value: 54 },
  { day: 'Ven', value: 72 },
  { day: 'Sam', value: 61 },
  { day: 'Dim', value: 39 },
];

export const demoOnboardingSlides: DemoOnboardingSlide[] = [
  {
    eyebrow: 'Premium demo',
    title: 'Transforme un générateur QR en produit vitrine',
    description:
      'Une interface plus cinématographique, des parcours guidés et une sensation de produit réellement commercialisable.',
    accent: 'amber',
  },
  {
    eyebrow: 'Collections & analytics',
    title: 'Montre la maîtrise d’un vrai dashboard mobile',
    description:
      'Statistiques avancées, favoris, dossiers, historique détaillé et interactions visuelles pour raconter une vraie histoire produit.',
    accent: 'teal',
  },
  {
    eyebrow: 'High-end mobile system',
    title: 'Une base que tu peux vendre comme template premium',
    description:
      'Le tout fonctionne sans backend, avec des données mockées et un workflow fluide pour exposer ton savoir-faire.',
    accent: 'violet',
  },
];
