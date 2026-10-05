import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ExhibitionFilters, ExhibitionSummary } from '../../types/exhibition';
import { deleteExhibition, listExhibitions } from '../../api/exhibitionsApi';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { useAuth } from '../auth/useAuth';
import ExhibitionList from './ExhibitionList';
import ExhibitionSearchBar from './ExhibitionSearchBar';
import { useMessages } from '../../i18n/useI18n';
import Rich from '../../i18n/Rich';
import { fmt, plural } from '../../i18n/format';
import type { CreatorRole } from '../../types/auth';

const PAGE_SIZE = 20;

export default function ExhibitionsListPage() {
  const { user } = useAuth();
  const m = useMessages();
  const t = m.ex.list;
  useDocumentMeta({ title: t.metaTitle });

  const [summaries, setSummaries] = useState<ExhibitionSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExhibitionFilters>({});
  // Private workspace list: always the caller's own shows (no public browsing).
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<CreatorRole | null>(null);
  const accountRoles = user?.roles ?? [];
  const hasFilters = Object.values(filters).some(Boolean);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listExhibitions({ ...filters, mine: true, role: role ?? undefined, page, pageSize: PAGE_SIZE });
      setSummaries(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [filters, page, role, t.loadFailed]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  // A new search always starts from the first page of its results.
  const handleSearch = (next: ExhibitionFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await deleteExhibition(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.deleteFailed);
    }
  };

  return (
    <div className="container">
      <header className="archive-head">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="headline">
          <Rich text={t.title} />
        </h1>
        <p className="lede">{t.lede}</p>
        <div>
          <Link className="cta" to="/exhibitions/new">
            {m.nav.documentAShow}
          </Link>
        </div>
      </header>

      {accountRoles.length > 1 && (
        <div className="role-filter" role="group" aria-label={t.filterByRole}>
          <button type="button" aria-pressed={role === null} onClick={() => { setRole(null); setPage(1); }}>
            {t.all}
          </button>
          {accountRoles.map((r) => (
            <button key={r} type="button" aria-pressed={role === r} onClick={() => { setRole(r); setPage(1); }}>
              {m.roles.badge[r]}
            </button>
          ))}
        </div>
      )}

      <ExhibitionSearchBar onSearch={handleSearch} />

      <ExhibitionList
        exhibitions={summaries}
        loading={loading}
        error={error}
        filtered={hasFilters}
        currentUserId={user?.id ?? null}
        indexOffset={(page - 1) * PAGE_SIZE}
        onDelete={handleDelete}
      />

      {!loading && !error && total > PAGE_SIZE && (
        <nav className="pager" aria-label={t.pagination}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t.previous}
          </button>
          <span className="pager-status mono-meta">
            {fmt(t.pageStatus, { page, pages: pageCount })} · {plural(total, t.entries)}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            {t.next}
          </button>
        </nav>
      )}
    </div>
  );
}
