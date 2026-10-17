import type { GuildEvent, MemberProfile } from "@/lib/types";

/** Clearly labeled demo profiles — fictional, no real personal data. */
export const DEMO_MEMBERS: MemberProfile[] = [
  {
    id: "demo-member-1",
    pseudo: "Astraël",
    gs: 1680,
    orientation: "both",
    availabilityDays: ["tue", "thu", "sat"],
    frequency: "three_plus",
    timeSlots: "20h–23h (Europe/Paris)",
    className: "Assassin",
    server: "Démo",
    faction: "—",
    createdAt: "2026-10-01T18:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-member-2",
    pseudo: "NyxOr",
    gs: 1520,
    orientation: "pve",
    availabilityDays: ["wed", "fri", "sun"],
    frequency: "one_two",
    timeSlots: "Soirées (variable)",
    className: "Clerc",
    server: "Démo",
    createdAt: "2026-10-05T12:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-member-3",
    pseudo: "Serpentis",
    gs: 1810,
    orientation: "pvp",
    availabilityDays: ["mon", "tue", "wed", "thu", "fri"],
    frequency: "every_day",
    timeSlots: "21h–00h",
    className: "Gladiateur",
    server: "Démo",
    createdAt: "2026-10-08T09:30:00.000Z",
    isDemo: true,
  },
];

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
