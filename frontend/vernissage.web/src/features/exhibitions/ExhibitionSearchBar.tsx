import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ExhibitionFilters } from '../../types/exhibition';
import { useMessages } from '../../i18n/useI18n';

interface Props {
  onSearch: (filters: ExhibitionFilters) => void;
}

/** Server-side search/filter controls for the "My exhibitions" list. */
export default function ExhibitionSearchBar({ onSearch }: Props) {
  const t = useMessages().ex.search;
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [focus, setFocus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const buildFilters = (): ExhibitionFilters => ({
    q: q.trim() || undefined,
    location: location.trim() || undefined,
    focus: focus.trim() || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(buildFilters());
  };

  const handleReset = () => {
    setQ('');
    setLocation('');
    setFocus('');
    setFrom('');
    setTo('');
    onSearch({});
  };

  return (
    <form className="search-bar card" onSubmit={handleSubmit} role="search">
      <div className="field-grid">
        <label className="field">
          <span className="field-label">{t.search}</span>
          <input
            type="search"
            className="search-input"
            placeholder={t.searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">{t.location}</span>
          <input
            type="text"
            placeholder={t.locationPlaceholder}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">{t.focus}</span>
          <input
            type="text"
            placeholder={t.focusPlaceholder}
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">{t.from}</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">{t.to}</span>
          <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <div className="search-bar-actions">
        <button type="submit" className="btn btn-primary btn-sm">
          {t.submit}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
          {t.reset}
        </button>
      </div>
    </form>
  );
}
