import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/admin-panel";

export const metadata: Metadata = {
  title: "Admin",
  description: "Réglages locaux du site guilde Ouroboros (lien non listé).",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-glow">
          Administration
        </p>
        <h1 className="font-display text-4xl text-gold">Réglages du site</h1>
        <p className="text-muted-foreground">
          Discord, présentation, calendrier et timer Abysses. Données
          uniquement dans ce navigateur.
        </p>
      </header>
      <AdminPanel />
    </div>
  );
}
