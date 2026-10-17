import type { Metadata } from "next";
import Link from "next/link";
import { AbyssCountdown } from "@/components/abyss/countdown";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Abysses",
  description:
    "Compte à rebours vers le prochain événement Abysses de la guilde Ouroboros.",
};

export default function AbyssesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-10 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-glow">
          Timer dynamique
        </p>
        <h1 className="font-display text-4xl text-gold">Abysses</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Compte à rebours vers le prochain créneau. Par défaut : prochain
          événement de guilde (récurrence). Un officier peut définir un horaire
          spécial dans l’admin.
        </p>
      </header>

      <div className="rounded-2xl border border-border/70 bg-card/50 p-6 sm:p-10">
        <AbyssCountdown />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/evenements" />}
        >
          Voir les événements
        </Button>
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/admin" />}
        >
          Configurer (admin)
        </Button>
      </div>
    </div>
  );
}
