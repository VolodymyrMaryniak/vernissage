import { useState } from 'react';
import type { ExhibitionWrite } from '../../types/exhibition';
import { draftExhibition } from '../../api/assistantApi';
import type { DraftField } from '../../api/assistantApi';
import { suggestionsFrom } from './suggestions';
import type { Suggestion } from './suggestions';
import { useMessages } from '../../i18n/useI18n';
import { plural } from '../../i18n/format';

interface Props {
  current: ExhibitionWrite;
  /** Fills the chosen suggestions into the form; nothing is saved until the user saves. */
  onApply: (values: Partial<ExhibitionWrite>) => void;
  defaultOpen?: boolean;
}

const MAX_PDF_BYTES = 10 * 1024 * 1024;

/**
 * "Draft with AI": paste notes, a press release or an email (or attach a PDF)
 * and the assistant proposes values for the record. Each suggestion is opt-in:
 * empty fields are ticked, fields you already filled are not, and nothing is
 * saved until you save the form.
 */
export default function DraftPanel({ current, onApply, defaultOpen = false }: Props) {
  const m = useMessages();
  const t = m.assistant;
  const [open, setOpen] = useState(defaultOpen);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  // Bumped to remount (and so clear) the file input.
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [chosen, setChosen] = useState<Set<DraftField>>(new Set());

  const reset = () => {
    setSuggestions(null);
    setSummary(null);
    setChosen(new Set());
  };

  const pickFile = (f: File | null) => {
    setError(null);
    if (f && !f.name.toLowerCase().endsWith('.pdf')) {
      setError(t.notPdf);
      return;
    }
    if (f && f.size > MAX_PDF_BYTES) {
      setError(t.pdfTooLarge);
      return;
    }
    setFile(f);
  };

  const draft = async () => {
    setError(null);
    setBusy(true);
    reset();
    try {
      const result = await draftExhibition({ notes, file });
      const found = suggestionsFrom(result, current, m);
      setSummary(result.summary || null);
      setSuggestions(found);
      setChosen(new Set(found.filter((s) => s.existing === null).map((s) => s.key)));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.draftFailed);
    } finally {
      setBusy(false);
    }
  };

  const toggle = (key: DraftField) =>
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const apply = () => {
    if (!suggestions) return;
    const values: Partial<ExhibitionWrite> = {};
    for (const s of suggestions) {
      if (chosen.has(s.key)) (values as Record<string, string>)[s.key] = s.value;
    }
    onApply(values);
    reset();
    setNotes('');
    setFile(null);
    setFileKey((k) => k + 1);
    setOpen(false);
  };

  const canDraft = (notes.trim() !== '' || file !== null) && !busy;

  return (
    <section
      className={`card form-section assist-panel${open ? ' is-open' : ''}`}
      aria-label={t.panel}
    >
      <div className="assist-head">
        <div className="section-head">
          <h3>
            <span className="assist-spark" aria-hidden="true">
              ✦
            </span>{' '}
            {t.panel}
          </h3>
          <p>{t.intro}</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? t.hide : t.open}
        </button>
      </div>

      {open && (
        // Not a nested <form>: this panel lives inside the exhibition form.
        <div className="assist-body">
          <label className="field">
            <span className="field-label">{t.material}</span>
            <textarea
              rows={6}
              maxLength={50000}
              placeholder={t.materialPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <div className="assist-actions">
            <label className="btn btn-ghost assist-file">
              <input
                key={fileKey}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
              {file ? `📎 ${file.name}` : t.attachPdf}
            </label>
            {file && (
              <button
                type="button"
                className="link-quiet"
                onClick={() => {
                  setFile(null);
                  setFileKey((k) => k + 1);
                }}
              >
                {m.common.remove}
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canDraft}
              onClick={() => void draft()}
            >
              {busy ? t.drafting : t.draft}
            </button>
          </div>
          <p className="field-hint">{t.privacy}</p>

          {error && <p className="banner banner-error">{error}</p>}

          {suggestions && (
            <div className="assist-results" aria-live="polite">
              {summary && <p className="assist-summary">{summary}</p>}
              {suggestions.length === 0 ? (
                <p className="muted">{t.nothingNew}</p>
              ) : (
                <>
                  <ul className="assist-suggestions">
                    {suggestions.map((s) => (
                      <li key={s.key} className={chosen.has(s.key) ? 'is-on' : undefined}>
                        <label>
                          <input
                            type="checkbox"
                            checked={chosen.has(s.key)}
                            onChange={() => toggle(s.key)}
                          />
                          <span className="assist-field">{s.label}</span>
                        </label>
                        <p className="assist-value">{s.value}</p>
                        {s.existing && (
                          <p className="assist-existing">
                            {t.replaces} <span>{s.existing}</span>
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="assist-actions">
                    <button type="button" className="btn btn-ghost" onClick={reset}>
                      {t.discard}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={chosen.size === 0}
                      onClick={apply}
                    >
                      {plural(chosen.size, t.fillIn)}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
