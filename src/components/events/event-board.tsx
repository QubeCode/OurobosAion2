"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatEventDateTime,
  generateRecurringEvents,
  mergeEvents,
  toLocalInputValue,
} from "@/lib/calendar";
import { RSVP_LABELS } from "@/lib/config";
import { useGuildStore } from "@/context/guild-store";
import type { GuildEvent, RsvpStatus, SpecialEventInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

function RsvpButtons({
  eventId,
  current,
  onChange,
}: {
  eventId: string;
  current: RsvpStatus | null;
  onChange: (status: RsvpStatus) => void;
}) {
  const options: RsvpStatus[] = ["present", "maybe", "absent"];
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label={`RSVP pour l'événement ${eventId}`}
    >
      {options.map((status) => {
        const active = current === status;
        return (
          <Button
            key={status}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            aria-pressed={active}
            onClick={() => onChange(status)}
            className={
              active
                ? status === "present"
                  ? "bg-cyan-glow text-night-deep hover:bg-cyan-glow/90"
                  : status === "maybe"
                    ? "bg-gold text-gold-foreground"
                    : ""
                : ""
            }
          >
            {RSVP_LABELS[status]}
          </Button>
        );
      })}
    </div>
  );
}

const emptyForm: SpecialEventInput = {
  title: "",
  type: "Spécial",
  description: "",
  organizer: "Officiers Ouroboros",
  localStartsAt: "",
};

export function EventBoard() {
  const {
    ready,
    settings,
    specialEvents,
    getRsvp,
    setRsvp,
    addSpecialEvent,
    updateSpecialEvent,
    deleteSpecialEvent,
  } = useGuildStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SpecialEventInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const events = useMemo(() => {
    if (!now) return [];
    const recurring = generateRecurringEvents(
      settings.calendar,
      settings.timezone,
      10,
      now
    );
    return mergeEvents(recurring, specialEvents);
  }, [settings.calendar, settings.timezone, specialEvents, now]);

  function openCreate() {
    setEditingId(null);
    const next = generateRecurringEvents(
      settings.calendar,
      settings.timezone,
      1,
      now ?? new Date()
    )[0];
    setForm({
      ...emptyForm,
      localStartsAt: next
        ? toLocalInputValue(new Date(next.startsAt), settings.timezone)
        : "",
    });
    setFormError(null);
    setDialogOpen(true);
  }

  function openEdit(event: GuildEvent) {
    if (event.isRecurring) return;
    setEditingId(event.id);
    setForm({
      title: event.title,
      type: event.type,
      description: event.description,
      organizer: event.organizer,
      localStartsAt: toLocalInputValue(
        new Date(event.startsAt),
        settings.timezone
      ),
    });
    setFormError(null);
    setDialogOpen(true);
  }

  function saveEvent() {
    if (!form.title.trim() || !form.localStartsAt) {
      setFormError("Le titre et la date/heure sont obligatoires.");
      return;
    }
    if (editingId) {
      updateSpecialEvent(editingId, form);
    } else {
      addSpecialEvent(form);
    }
    setDialogOpen(false);
  }

  if (!ready || !now) {
    return (
      <p className="text-muted-foreground" role="status">
        Chargement du calendrier…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Récurrence : tous les {settings.calendar.intervalDays} jours à{" "}
            {String(settings.calendar.hour).padStart(2, "0")}:
            {String(settings.calendar.minute).padStart(2, "0")} (
            {settings.timezone}). Calendrier de guilde uniquement.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          Ajouter un événement spécial
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-card/40 p-8 text-center">
          <p className="font-display text-lg text-gold">Aucun événement à venir</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajuste la récurrence dans l’admin ou crée un événement spécial.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => {
            const rsvp = getRsvp(event.id);
            return (
              <li
                key={event.id}
                className="rounded-xl border border-border/70 bg-card/55 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl text-foreground">
                        {event.title}
                      </h3>
                      <Badge variant="secondary">{event.type}</Badge>
                      {event.isRecurring && (
                        <Badge variant="outline">Récurrent</Badge>
                      )}
                      {event.isDemo && (
                        <Badge variant="outline" className="border-gold/50 text-gold">
                          Démo
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-cyan-glow">
                      {formatEventDateTime(
                        new Date(event.startsAt),
                        settings.timezone
                      )}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Organisateur : {event.organizer}
                    </p>
                  </div>
                  {!event.isRecurring && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(event)}
                      >
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Supprimer cet événement spécial ?"
                            )
                          ) {
                            deleteSpecialEvent(event.id);
                          }
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4 border-t border-border/40 pt-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Ta présence
                  </p>
                  <RsvpButtons
                    eventId={event.id}
                    current={rsvp}
                    onChange={(status) => setRsvp(event.id, status)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Modifier l’événement" : "Nouvel événement spécial"}
            </DialogTitle>
            <DialogDescription>
              Horaires interprétés en {settings.timezone} (gestion DST
              automatique).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ev-title">Titre</Label>
              <Input
                id="ev-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-type">Type</Label>
              <Input
                id="ev-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-when">Date et heure ({settings.timezone})</Label>
              <Input
                id="ev-when"
                type="datetime-local"
                value={form.localStartsAt}
                onChange={(e) =>
                  setForm({ ...form, localStartsAt: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-org">Organisateur</Label>
              <Input
                id="ev-org"
                value={form.organizer}
                onChange={(e) =>
                  setForm({ ...form, organizer: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-desc">Description</Label>
              <Textarea
                id="ev-desc"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={saveEvent}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
