import { useState } from 'react';
import { CREATOR_ROLES } from '../../../types/auth';
import type { CreatorRole } from '../../../types/auth';
import { ROLE_IN_SHOW } from '../../exhibitions/roles';

// What each role adds to the account: these are the real per-role parts of the app.
const ROLE_ADDS: Record<CreatorRole, string[]> = {
  Artist: ['Medium on your profile', 'Solo & group shows on your CV', 'Works sold per show'],
  Curator: ['Place of work on your profile', '"Curated by me" on your CV', 'Checklist, team & research per show'],
  Gallery: ['Gallery name, focus & founding year', 'Season figures across the program', 'Costs & visitors per show'],
};

const NOUN: Record<CreatorRole, string> = { Artist: 'Artist', Curator: 'Curator', Gallery: 'Gallery' };

/** Tick roles to see one account combine them: profile line, per-show choice, features. */
export default function RoleMixer() {
  const [roles, setRoles] = useState<CreatorRole[]>(['Artist', 'Curator']);
  const toggle = (role: CreatorRole) =>
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  const ordered = CREATOR_ROLES.filter((r) => roles.includes(r));

  return (
    <div className="role-mixer">
      <div className="role-mixer-pick">
        <p className="demo-step">
          <span>1</span> Tick every role that&apos;s yours
        </p>
        <div className="role-chips role-chips--lg">
          {CREATOR_ROLES.map((r) => (
            <label key={r} className={`role-chip${roles.includes(r) ? ' is-on' : ''}`}>
              <input type="checkbox" checked={roles.includes(r)} onChange={() => toggle(r)} />
              {NOUN[r]}
            </label>
          ))}
        </div>
        <p className="role-mixer-card" aria-live="polite">
          <span className="role-mixer-card-roles">{ordered.length ? ordered.join(' · ') : 'No role yet'}</span>
          <span className="role-mixer-card-name">Your Name</span>
        </p>
      </div>

      <div className="role-mixer-result" aria-live="polite">
        <p className="demo-step">
          <span>2</span> For each show, say which hat you wore
        </p>
        {ordered.length > 0 ? (
          <div className="role-chips">
            {ordered.map((r) => (
              <span key={r} className="role-chip is-preview">
                {ROLE_IN_SHOW[r]}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted">Pick at least one role.</p>
        )}
        <p className="demo-step">
          <span>3</span> Everything sorts itself
        </p>
        <ul className="role-mixer-adds">
          {ordered.flatMap((r) =>
            ROLE_ADDS[r].map((item) => (
              <li key={item} className={`role-add role-add--${r.toLowerCase()}`}>
                {item}
              </li>
            )),
          )}
          {ordered.length > 1 && <li className="role-add role-add--all">My exhibitions filtered by role</li>}
        </ul>
      </div>
    </div>
  );
}
