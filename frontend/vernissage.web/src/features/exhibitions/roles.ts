import type { CreatorRole } from '../../types/auth';

/** How a role reads for one show ("I exhibited", "I curated", "We hosted"). */
export const ROLE_IN_SHOW: Record<CreatorRole, string> = {
  Artist: 'I exhibited',
  Curator: 'I curated',
  Gallery: 'We hosted it',
};

/** Short badge / filter label per role. */
export const ROLE_BADGE: Record<CreatorRole, string> = {
  Artist: 'As artist',
  Curator: 'As curator',
  Gallery: 'As gallery',
};
