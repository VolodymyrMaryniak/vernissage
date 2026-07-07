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
    <section className="media-manager">
      <h3>Media & documents</h3>

      <form className="media-upload" onSubmit={handleUpload}>
        <select
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
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          type="text"
          placeholder="Caption / angle (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={busy || !file}>
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {media.length === 0 ? (
        <p className="muted">No media uploaded yet.</p>
      ) : (
        <ul className="media-list">
          {media.map((m) => (
            <li key={m.id}>
              <span className="media-cat">{MEDIA_CATEGORY_LABELS[m.category]}</span>
              <a href={mediaDownloadUrl(exhibitionId, m.id)} target="_blank" rel="noreferrer">
                {m.fileName}
              </a>
              {m.caption && <span className="muted"> — {m.caption}</span>}
              <span className="muted"> ({formatSize(m.fileSize)})</span>
              <button
                type="button"
                className="link-danger"
                onClick={() => handleDelete(m.id)}
                disabled={busy}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
