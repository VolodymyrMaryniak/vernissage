import { Fragment, useMemo, useState, type FormEvent } from 'react';
import type { ExhibitionDetail, ExhibitionWrite } from '../../types/exhibition';
import { CREATOR_ROLES } from '../../types/auth';
import type { CreatorRole } from '../../types/auth';
import { fieldSections } from './fields';
import { useMessages } from '../../i18n/useI18n';
import { fmt } from '../../i18n/format';
import DraftPanel from '../assistant/DraftPanel';
import TextAssist from '../assistant/TextAssist';

interface Props {
  initial?: ExhibitionDetail;
  submitting: boolean;
  error: string | null;
  // When true (default) the action bar is pinned to the bottom of the viewport.
  // The edit page disables it so trailing content (media manager) can follow.
  actionsSticky?: boolean;
  onSubmit: (payload: ExhibitionWrite) => void;
  onCancel: () => void;
  /** The signed-in account's roles; drives the "your role in this show" choices. */
  accountRoles?: CreatorRole[];
  /** Show the AI assistant (drafting + polish/shorten); the server must have it configured. */
  assistantEnabled?: boolean;
}

function emptyForm(
  initial: ExhibitionDetail | undefined,
  accountRoles: CreatorRole[],
): ExhibitionWrite {
  return {
    // A new show for a single-role account is that role; with several, you pick.
    roles: initial?.roles ?? (accountRoles.length === 1 ? [...accountRoles] : []),
    name: initial?.name ?? '',
    startDate: initial?.startDate ?? null,
    endDate: initial?.endDate ?? null,
    location: initial?.location ?? null,
    focus: initial?.focus ?? null,
    curator: initial?.curator ?? null,
    galleryLocation: initial?.galleryLocation ?? null,
    explication: initial?.explication ?? null,
    investigationMaterial: initial?.investigationMaterial ?? null,
    team: initial?.team ?? null,
    artworksList: initial?.artworksList ?? null,
    preOpeningDetails: initial?.preOpeningDetails ?? null,
    openingDetails: initial?.openingDetails ?? null,
    eventsDetails: initial?.eventsDetails ?? null,
    notes: initial?.notes ?? null,
    referencedLiterature: initial?.referencedLiterature ?? null,
    aim: initial?.aim ?? null,
  };
}

// Count how many optional fields have been filled in, so the user gets a sense
// of how complete the record is.
function completeness(form: ExhibitionWrite): { filled: number; total: number } {
  const keys = Object.keys(form) as (keyof ExhibitionWrite)[];
  const optional = keys.filter((k) => k !== 'name' && k !== 'roles');
  const filled = optional.filter((k) => {
    const v = form[k];
    return v !== null && v !== '';
  }).length;
  return { filled, total: optional.length };
}

