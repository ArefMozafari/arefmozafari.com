/// The homepage sections, in page order. Ids double as anchor targets.
export const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'open-source', label: 'Open source' },
  { id: 'posts', label: 'Posts' },
  { id: 'contact', label: 'Contact' },
] as const;

export type Section = (typeof SECTIONS)[number];
