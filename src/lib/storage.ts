import { DEFAULT_SITE_SETTINGS, SITE_META } from "@/lib/config";
import { DEMO_SPECIAL_EVENTS } from "@/lib/demo-data";
import type {
  GuildEvent,
  MemberProfile,
  RsvpRecord,
  SiteSettings,
} from "@/lib/types";

export interface PersistedGuildData {
  version: 1;
  settings: SiteSettings;
  /** Inscriptions locales (non exposées publiquement) */
  members: MemberProfile[];
  specialEvents: GuildEvent[];
  rsvps: RsvpRecord[];
  /** When true, demo seed events were loaded once */
  seededDemo: boolean;
}

export function createDefaultPersistedData(): PersistedGuildData {
  return {
    version: 1,
    settings: structuredClone(DEFAULT_SITE_SETTINGS),
    members: [],
    specialEvents: structuredClone(DEMO_SPECIAL_EVENTS),
    rsvps: [],
    seededDemo: true,
  };
}

export function loadPersistedData(): PersistedGuildData {
  if (typeof window === "undefined") {
    return createDefaultPersistedData();
  }

  try {
    const raw = window.localStorage.getItem(SITE_META.storageKey);
    if (!raw) {
      const fresh = createDefaultPersistedData();
      window.localStorage.setItem(SITE_META.storageKey, JSON.stringify(fresh));
      return fresh;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedGuildData>;
    const mergedSettings: SiteSettings = {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed.settings,
      calendar: {
        ...DEFAULT_SITE_SETTINGS.calendar,
        ...parsed.settings?.calendar,
      },
    };
    // Migrate placeholder invite to the permanent guild link
    if (
      !mergedSettings.discordInviteUrl ||
      mergedSettings.discordInviteUrl.includes("REPLACE_ME")
    ) {
      mergedSettings.discordInviteUrl = DEFAULT_SITE_SETTINGS.discordInviteUrl;
    }
    return {
      version: 1,
      settings: mergedSettings,
      members: Array.isArray(parsed.members) ? parsed.members : [],
      specialEvents: Array.isArray(parsed.specialEvents)
        ? parsed.specialEvents
        : DEMO_SPECIAL_EVENTS,
      rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : [],
      seededDemo: parsed.seededDemo ?? true,
    };
  } catch {
    return createDefaultPersistedData();
  }
}

export function savePersistedData(data: PersistedGuildData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SITE_META.storageKey, JSON.stringify(data));
}

/**
 * Future adapters (Supabase / Firebase) can implement the same shape.
 * Keep UI talking to GuildStore context, not storage details.
 */
export interface GuildDataAdapter {
  load(): Promise<PersistedGuildData> | PersistedGuildData;
  save(data: PersistedGuildData): Promise<void> | void;
}

export const localStorageAdapter: GuildDataAdapter = {
  load: loadPersistedData,
  save: savePersistedData,
};