export default function ExhibitionForm({
  initial,
  submitting,
  error,
  actionsSticky = true,
  onSubmit,
  onCancel,
  accountRoles = [],
  assistantEnabled = false,
}: Props) {
  const [form, setForm] = useState<ExhibitionWrite>(() => emptyForm(initial, accountRoles));
  const m = useMessages();
  const t = m.ex.form;
  const label = m.ex.fields.label;
  const ph = m.ex.fields.placeholder;
  // Offer the account's roles, plus any already on the record; everything if unknown.
  const roleChoices = CREATOR_ROLES.filter(
    (r) => accountRoles.length === 0 || accountRoles.includes(r) || (form.roles ?? []).includes(r),
  );

  const toggleRole = (role: CreatorRole) =>
    setForm((prev) => {
      const current = prev.roles ?? [];
      return {
        ...prev,
        roles: current.includes(role) ? current.filter((r) => r !== role) : [...current, role],
      };
    });

  const update = (key: keyof ExhibitionWrite, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value === '' ? null : value }));
  };

  const applyDraft = (values: Partial<ExhibitionWrite>) =>
    setForm((prev) => ({ ...prev, ...values }));

  const { filled, total } = useMemo(() => completeness(form), [form]);
  const nameEmpty = form.name.trim() === '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nameEmpty) return;
    onSubmit({ ...form, name: form.name.trim() });
  };

  return (
    <form className="ex-form" onSubmit={handleSubmit}>
      <header className="page-head">
        <div>
          <p className="eyebrow">{initial ? t.editing : t.newRecord}</p>
          <h2>{initial ? initial.name || t.editTitle : t.createTitle}</h2>
          <p className="page-sub">
            {fmt(t.completeness, { filled, total })}
          </p>
        </div>
      </header>

      {assistantEnabled && (
        <DraftPanel current={form} onApply={applyDraft} defaultOpen={!initial} />
      )}

      {/* Basics --------------------------------------------------------- */}
      <section className="card form-section">
        <div className="section-head">
          <h3>{t.basics}</h3>
          <p>{t.basicsDescription}</p>
        </div>

        <fieldset className="role-in-show">
          <legend className="field-label">{t.yourRole}</legend>
          <div className="role-chips">
            {roleChoices.map((role) => (
              <label
                key={role}
                className={`role-chip${(form.roles ?? []).includes(role) ? ' is-on' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={(form.roles ?? []).includes(role)}
                  onChange={() => toggleRole(role)}
                />
                {m.roles.inShow[role]}
              </label>
            ))}
          </div>
          {roleChoices.length > 1 && (
            <p className="field-hint">
              {t.roleHint}
            </p>
          )}
        </fieldset>

        <label className="field">
          <span className="field-label">
            {label.name} <span className="req">{t.required}</span>
          </span>
          <input
            type="text"
            required
            maxLength={300}
            placeholder={ph.name}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            // With the assistant panel above, focusing Name would scroll past it.
            autoFocus={!assistantEnabled}
          />
        </label>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">{label.startDate}</span>
            <input
              type="date"
              value={form.startDate ?? ''}
              onChange={(e) => update('startDate', e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">{label.endDate}</span>
            <input
              type="date"
              value={form.endDate ?? ''}
              min={form.startDate ?? undefined}
              onChange={(e) => update('endDate', e.target.value)}
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">{label.curator}</span>
            <input
              type="text"
              maxLength={500}
              placeholder={ph.curator}
              value={form.curator ?? ''}
              onChange={(e) => update('curator', e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">{label.location}</span>
            <input
              type="text"
              maxLength={500}
              placeholder={ph.location}
              value={form.location ?? ''}
              onChange={(e) => update('location', e.target.value)}
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span className="field-label">{label.galleryLocation}</span>
            <input
              type="text"
              maxLength={500}
              placeholder={ph.galleryLocation}
              value={form.galleryLocation ?? ''}
              onChange={(e) => update('galleryLocation', e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">{label.focus}</span>
            <input
              type="text"
              maxLength={200}
              placeholder={ph.focus}
              value={form.focus ?? ''}
              onChange={(e) => update('focus', e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Grouped long-form sections ------------------------------------ */}
      {fieldSections(m).map((section) => (
        <section className="card form-section" key={section.id}>
          <div className="section-head">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </div>

          {section.fields.map((f) => (
            <Fragment key={f.key}>
              <label className="field">
                <span className="field-label">{f.label}</span>
                {f.multiline ? (
                  <textarea
                    rows={4}
                    placeholder={f.placeholder}
                    value={(form[f.key] as string | null) ?? ''}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    maxLength={500}
                    placeholder={f.placeholder}
                    value={(form[f.key] as string | null) ?? ''}
                    onChange={(e) => update(f.key, e.target.value)}
                  />
                )}
              </label>
              {/* Outside the <label>, so clicking the label never presses these buttons. */}
              {assistantEnabled && f.multiline && (
                <TextAssist
                  field={f.key}
                  label={f.label}
                  text={(form[f.key] as string | null) ?? ''}
                  exhibitionName={form.name}
                  onAccept={(text) => update(f.key, text)}
                />
              )}
            </Fragment>
          ))}
        </section>
      ))}

      {error && <p className="banner banner-error">{error}</p>}

      <div className={actionsSticky ? 'form-actions' : 'form-actions form-actions--inline'}>
        <div className="form-actions-inner">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            {m.common.cancel}
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting || nameEmpty}>
            {submitting ? m.common.saving : initial ? t.saveChanges : t.create}
          </button>
        </div>
      </div>
    </form>
  );
}
