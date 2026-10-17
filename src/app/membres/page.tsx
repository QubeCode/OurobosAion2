import type { Metadata } from "next";
import { MemberDirectory } from "@/components/members/member-directory";

export const metadata: Metadata = {
  title: "Membres",
  description:
    "Liste des profils inscrits à la guilde Ouroboros — filtres orientation et disponibilité.",
};

export default function MembresPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-glow">
          Confrérie
        </p>
        <h1 className="font-display text-4xl text-gold">Membres</h1>
        <p className="max-w-2xl text-muted-foreground">
          Profils enregistrés via le formulaire d’inscription (stockage local /
          démo). Filtre par orientation ou jour de disponibilité.
        </p>
      </header>
      <MemberDirectory />
    </div>
  );
}
