import { useState, type FormEvent } from 'react';
import {
  MEDIA_CATEGORY_LABELS,
  MediaCategory,
  type ExhibitionMedia,
} from '../../types/exhibition';
import { deleteMedia, mediaDownloadUrl, uploadMedia } from '../../api/exhibitionsApi';

interface Props {
  exhibitionId: string;
  media: ExhibitionMedia[];
  onChanged: () => void;
}

const CATEGORY_OPTIONS = Object.values(MediaCategory).filter(
  (v): v is MediaCategory => typeof v === 'number',
);

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaManager({ exhibitionId, media, onChanged }: Props) {
  const [category, setCategory] = useState<MediaCategory>(MediaCategory.ArtworkImage);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Bumping this key remounts the file input to clear its selected file.
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await uploadMedia(exhibitionId, category, file, caption || null);
      setFile(null);
      setCaption('');
      setFileInputKey((k) => k + 1);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    setBusy(true);
    setError(null);
    try {
      await deleteMedia(exhibitionId, mediaId);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="media-manager">
      <h3 className="view-section-title">
        Media &amp; documents
        {media.length > 0 && <span className="count-badge">{media.length}</span>}
      </h3>

      <form className="media-upload" onSubmit={handleUpload}>
        <select
          className="media-field"
          value={category}
          onChange={(e) => setCategory(Number(e.target.value) as MediaCategory)}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {MEDIA_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <input
          key={fileInputKey}
          type="file"
          className="media-field media-file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          type="text"
          className="media-field"
          placeholder="Caption / angle (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !file}>
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {error && <p className="banner banner-error">{error}</p>}

      {media.length === 0 ? (
        <p className="muted media-empty">No media uploaded yet.</p>
      ) : (
        <ul className="media-list">
          {media.map((m) => (
            <li key={m.id} className="media-item">
              <span className="media-cat">{MEDIA_CATEGORY_LABELS[m.category]}</span>
              <div className="media-body">
                <a
                  className="media-name"
                  href={mediaDownloadUrl(exhibitionId, m.id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {m.fileName}
                </a>
                <span className="media-sub">
                  {m.caption && <span>{m.caption} · </span>}
                  {formatSize(m.fileSize)}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-danger-ghost btn-sm"
                onClick={() => handleDelete(m.id)}
                disabled={busy}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
