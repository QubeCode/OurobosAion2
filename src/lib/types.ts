export type Orientation = "pvp" | "pve" | "both";

export type Frequency =
  | "every_day"
  | "three_plus"
  | "one_two"
  | "variable";

export type Weekday =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export type RsvpStatus = "present" | "maybe" | "absent";

export interface MemberProfile {
  id: string;
  pseudo: string;
  gs: number;
  orientation: Orientation;
  availabilityDays: Weekday[];
  frequency: Frequency;
  timeSlots: string;
  className?: string;
  server?: string;
  faction?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface GuildEvent {
  id: string;
  title: string;
  type: string;
  description: string;
  organizer: string;
  /** Instant ISO UTC */
  startsAt: string;
  /** If true, generated from recurrence (not user-created special) */
  isRecurring: boolean;
  isDemo?: boolean;
}

export interface SpecialEventInput {
  title: string;
  type: string;
  description: string;
  organizer: string;
  /** Local datetime string YYYY-MM-DDTHH:mm in site timezone */
  localStartsAt: string;
}

export interface RsvpRecord {
  eventId: string;
  status: RsvpStatus;
  updatedAt: string;
}

export interface CalendarSettings {
  /** Reference local datetime in site timezone: YYYY-MM-DDTHH:mm:ss */
  referenceLocal: string;
  intervalDays: number;
  hour: number;
  minute: number;
  defaultTitle: string;
  defaultType: string;
  defaultDescription: string;
  defaultOrganizer: string;
}

export interface SiteSettings {
  guildName: string;
  presentation: string;
  discordInviteUrl: string;
  timezone: string;
  minGs: number;
  calendar: CalendarSettings;
  /** Optional override for Abysses countdown (local datetime in timezone) */
  abyssesLocalOverride: string | null;
}

export interface GuildStoreState {
  settings: SiteSettings;
  members: MemberProfile[];
  specialEvents: GuildEvent[];
  rsvps: RsvpRecord[];
}
