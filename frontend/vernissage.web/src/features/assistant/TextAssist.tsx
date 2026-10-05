import { useState } from 'react';
import { improveText } from '../../api/assistantApi';
import type { ImproveMode } from '../../api/assistantApi';

interface Props {
  /** Field key, e.g. "explication", so the assistant knows what kind of text it is. */
  field: string;
  label: string;
  text: string;
  exhibitionName?: string;
  onAccept: (text: string) => void;
}

/** Below this many characters there's not much to polish. */
export const MIN_TEXT = 40;

/**
 * "Polish" / "Shorten" under a long-text field. The rewrite is only a
 * proposal: the field changes when the user picks "Use this".
 */
export default function TextAssist({ field, label, text, exhibitionName, onAccept }: Props) {
  const [busy, setBusy] = useState<ImproveMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<string | null>(null);

  if (text.trim().length < MIN_TEXT && !proposal) return null;

  const run = async (mode: ImproveMode) => {
    setBusy(mode);
    setError(null);
    setProposal(null);
    try {
      setProposal(
        await improveText({ field, text, mode, exhibitionName: exhibitionName || undefined }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The assistant could not rewrite this.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="text-assist">
      {!proposal && (
        <div className="text-assist-buttons">
          <span className="assist-spark" aria-hidden="true">
            ✦
          </span>
          <button
            type="button"
            className="link-quiet"
            disabled={busy !== null}
            onClick={() => void run('polish')}
            aria-label={`Polish ${label}`}
          >
            {busy === 'polish' ? 'Polishing…' : 'Polish'}
          </button>
          <button
            type="button"
            className="link-quiet"
            disabled={busy !== null}
            onClick={() => void run('shorten')}
            aria-label={`Shorten ${label}`}
          >
            {busy === 'shorten' ? 'Shortening…' : 'Shorten'}
          </button>
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
      {proposal && (
        <div className="text-assist-proposal" aria-live="polite">
          <p className="assist-field">Suggested</p>
          <p className="assist-value">{proposal}</p>
          <div className="assist-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setProposal(null)}>
              Keep mine
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onAccept(proposal);
                setProposal(null);
              }}
            >
              Use this
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
