"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/config";
import { localStringToUtc } from "@/lib/calendar";
import {
  createDefaultPersistedData,
  loadPersistedData,
  savePersistedData,
  type PersistedGuildData,
} from "@/lib/storage";
import type {
  GuildEvent,
  MemberProfile,
  RsvpStatus,
  SiteSettings,
  SpecialEventInput,
} from "@/lib/types";

interface GuildStoreValue {
  ready: boolean;
  data: PersistedGuildData;
  settings: SiteSettings;
  members: MemberProfile[];
  specialEvents: GuildEvent[];
  getRsvp: (eventId: string) => RsvpStatus | null;
  addMember: (member: Omit<MemberProfile, "id" | "createdAt" | "isDemo">) => MemberProfile;
  setRsvp: (eventId: string, status: RsvpStatus) => void;
  addSpecialEvent: (input: SpecialEventInput) => GuildEvent;
  updateSpecialEvent: (id: string, input: SpecialEventInput) => void;
  deleteSpecialEvent: (id: string) => void;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  resetDemoData: () => void;
  clearRegistrations: () => void;
}

const GuildStoreContext = createContext<GuildStoreValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function GuildStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<PersistedGuildData>(() =>
    createDefaultPersistedData()
  );

  useEffect(() => {
    setData(loadPersistedData());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    savePersistedData(data);
  }, [data, ready]);

  const patch = useCallback((updater: (prev: PersistedGuildData) => PersistedGuildData) => {
    setData((prev) => updater(prev));
  }, []);

  const addMember = useCallback(
    (member: Omit<MemberProfile, "id" | "createdAt" | "isDemo">) => {
      const created: MemberProfile = {
        ...member,
        id: uid("member"),
        createdAt: new Date().toISOString(),
      };
      patch((prev) => ({ ...prev, members: [created, ...prev.members] }));
      return created;
    },
    [patch]
  );

  const getRsvp = useCallback(
    (eventId: string) =>
      data.rsvps.find((r) => r.eventId === eventId)?.status ?? null,
    [data.rsvps]
  );

  const setRsvp = useCallback(
    (eventId: string, status: RsvpStatus) => {
      patch((prev) => {
        const others = prev.rsvps.filter((r) => r.eventId !== eventId);
        return {
          ...prev,
          rsvps: [
            ...others,
            { eventId, status, updatedAt: new Date().toISOString() },
          ],
        };
      });
    },
    [patch]
  );

  const addSpecialEvent = useCallback(
    (input: SpecialEventInput) => {
      const startsAt = localStringToUtc(
        input.localStartsAt.length === 16
          ? `${input.localStartsAt}:00`
          : input.localStartsAt,
        data.settings.timezone
      ).toISOString();

      const event: GuildEvent = {
        id: uid("special"),
        title: input.title,
        type: input.type,
        description: input.description,
        organizer: input.organizer,
        startsAt,
        isRecurring: false,
      };

      patch((prev) => ({
        ...prev,
        specialEvents: [...prev.specialEvents, event],
      }));
      return event;
    },
    [data.settings.timezone, patch]
  );

  const updateSpecialEvent = useCallback(
    (id: string, input: SpecialEventInput) => {
      const startsAt = localStringToUtc(
        input.localStartsAt.length === 16
          ? `${input.localStartsAt}:00`
          : input.localStartsAt,
        data.settings.timezone
      ).toISOString();

      patch((prev) => ({
        ...prev,
        specialEvents: prev.specialEvents.map((e) =>
          e.id === id
            ? {
                ...e,
                title: input.title,
                type: input.type,
                description: input.description,
                organizer: input.organizer,
                startsAt,
                isDemo: false,
              }
            : e
        ),
      }));
    },
    [data.settings.timezone, patch]
  );

  const deleteSpecialEvent = useCallback(
    (id: string) => {
      patch((prev) => ({
        ...prev,
        specialEvents: prev.specialEvents.filter((e) => e.id !== id),
        rsvps: prev.rsvps.filter((r) => r.eventId !== id),
      }));
    },
    [patch]
  );

  const updateSettings = useCallback(
    (partial: Partial<SiteSettings>) => {
      patch((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...partial,
          calendar: {
            ...prev.settings.calendar,
            ...(partial.calendar ?? {}),
          },
        },
      }));
    },
    [patch]
  );

  const resetDemoData = useCallback(() => {
    setData(createDefaultPersistedData());
  }, []);

  const clearRegistrations = useCallback(() => {
    patch((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.isDemo),
      rsvps: [],
    }));
  }, [patch]);

  const value = useMemo<GuildStoreValue>(
    () => ({
      ready,
      data,
      settings: data.settings ?? DEFAULT_SITE_SETTINGS,
      members: data.members,
      specialEvents: data.specialEvents,
      getRsvp,
      addMember,
      setRsvp,
      addSpecialEvent,
      updateSpecialEvent,
      deleteSpecialEvent,
      updateSettings,
      resetDemoData,
      clearRegistrations,
    }),
    [
      ready,
      data,
      getRsvp,
      addMember,
      setRsvp,
      addSpecialEvent,
      updateSpecialEvent,
      deleteSpecialEvent,
      updateSettings,
      resetDemoData,
      clearRegistrations,
    ]
  );

  return (
    <GuildStoreContext.Provider value={value}>
      {children}
    </GuildStoreContext.Provider>
  );
}

export function useGuildStore(): GuildStoreValue {
  const ctx = useContext(GuildStoreContext);
  if (!ctx) {
    throw new Error("useGuildStore must be used within GuildStoreProvider");
  }
  return ctx;
}
