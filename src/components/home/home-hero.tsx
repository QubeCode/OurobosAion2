"use client";

import Link from "next/link";
import { OuroborosRing } from "@/components/celestial/ouroboros-ring";
import { useGuildStore } from "@/context/guild-store";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  const { settings } = useGuildStore();

  return (
    <section className="relative isolate min-h-[calc(100svh-7rem)] overflow-hidden">
      {/* Full-bleed celestial plane */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,32,58,0.4)_0%,transparent_70%)]" />
        <div className="anim-twinkle absolute left-[12%] top-[22%] size-1 rounded-full bg-cyan-glow" />
        <div className="anim-twinkle absolute right-[18%] top-[30%] size-1.5 rounded-full bg-gold [animation-delay:1s]" />
        <div className="anim-twinkle absolute left-[40%] top-[18%] size-1 rounded-full bg-foreground/70 [animation-delay:2s]" />
        <div className="anim-twinkle absolute right-[30%] bottom-[28%] size-1 rounded-full bg-cyan-glow/80 [animation-delay:0.5s]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%] opacity-40 sm:opacity-55">
          <OuroborosRing size={420} className="max-w-[70vw]" />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-10 text-center sm:px-6 sm:pt-16">
        <p className="anim-fade-rise text-sm uppercase tracking-[0.35em] text-cyan-glow">
          AION 2 · Guilde francophone
        </p>
        <h1 className="anim-fade-rise-delay font-display mt-4 text-5xl leading-tight text-gold sm:text-7xl md:text-8xl">
          {settings.guildName}
        </h1>
        <p className="anim-fade-rise-delay-2 mx-auto mt-6 max-w-xl text-base text-foreground/85 sm:text-lg">
          Progresser ensemble, s’entraider et profiter du jeu sans prise de
          tête. GS minimum {settings.minGs}.
        </p>
        <div className="anim-fade-rise-delay-2 mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="glow-gold min-w-[12rem] bg-gold text-gold-foreground hover:bg-gold/90"
            render={<Link href="/inscription" />}
          >
            Rejoindre la guilde
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="glow-cyan min-w-[12rem] border-cyan-glow/50 text-cyan-glow hover:bg-cyan-glow/10"
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
  );
}
