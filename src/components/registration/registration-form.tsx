"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useGuildStore } from "@/context/guild-store";
import {
  FREQUENCY_LABELS,
  ORIENTATION_LABELS,
  WEEKDAY_LABELS,
  WEEKDAYS,
} from "@/lib/config";
import type { Frequency, Orientation, Weekday } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormState {
  pseudo: string;
  gs: string;
  orientation: Orientation | "";
  availabilityDays: Weekday[];
  frequency: Frequency | "";
  timeSlots: string;
  className: string;
  server: string;
  faction: string;
}

const INITIAL: FormState = {
  pseudo: "",
  gs: "",
  orientation: "",
  availabilityDays: [],
  frequency: "",
  timeSlots: "",
  className: "",
  server: "",
  faction: "",
};

export function RegistrationForm() {
  const { settings, addMember } = useGuildStore();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [discordMessage, setDiscordMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function toggleDay(day: Weekday) {
    setForm((prev) => ({
      ...prev,
      availabilityDays: prev.availabilityDays.includes(day)
        ? prev.availabilityDays.filter((d) => d !== day)
        : [...prev.availabilityDays, day],
    }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.pseudo.trim()) {
      next.pseudo = "Le pseudo in-game est obligatoire.";
    }
    const gsNum = Number(form.gs);
    if (!form.gs.trim() || Number.isNaN(gsNum)) {
      next.gs = "Indique un GS numérique valide.";
    } else if (gsNum < settings.minGs) {
      next.gs = `Le GS minimum pour rejoindre ${settings.guildName} est de ${settings.minGs} GS. Ton GS actuel (${gsNum}) est insuffisant.`;
    }
    if (!form.orientation) {
      next.orientation = "Choisis une orientation (PvP, PvE ou les deux).";
    }
    if (form.availabilityDays.length === 0) {
      next.availabilityDays = "Sélectionne au moins un jour de disponibilité.";
    }
    if (!form.frequency) {
      next.frequency = "Indique ta fréquence de jeu.";
    }
    if (!form.timeSlots.trim()) {
      next.timeSlots = "Précise tes créneaux habituels.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setDiscordMessage(null);
    setCopied(false);
    if (!validate()) return;

    const member = addMember({
      pseudo: form.pseudo.trim(),
      gs: Number(form.gs),
      orientation: form.orientation as Orientation,
      availabilityDays: form.availabilityDays,
      frequency: form.frequency as Frequency,
      timeSlots: form.timeSlots.trim(),
      className: form.className.trim() || undefined,
      server: form.server.trim() || undefined,
      faction: form.faction.trim() || undefined,
    });

    const msg = `Salut ! Je m'appelle ${member.pseudo}, GS ${member.gs}. Je souhaite rejoindre la guilde ${settings.guildName} 🐍`;
    setDiscordMessage(msg);
    setSuccessMessage(
      `Bienvenue, ${member.pseudo} ! Ta candidature est enregistrée localement. Copie le message ci-dessous et colle-le sur Discord — Discord ne le préremplit pas automatiquement.`
    );
    setForm(INITIAL);
  }

  async function copyMessage() {
    if (!discordMessage) return;
    try {
      await navigator.clipboard.writeText(discordMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrors((prev) => ({
        ...prev,
        copy: "Impossible de copier automatiquement — sélectionne le texte manuellement.",
      }));
    }
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="border-cyan-glow/40 bg-card/80">
          <AlertTitle className="text-cyan-glow">Candidature enregistrée</AlertTitle>
          <AlertDescription className="text-foreground/90">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {discordMessage && (
        <div className="space-y-3 rounded-xl border border-gold/40 bg-card/70 p-4">
          <p className="text-sm font-medium text-gold">
            Message Discord personnalisé (à coller toi-même)
          </p>
          <pre className="whitespace-pre-wrap rounded-lg bg-night-deep/80 p-3 text-sm text-foreground">
            {discordMessage}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={copyMessage} className="gap-2">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copié !" : "Copier le message"}
            </Button>
            <Button
              type="button"
              variant="outline"
              nativeButton={false}
              className="gap-2"
              render={
                <a
                  href={settings.discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Ouvrir Discord
              <ExternalLink className="size-4" />
            </Button>
          </div>
          {errors.copy && (
            <p className="text-sm text-destructive" role="alert">
              {errors.copy}
            </p>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="pseudo">Pseudo in-game *</Label>
          <Input
            id="pseudo"
            name="pseudo"
            autoComplete="nickname"
            value={form.pseudo}
            onChange={(e) => setForm({ ...form, pseudo: e.target.value })}
            aria-invalid={!!errors.pseudo}
            aria-describedby={errors.pseudo ? "pseudo-error" : undefined}
          />
          {errors.pseudo && (
            <p id="pseudo-error" className="text-sm text-destructive" role="alert">
              {errors.pseudo}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gs">
            Gear Score (GS) * — minimum {settings.minGs} GS
          </Label>
          <Input
            id="gs"
            name="gs"
            type="number"
            inputMode="numeric"
            min={0}
            value={form.gs}
            onChange={(e) => setForm({ ...form, gs: e.target.value })}
            aria-invalid={!!errors.gs}
            aria-describedby={errors.gs ? "gs-error" : "gs-hint"}
          />
          <p id="gs-hint" className="text-xs text-muted-foreground">
            Pour rejoindre {settings.guildName}, un GS d’au moins {settings.minGs}{" "}
            est requis.
          </p>
          {errors.gs && (
            <p id="gs-error" className="text-sm text-destructive" role="alert">
              {errors.gs}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="orientation">Orientation *</Label>
          <Select
            value={form.orientation || undefined}
            onValueChange={(v) =>
              setForm({ ...form, orientation: (v ?? "") as Orientation | "" })
            }
          >
            <SelectTrigger id="orientation" aria-invalid={!!errors.orientation}>
              <SelectValue placeholder="Choisir…" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ORIENTATION_LABELS) as Orientation[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {ORIENTATION_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.orientation && (
            <p className="text-sm text-destructive" role="alert">
              {errors.orientation}
            </p>
          )}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Jours de disponibilité *</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WEEKDAYS.map((day) => {
              const checked = form.availabilityDays.includes(day);
              return (
                <label
                  key={day}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/70 bg-card/40 px-3 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-glow/50"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleDay(day)}
                    aria-label={WEEKDAY_LABELS[day]}
                  />
                  {WEEKDAY_LABELS[day]}
                </label>
              );
            })}
          </div>
          {errors.availabilityDays && (
            <p className="text-sm text-destructive" role="alert">
              {errors.availabilityDays}
            </p>
          )}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="frequency">Fréquence *</Label>
          <Select
            value={form.frequency || undefined}
            onValueChange={(v) =>
              setForm({ ...form, frequency: (v ?? "") as Frequency | "" })
            }
          >
            <SelectTrigger id="frequency" aria-invalid={!!errors.frequency}>
              <SelectValue placeholder="Choisir…" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {FREQUENCY_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.frequency && (
            <p className="text-sm text-destructive" role="alert">
              {errors.frequency}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeSlots">Créneaux habituels *</Label>
          <Textarea
            id="timeSlots"
            name="timeSlots"
            rows={2}
            placeholder="Ex. : 20h–23h en semaine, après-midi le week-end"
            value={form.timeSlots}
            onChange={(e) => setForm({ ...form, timeSlots: e.target.value })}
            aria-invalid={!!errors.timeSlots}
          />
          {errors.timeSlots && (
            <p className="text-sm text-destructive" role="alert">
              {errors.timeSlots}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="className">Classe (optionnel)</Label>
            <Input
              id="className"
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="server">Serveur (optionnel)</Label>
            <Input
              id="server"
              value={form.server}
              onChange={(e) => setForm({ ...form, server: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faction">Faction (optionnel)</Label>
            <Input
              id="faction"
              value={form.faction}
              onChange={(e) => setForm({ ...form, faction: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto glow-gold">
          Envoyer ma candidature
        </Button>
      </form>
    </div>
  );
}
