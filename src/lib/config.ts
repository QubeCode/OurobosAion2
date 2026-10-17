import type { SiteSettings } from "@/lib/types";

/** Source of truth for defaults — override via Admin (localStorage) or future DB. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  guildName: "Ouroboros",
  presentation:
    "Guilde francophone d’Aion 2 réunissant joueurs débutants comme vétérans. Progresser ensemble, s’entraider et profiter du jeu sans prise de tête.",
  discordInviteUrl: "https://discord.gg/REPLACE_ME",
  timezone: "Europe/Paris",
  minGs: 1400,
  calendar: {
    referenceLocal: "2026-10-20T20:45:00",
    intervalDays: 3,
    hour: 20,
    minute: 45,
    defaultTitle: "Soirée de guilde",
    defaultType: "Guilde",
    defaultDescription:
      "Rendez-vous de la confrérie : activités PvE/PvP selon l’ambiance du moment. Calendrier de guilde uniquement — pas le planning officiel d’AION 2.",
    defaultOrganizer: "Officiers Ouroboros",
  },
  abyssesLocalOverride: null,
};

export const SITE_META = {
  game: "AION 2",
  lang: "fr",
  storageKey: "ouroboros-aion2-guild-v1",
} as const;

export const WEEKDAY_LABELS: Record<
  import("@/lib/types").Weekday,
  string
> = {
  mon: "Lundi",
  tue: "Mardi",
  wed: "Mercredi",
  thu: "Jeudi",
  fri: "Vendredi",
  sat: "Samedi",
  sun: "Dimanche",
};

export const WEEKDAYS = Object.keys(WEEKDAY_LABELS) as import("@/lib/types").Weekday[];

export const ORIENTATION_LABELS: Record<
  import("@/lib/types").Orientation,
  string
> = {
  pvp: "PvP",
  pve: "PvE",
  both: "PvP & PvE",
};

export const FREQUENCY_LABELS: Record<
  import("@/lib/types").Frequency,
  string
> = {
  every_day: "Tous les jours",
  three_plus: "3+ jours / semaine",
  one_two: "1–2 jours / semaine",
  variable: "Variable",
};

export const RSVP_LABELS: Record<import("@/lib/types").RsvpStatus, string> = {
  present: "Présent",
  maybe: "Peut-être",
  absent: "Absent",
};

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/inscription", label: "Inscription" },
  { href: "/evenements", label: "Événements" },
  { href: "/abysses", label: "Abysses" },
  { href: "/membres", label: "Membres" },
] as const;
