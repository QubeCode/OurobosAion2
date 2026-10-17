"use client";

import { useEffect, useState } from "react";
import { useGuildStore } from "@/context/guild-store";
import type { CalendarSettings, SiteSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export function AdminPanel() {
  const {
    ready,
    settings,
    updateSettings,
    resetDemoData,
    clearRegistrations,
  } = useGuildStore();

  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready) setDraft(settings);
  }, [ready, settings]);

  function patchCalendar(partial: Partial<CalendarSettings>) {
    setDraft((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, ...partial },
    }));
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!draft.guildName.trim()) {
      setError("Le nom de guilde est obligatoire.");
      return;
    }
    if (!draft.discordInviteUrl.trim()) {
      setError("L’URL Discord est obligatoire (modifiable facilement ici).");
      return;
    }
    if (draft.calendar.intervalDays < 1) {
      setError("L’intervalle de récurrence doit être d’au moins 1 jour.");
      return;
    }
    updateSettings({
      ...draft,
      abyssesLocalOverride: draft.abyssesLocalOverride?.trim()
        ? draft.abyssesLocalOverride.trim()
        : null,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  if (!ready) {
    return <p className="text-muted-foreground">Chargement…</p>;
  }

  return (
    <div className="space-y-8">
      <Alert className="border-gold/40 bg-card/70">
        <AlertTitle className="text-gold">Accès non authentifié</AlertTitle>
        <AlertDescription>
          Cette page admin est un lien non listé — ce n’est pas une vraie
          authentification. Ne stocke jamais de mots de passe ou secrets dans le
          code client. Les données restent en localStorage (navigateur).
        </AlertDescription>
      </Alert>

      <form onSubmit={onSave} className="space-y-6 rounded-xl border border-border/70 bg-card/50 p-4 sm:p-6">
        <h2 className="font-display text-xl text-gold">Identité de la guilde</h2>
        <div className="space-y-2">
          <Label htmlFor="guildName">Nom</Label>
          <Input
            id="guildName"
            value={draft.guildName}
            onChange={(e) => setDraft({ ...draft, guildName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="presentation">Présentation</Label>
          <Textarea
            id="presentation"
            rows={3}
            value={draft.presentation}
            onChange={(e) =>
              setDraft({ ...draft, presentation: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discord">URL d’invitation Discord</Label>
          <Input
            id="discord"
            type="url"
            value={draft.discordInviteUrl}
            onChange={(e) =>
              setDraft({ ...draft, discordInviteUrl: e.target.value })
            }
            placeholder="https://discord.gg/…"
          />
          <p className="text-xs text-muted-foreground">
            Change cette URL ici pour mettre à jour tous les boutons Discord du
            site.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Input
              id="timezone"
              value={draft.timezone}
              onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minGs">GS minimum</Label>
            <Input
              id="minGs"
              type="number"
              min={0}
              value={draft.minGs}
              onChange={(e) =>
                setDraft({ ...draft, minGs: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <Separator />

        <h2 className="font-display text-xl text-gold">
          Calendrier (récurrence)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="refLocal">Référence (locale)</Label>
            <Input
              id="refLocal"
              type="datetime-local"
              value={draft.calendar.referenceLocal.slice(0, 16)}
              onChange={(e) =>
                patchCalendar({
                  referenceLocal: e.target.value
                    ? `${e.target.value}:00`
                    : draft.calendar.referenceLocal,
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              Réf. : mardi 20 oct. 2026 20:45 Europe/Paris — puis +N jours.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Intervalle (jours)</Label>
            <Input
              id="interval"
              type="number"
              min={1}
              value={draft.calendar.intervalDays}
              onChange={(e) =>
                patchCalendar({
                  intervalDays: Number(e.target.value) || 1,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hour">Heure</Label>
            <Input
              id="hour"
              type="number"
              min={0}
              max={23}
              value={draft.calendar.hour}
              onChange={(e) =>
                patchCalendar({ hour: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minute">Minute</Label>
            <Input
              id="minute"
              type="number"
              min={0}
              max={59}
              value={draft.calendar.minute}
              onChange={(e) =>
                patchCalendar({ minute: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="evTitle">Titre par défaut</Label>
          <Input
            id="evTitle"
            value={draft.calendar.defaultTitle}
            onChange={(e) => patchCalendar({ defaultTitle: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="evDesc">Description par défaut</Label>
          <Textarea
            id="evDesc"
            rows={2}
            value={draft.calendar.defaultDescription}
            onChange={(e) =>
              patchCalendar({ defaultDescription: e.target.value })
            }
          />
        </div>

        <Separator />

        <h2 className="font-display text-xl text-gold">Timer Abysses</h2>
        <div className="space-y-2">
          <Label htmlFor="abysses">
            Horaire spécial Abysses (optionnel, {draft.timezone})
          </Label>
          <Input
            id="abysses"
            type="datetime-local"
            value={draft.abyssesLocalOverride?.slice(0, 16) ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                abyssesLocalOverride: e.target.value || null,
              })
            }
          />
          <p className="text-xs text-muted-foreground">
            Si vide, le compte à rebours pointe vers le prochain événement de
            guilde (récurrence).
          </p>
          {draft.abyssesLocalOverride && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setDraft({ ...draft, abyssesLocalOverride: null })
              }
            >
              Effacer l’override
            </Button>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {saved && (
          <p className="text-sm text-cyan-glow" role="status">
            Réglages enregistrés localement.
          </p>
        )}

        <Button type="submit" className="glow-gold">
          Enregistrer les réglages
        </Button>
      </form>

      <div className="space-y-3 rounded-xl border border-destructive/30 bg-card/40 p-4">
        <h2 className="font-display text-lg text-foreground">Données démo</h2>
        <p className="text-sm text-muted-foreground">
          Les profils et événements marqués « Démo » sont fictifs. Réinitialiser
          recharge les données d’exemple ; effacer les inscriptions retire
          uniquement les candidatures non-démo.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={resetDemoData}>
            Réinitialiser données démo
          </Button>
          <Button type="button" variant="destructive" onClick={clearRegistrations}>
            Effacer inscriptions / RSVP
          </Button>
        </div>
      </div>
    </div>
  );
}
