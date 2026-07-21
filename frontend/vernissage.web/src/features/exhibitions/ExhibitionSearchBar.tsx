import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ExhibitionFilters } from '../../types/exhibition';

interface Props {
  onSearch: (filters: ExhibitionFilters) => void;
  /** Shows the "only my exhibitions" toggle; pass true only when signed in. */
  showMine?: boolean;
}

/** Server-side search/filter controls for the public exhibitions list. */
export default function ExhibitionSearchBar({ onSearch, showMine = false }: Props) {
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [focus, setFocus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [mine, setMine] = useState(false);

  const buildFilters = (): ExhibitionFilters => ({
    q: q.trim() || undefined,
    location: location.trim() || undefined,
    focus: focus.trim() || undefined,
    from: from || undefined,
    to: to || undefined,
    mine: mine || undefined,
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
    setMine(false);
    onSearch({});
  };

  // The toggle applies straight away rather than waiting for "Search" — it
  // reads as a view switch, not another field to fill in.
  const handleMineChange = (checked: boolean) => {
    setMine(checked);
    onSearch({ ...buildFilters(), mine: checked || undefined });
  };

  return (
    <form className="search-bar card" onSubmit={handleSubmit} role="search">
      <div className="field-grid">
        <label className="field">
          <span className="field-label">Search</span>
          <input
            type="search"
            className="search-input"
            placeholder="Name or curator…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Location</span>
          <input
            type="text"
            placeholder="City, country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Focus / topic</span>
          <input
            type="text"
            placeholder="e.g. Light art"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">To</span>
          <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <div className="search-bar-actions">
        {showMine && (
          <label className="search-toggle">
            <input
              type="checkbox"
              checked={mine}
              onChange={(e) => handleMineChange(e.target.checked)}
            />
            <span>Only my exhibitions</span>
          </label>
        )}
        <button type="submit" className="btn btn-primary btn-sm">
          Search
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
