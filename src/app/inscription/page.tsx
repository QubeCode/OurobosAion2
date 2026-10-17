import type { Metadata } from "next";
import { RegistrationForm } from "@/components/registration/registration-form";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Candidate pour rejoindre la guilde Ouroboros sur AION 2 — GS minimum 1400.",
};

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-glow">
          Candidature
        </p>
        <h1 className="font-display text-4xl text-gold">Rejoindre Ouroboros</h1>
        <p className="text-muted-foreground">
          Remplis le formulaire ci-dessous. Après validation, tu pourras copier
          un message Discord personnalisé (à coller toi-même sur le serveur).
        </p>
      </header>
      <RegistrationForm />
    </div>
  );
}
