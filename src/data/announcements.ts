export interface Announcement {
  id: string;
  label: string;
  title: string;
  description: string;
  /** Visibility window: inclusive start, exclusive end. Include a timezone. */
  startsAt: string;
  endsAt: string;
  eventStartsAt?: string;
  primaryLink: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
}

// Public announcements, in display order. See README.md#homepage-announcements.
export const announcements: Announcement[] = [
  {
    id: 'community-call-4',
    label: 'You’re invited',
    title: 'Pubky Community Call #4',
    description:
      'New SDK, AI tooling, new Pubky app features, self-hosting on Umbrel, and more. Join the conversation.',
    startsAt: '2026-09-27T00:00:00Z',
    endsAt: '2026-10-07T18:00:00Z',
    eventStartsAt: '2026-10-07T16:00:00Z',
    primaryLink: {
      label: 'Join the call',
      href: 'https://meet.google.com/xny-ztvd-zyk',
    },
    secondaryLink: {
      label: 'Discuss on Pubky',
      href: 'https://pubky.app/post/ihaqcthsdbk751sxctk849bdr7yz7a934qen5gmpcbwcur49i97y/0035REMNNEZ1G',
    },
  },
];

// Catch authoring mistakes at build time instead of silently missing a schedule.
const ids = new Set<string>();
function timestamp(value: string): number {
  const time = Date.parse(value);
  const parts = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.exec(value);
  // Compare the local date fields too: Date.parse otherwise normalizes dates
  // such as February 30 into March instead of rejecting them.
  if (!parts || !Number.isFinite(time) || new Date(`${parts[1]}Z`).toISOString().slice(0, 19) !== parts[1]) {
    throw new Error(`Announcement dates must be ISO timestamps with a timezone: ${value}`);
  }
  return time;
}

for (const announcement of announcements) {
  if (!/^[a-z0-9-]+$/.test(announcement.id) || ids.has(announcement.id)) {
    throw new Error(`Announcement IDs must be unique slugs: ${announcement.id}`);
  }
  ids.add(announcement.id);
  if (timestamp(announcement.endsAt) <= timestamp(announcement.startsAt)) {
    throw new Error(`Announcement must end after it starts: ${announcement.id}`);
  }
  if (announcement.eventStartsAt) timestamp(announcement.eventStartsAt);
  for (const link of [announcement.primaryLink, announcement.secondaryLink]) {
    if (link && new URL(link.href).protocol !== 'https:') {
      throw new Error(`Announcement links must use HTTPS: ${announcement.id}`);
    }
  }
}
