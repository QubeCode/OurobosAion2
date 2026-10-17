import type { CalendarSettings, GuildEvent } from "@/lib/types";

/**
 * Convert a wall-clock datetime in `timeZone` to a UTC Date.
 * Handles Europe/Paris DST by measuring the offset at that instant.
 */
export function zonedLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0,
  timeZone = "Europe/Paris"
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date(utcGuess))
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  ) as Record<string, string>;

  let asHour = Number(parts.hour);
  if (asHour === 24) asHour = 0;

  const asLocalMs = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    asHour,
    Number(parts.minute),
    Number(parts.second)
  );

  return new Date(utcGuess - (asLocalMs - utcGuess));
}

export function parseLocalDateTime(local: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const [datePart, timePart = "00:00:00"] = local.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  return { year, month, day, hour, minute, second };
}

export function localStringToUtc(local: string, timeZone: string): Date {
  const p = parseLocalDateTime(local);
  return zonedLocalToUtc(
    p.year,
    p.month,
    p.day,
    p.hour,
    p.minute,
    p.second,
    timeZone
  );
}

/** Add calendar days to a Y-M-D (no DST weirdness on the date itself). */
export function addCalendarDays(
  year: number,
  month: number,
  day: number,
  days: number
): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(year, month - 1, day + days));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

export function formatInTimeZone(
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    ...options,
  }).format(date);
}

export function formatEventDateTime(date: Date, timeZone: string): string {
  const dateStr = formatInTimeZone(date, timeZone, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = formatInTimeZone(date, timeZone, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} · ${timeStr} (${timeZone})`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toLocalInputValue(date: Date, timeZone: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  ) as Record<string, string>;

  let hour = parts.hour;
  if (hour === "24") hour = "00";
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
}

/**
 * Generate recurring guild events from reference + interval.
 * Times are always calendar.hour:calendar.minute in the given timezone.
 */
export function generateRecurringEvents(
  calendar: CalendarSettings,
  timeZone: string,
  count = 12,
  from: Date = new Date()
): GuildEvent[] {
  const ref = parseLocalDateTime(calendar.referenceLocal);
  let cursor = {
    year: ref.year,
    month: ref.month,
    day: ref.day,
  };

  const events: GuildEvent[] = [];
  // Walk forward until we're at/after `from`, then take `count`
  // Cap iterations to avoid infinite loops
  for (let i = 0; i < 500 && events.length < count; i++) {
    const startsAt = zonedLocalToUtc(
      cursor.year,
      cursor.month,
      cursor.day,
      calendar.hour,
      calendar.minute,
      0,
      timeZone
    );

    if (startsAt.getTime() >= from.getTime() - 60_000) {
      const id = `recurring-${cursor.year}${pad2(cursor.month)}${pad2(cursor.day)}`;
      events.push({
        id,
        title: calendar.defaultTitle,
        type: calendar.defaultType,
        description: calendar.defaultDescription,
        organizer: calendar.defaultOrganizer,
        startsAt: startsAt.toISOString(),
        isRecurring: true,
      });
    }

    cursor = addCalendarDays(
      cursor.year,
      cursor.month,
      cursor.day,
      calendar.intervalDays
    );
  }

  return events;
}

export function mergeEvents(
  recurring: GuildEvent[],
  special: GuildEvent[]
): GuildEvent[] {
  return [...recurring, ...special].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
}

export function getNextAbyssesTarget(
  calendar: CalendarSettings,
  timeZone: string,
  abyssesLocalOverride: string | null,
  specialEvents: GuildEvent[],
  now = new Date()
): { at: Date; label: string; source: "override" | "recurring" | "special" } {
  if (abyssesLocalOverride) {
    const at = localStringToUtc(abyssesLocalOverride, timeZone);
    if (at.getTime() > now.getTime()) {
      return { at, label: "Abysses (horaire spécial)", source: "override" };
    }
  }

  const recurring = generateRecurringEvents(calendar, timeZone, 8, now);
  const merged = mergeEvents(recurring, specialEvents).filter(
    (e) => new Date(e.startsAt).getTime() > now.getTime()
  );

  if (merged[0]) {
    return {
      at: new Date(merged[0].startsAt),
      label: merged[0].title,
      source: merged[0].isRecurring ? "recurring" : "special",
    };
  }

  // Fallback: next theoretical slot
  const fallback = generateRecurringEvents(calendar, timeZone, 1, now)[0];
  return {
    at: fallback ? new Date(fallback.startsAt) : new Date(now.getTime() + 86_400_000),
    label: calendar.defaultTitle,
    source: "recurring",
  };
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function getCountdownParts(target: Date, now = new Date()): CountdownParts {
  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86_400);
  const hours = Math.floor((totalSec % 86_400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, totalMs };
}
