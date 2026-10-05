import Logo from '../../components/Logo';
import type { Profile } from '../../types/profile';

interface Props {
  profile: Profile;
  photoUrl: string | null;
}

/** Initials for the avatar when there is no photo. */
function initials(profile: Profile): string {
  const fromName = [profile.firstName, profile.lastName]
    .map((part) => part?.trim()[0])
    .filter(Boolean)
    .join('');
  return (fromName || (profile.displayName || profile.email).slice(0, 2)).toUpperCase();
}

/** Renders a social-media value as a link when it is a URL, plain text otherwise. */
function Social({ value }: { value: string }) {
  if (/^https?:\/\//i.test(value)) {
    return (
      <a href={value} target="_blank" rel="noreferrer">
        {value.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}
      </a>
    );
  }
  return <>{value}</>;
}

/**
 * The profile shown as a business card: who you are, what you do and how to
 * reach you. Shows only the fields that are filled in, so a fresh account gets
 * a clean card rather than a column of empty labels.
 */
export default function BusinessCard({ profile, photoUrl }: Props) {
  const isGallery = profile.roles.includes('Gallery');
  const isPerson = profile.roles.includes('Curator') || profile.roles.includes('Artist');
  const isArtist = profile.roles.includes('Artist');

  const personName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  // A person's card leads with their name; a gallery-only card with the gallery.
  const name = (isPerson && personName) || profile.galleryName || profile.displayName || profile.email;
  const organisation = isPerson ? profile.placeOfWork ?? (isGallery ? profile.galleryName : null) : null;

  const details: { label: string; value: string }[] = [];
  const add = (label: string, value: string | number | null | undefined, when = true) => {
    if (when && value !== null && value !== undefined && String(value).trim() !== '') {
      details.push({ label, value: String(value) });
    }
  };
  add('Medium', profile.medium, isArtist);
  add('Focus', profile.focus, isGallery);
  add('Interests', profile.areasOfInterest, isPerson);
  add('Based in', profile.location, isPerson);
  add('Gallery', profile.businessLocation, isGallery);
  add('Founded', profile.foundingYear, isGallery);

  return (
    <article className="business-card" aria-label="Business card">
      <div className="business-card-main">
        {photoUrl ? (
          <img className="business-card-photo" src={photoUrl} alt="" />
        ) : (
          <span className="business-card-photo business-card-initials" aria-hidden="true">
            {initials(profile)}
          </span>
        )}

        <div className="business-card-id">
          <p className="business-card-roles">{profile.roles.join(' · ')}</p>
          <h3 className="business-card-name">{name}</h3>
          {organisation && <p className="business-card-org">{organisation}</p>}
        </div>
      </div>

      {details.length > 0 && (
        <dl className="business-card-details">
          {details.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <footer className="business-card-foot">
        <span className="business-card-contact">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {isPerson && profile.socialMedia && (
            <>
              <span className="sep">·</span>
              <Social value={profile.socialMedia} />
            </>
          )}
        </span>
        <span className="business-card-brand" aria-hidden="true">
          <Logo size={16} />
        </span>
      </footer>
    </article>
  );
}
