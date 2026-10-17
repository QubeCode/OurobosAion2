import type { GuildEvent } from "@/lib/types";

export const DEMO_SPECIAL_EVENTS: GuildEvent[] = [
  {
    id: "demo-special-1",
    title: "Raid découverte (démo)",
    type: "Raid",
    description:
      "Événement spécial de démonstration. Données locales uniquement — non synchronisées entre appareils.",
    organizer: "Officier Démo",
    // 25 oct 2026 20:45 Europe/Paris = CET (UTC+1) after DST ends that morning
    startsAt: "2026-10-25T19:45:00.000Z",
    isRecurring: false,
    isDemo: true,
  },
];
