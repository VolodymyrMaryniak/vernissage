import { useState } from 'react';
import { CREATOR_ROLES } from '../../../types/auth';
import type { CreatorRole } from '../../../types/auth';
import { useMessages } from '../../../i18n/useI18n';

/** Tick roles to see one account combine them: profile line, per-show choice, features. */
export default function RoleMixer() {
  const m = useMessages();
  const t = m.how.mixer;
  const [roles, setRoles] = useState<CreatorRole[]>(['Artist', 'Curator']);
  const toggle = (role: CreatorRole) =>
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  const ordered = CREATOR_ROLES.filter((r) => roles.includes(r));

  return (
    <div className="role-mixer">
      <div className="role-mixer-pick">
        <p className="demo-step">
          <span>1</span> {t.step1}
        </p>
        <div className="role-chips role-chips--lg">
          {CREATOR_ROLES.map((r) => (
            <label key={r} className={`role-chip${roles.includes(r) ? ' is-on' : ''}`}>
              <input type="checkbox" checked={roles.includes(r)} onChange={() => toggle(r)} />
              {m.roles.name[r]}
            </label>
          ))}
        </div>
        <p className="role-mixer-card" aria-live="polite">
          <span className="role-mixer-card-roles">
            {ordered.length ? ordered.map((r) => m.roles.name[r]).join(' · ') : t.noRole}
          </span>
          <span className="role-mixer-card-name">{t.yourName}</span>
        </p>
      </div>

      <div className="role-mixer-result" aria-live="polite">
        <p className="demo-step">
          <span>2</span> {t.step2}
        </p>
        {ordered.length > 0 ? (
          <div className="role-chips">
            {ordered.map((r) => (
              <span key={r} className="role-chip is-preview">
                {m.roles.inShow[r]}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted">{t.pickOne}</p>
        )}
        <p className="demo-step">
          <span>3</span> {t.step3}
        </p>
        <ul className="role-mixer-adds">
          {ordered.flatMap((r) =>
            t.adds[r].map((item) => (
              <li key={item} className={`role-add role-add--${r.toLowerCase()}`}>
                {item}
              </li>
            )),
          )}
          {ordered.length > 1 && <li className="role-add role-add--all">{t.filtered}</li>}
        </ul>
      </div>
    </div>
  );
}
