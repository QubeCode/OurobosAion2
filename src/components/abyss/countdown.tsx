"use client";

import { useEffect, useState } from "react";
import {
  formatEventDateTime,
  getCountdownParts,
  getNextAbyssesTarget,
  pad2,
} from "@/lib/calendar";
import { useGuildStore } from "@/context/guild-store";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center rounded-xl border border-border/70 bg-card/60 px-3 py-3 backdrop-blur-sm sm:min-w-[5.5rem] sm:px-4">
      <span className="font-display text-3xl tabular-nums text-gold sm:text-4xl">
        {pad2(value)}
      </span>
      <span className="mt-1 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function AbyssCountdown({ compact = false }: { compact?: boolean }) {
  const { settings, specialEvents, ready } = useGuildStore();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!ready || !now) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-center text-muted-foreground">
        Chargement du timer…
      </div>
    );
  }

  const target = getNextAbyssesTarget(
    settings.calendar,
    settings.timezone,
    settings.abyssesLocalOverride,
    specialEvents,
    now
  );
  const parts = getCountdownParts(target.at, now);

  return (
    <div className={compact ? "" : "space-y-4"}>
      {!compact && (
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-glow">
            Prochaines Abysses
          </p>
          <h2 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            {target.label}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatEventDateTime(target.at, settings.timezone)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Fuseau : {settings.timezone}
            {target.source === "override" ? " · horaire spécial admin" : ""}
          </p>
        </div>
      )}

      <div
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <Unit value={parts.days} label="Jours" />
        <Unit value={parts.hours} label="Heures" />
        <Unit value={parts.minutes} label="Minutes" />
        <Unit value={parts.seconds} label="Secondes" />
      </div>

      {compact && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {formatEventDateTime(target.at, settings.timezone)}
        </p>
      )}
    </div>
  );
}
