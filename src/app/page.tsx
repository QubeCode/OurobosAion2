"use client";

import Link from "next/link";
import { HomeHero } from "@/components/home/home-hero";
import { AbyssCountdown } from "@/components/abyss/countdown";
import { useGuildStore } from "@/context/guild-store";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  { icon: "⚔️", text: "PvE & PvP" },
  { icon: "⚔️", text: "1400 GS minimum" },
  { icon: "🤝", text: "Entraide et coopération" },
  { icon: "🐣", text: "Accueil des débutants" },
  { icon: "🐉", text: "Donjons, boss & raids" },
  { icon: "🏆", text: "Événements et activités de guilde" },
  { icon: "😎", text: "Une ambiance chill et conviviale" },
] as const;

export default function HomePage() {
  const { settings } = useGuildStore();

  return (
    <>
      <HomeHero />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="ornament-line mb-10" />
        <h2 className="font-display text-center text-3xl text-gold sm:text-4xl">
          🐍 Bienvenue chez {settings.guildName} 🐍
        </h2>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
          <p>
            Ouroboros est une guilde francophone d’Aion 2 réunissant joueurs
            débutants comme vétérans.
          </p>
          <p>
            Notre objectif est simple : progresser ensemble, s’entraider et
            profiter du jeu sans prise de tête.
          </p>
        </div>

        <ul className="mt-10 space-y-3">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item.text}
              className="flex items-start gap-3 border-l-2 border-gold/40 pl-4 text-foreground/90"
            >
              <span aria-hidden className="shrink-0">
                {item.icon}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
          <p>Chez Ouroboros, chacun avance à son rythme.</p>
          <p>
            Que tu sois là pour tryhard, découvrir Aion 2 ou simplement jouer
            avec des gens sympas, tu es le/la bienvenu(e).
          </p>
        </div>
      </section>

      <section className="border-y border-border/40 bg-night-deep/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="ornament-line mb-10" />
          <h2 className="font-display text-center text-2xl text-cyan-glow sm:text-3xl">
            Premiers pas dans la confrérie
          </h2>
          <ol className="mt-8 space-y-5 text-base leading-relaxed sm:text-lg">
            <li>
              <span aria-hidden>📜</span> Première étape : lis le{" "}
              <strong className="font-medium text-gold">📖・règlement</strong>
            </li>
            <li>
              <span aria-hidden>👤</span> Ensuite : viens te présenter dans{" "}
              <strong className="font-medium text-gold">
                🎭・présentations
              </strong>
            </li>
            <li>
              <span aria-hidden>🐣</span> Besoin d&apos;aide ? Le salon{" "}
              <strong className="font-medium text-cyan-glow">
                #nid-des-nouveaux
              </strong>{" "}
              est là pour toi.
            </li>
            <li>
              <span aria-hidden>⚔️</span> Envie de jouer ? Rejoins la confrérie
              et trouve tes compagnons dans{" "}
              <strong className="font-medium text-cyan-glow">
                #recherche-de-groupe
              </strong>
            </li>
          </ol>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Discord est vivement recommandé et obligatoire pendant les
            événements de guilde, au minimum pour écouter les calls.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/inscription" />} className="glow-gold">
              Rejoindre la guilde
            </Button>
            <Button
              variant="outline"
              render={
                <a
                  href={settings.discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Rejoindre le Discord
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="ornament-line mb-10" />
        <p className="text-lg text-foreground/90 sm:text-xl">
          🐍 Bienvenue dans la confrérie, aventurier.
        </p>
        <blockquote className="mx-auto mt-6 max-w-xl font-display text-xl italic leading-relaxed text-gold sm:text-2xl">
          « Le serpent se mord la queue. La confrérie, elle, ne laisse personne
          derrière. »
        </blockquote>
      </section>

      <section className="border-t border-border/40 bg-card/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <AbyssCountdown />
          <div className="mt-8 text-center">
            <Button variant="outline" render={<Link href="/abysses" />}>
              Voir le timer Abysses
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
