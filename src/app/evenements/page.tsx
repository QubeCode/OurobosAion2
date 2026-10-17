import type { Metadata } from "next";
import { EventBoard } from "@/components/events/event-board";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Calendrier de guilde Ouroboros — récurrence tous les 3 jours à 20:45 Europe/Paris.",
};

export default function EvenementsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-glow">
          Calendrier de guilde
        </p>
        <h1 className="font-display text-4xl text-gold">Événements</h1>
        <p className="text-muted-foreground">
          Planning interne Ouroboros uniquement — ce n’est pas le calendrier
          officiel d’AION 2. RSVP local à cet appareil.
        </p>
      </header>
      <EventBoard />
    </div>
  );
}
