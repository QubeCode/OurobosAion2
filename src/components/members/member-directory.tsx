"use client";

import { useMemo, useState } from "react";
import { useGuildStore } from "@/context/guild-store";
import {
  FREQUENCY_LABELS,
  ORIENTATION_LABELS,
  WEEKDAY_LABELS,
  WEEKDAYS,
} from "@/lib/config";
import type { Orientation, Weekday } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function MemberDirectory() {
  const { ready, members } = useGuildStore();
  const [orientation, setOrientation] = useState<Orientation | "all">("all");
  const [day, setDay] = useState<Weekday | "all">("all");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (orientation !== "all" && m.orientation !== orientation) return false;
      if (day !== "all" && !m.availabilityDays.includes(day)) return false;
      return true;
    });
  }, [members, orientation, day]);

  if (!ready) {
    return <p className="text-muted-foreground">Chargement des membres…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:min-w-[180px]">
          <Label htmlFor="filter-orientation">Orientation</Label>
          <Select
            value={orientation}
            onValueChange={(v) =>
              setOrientation((v as Orientation | "all") ?? "all")
            }
          >
            <SelectTrigger id="filter-orientation" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {(Object.keys(ORIENTATION_LABELS) as Orientation[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {ORIENTATION_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:min-w-[180px]">
          <Label htmlFor="filter-day">Jour dispo</Label>
          <Select
            value={day}
            onValueChange={(v) => setDay((v as Weekday | "all") ?? "all")}
          >
            <SelectTrigger id="filter-day" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les jours</SelectItem>
              {WEEKDAYS.map((d) => (
                <SelectItem key={d} value={d}>
                  {WEEKDAY_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setOrientation("all");
            setDay("all");
          }}
        >
          Réinitialiser
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-card/30 px-6 py-12 text-center">
          <p className="font-display text-2xl text-gold">La confrérie t’attend</p>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Aucun profil ne correspond à ces filtres pour le moment. Sois le/la
            premier·ère à t’inscrire — Ouroboros ne laisse personne derrière.
          </p>
          <Button render={<a href="/inscription" />} className="mt-6">
            S’inscrire
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <li
              key={member.id}
              className="rounded-xl border border-border/70 bg-card/55 p-4 transition-colors hover:border-cyan-glow/40"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg text-foreground">
                  {member.pseudo}
                </h3>
                {member.isDemo && (
                  <Badge variant="outline" className="border-gold/50 text-gold">
                    Démo
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-gold">GS {member.gs}</p>
              <p className="mt-2 text-sm text-cyan-glow">
                {ORIENTATION_LABELS[member.orientation]}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {FREQUENCY_LABELS[member.frequency]} · {member.timeSlots}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {member.availabilityDays.map((d) => (
                  <Badge key={d} variant="secondary" className="text-[0.7rem]">
                    {WEEKDAY_LABELS[d].slice(0, 3)}
                  </Badge>
                ))}
              </div>
              {(member.className || member.server || member.faction) && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {[member.className, member.server, member.faction]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
