import { useCallback, useEffect, useState } from 'react';
import type {
  ExhibitionDetail,
  ExhibitionSummary,
  ExhibitionWrite,
} from '../../types/exhibition';
import {
  createExhibition,
  deleteExhibition,
  getExhibition,
  listExhibitions,
  updateExhibition,
} from '../../api/exhibitionsApi';
import ExhibitionList from './ExhibitionList';
import ExhibitionForm from './ExhibitionForm';
import ExhibitionDetailView from './ExhibitionDetail';

type View =
  | { mode: 'list' }
  | { mode: 'create' }
  | { mode: 'detail'; id: string }
  | { mode: 'edit'; id: string };

export default function ExhibitionsPage() {
  const [view, setView] = useState<View>({ mode: 'list' });

  const [summaries, setSummaries] = useState<ExhibitionSummary[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [current, setCurrent] = useState<ExhibitionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const refreshList = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      setSummaries(await listExhibitions());
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to load exhibitions');
    } finally {
      setListLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      setCurrent(await getExhibition(id));
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'Failed to load exhibition');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view.mode === 'list') {
      // Fetch-on-view-change: the loading toggle inside refreshList runs
      // synchronously, which the rule flags. It's the intended pattern here
      // (no data-fetching library), so allow it.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void refreshList();
    }
  }, [view, refreshList]);

  useEffect(() => {
    if (view.mode === 'detail' || view.mode === 'edit') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadDetail(view.id);
    }
  }, [view, loadDetail]);

  const handleCreate = async (payload: ExhibitionWrite) => {
    setSubmitting(true);
    setFormError(null);
    try {
      const created = await createExhibition(payload);
      setView({ mode: 'detail', id: created.id });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create exhibition');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, payload: ExhibitionWrite) => {
    setSubmitting(true);
    setFormError(null);
    try {
      await updateExhibition(id, payload);
      setView({ mode: 'detail', id });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update exhibition');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this exhibition and all its media?')) return;
    try {
      await deleteExhibition(id);
      await refreshList();
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to delete exhibition');
    }
  };

  if (view.mode === 'create') {
    return (
      <ExhibitionForm
        submitting={submitting}
        error={formError}
        onSubmit={handleCreate}
        onCancel={() => setView({ mode: 'list' })}
      />
    );
  }

  if (view.mode === 'edit') {
    if (detailLoading || !current) {
      return <p className="muted">{detailError ?? 'Loading…'}</p>;
    }
    return (
      <ExhibitionForm
        initial={current}
        submitting={submitting}
        error={formError}
        onSubmit={(payload) => handleUpdate(view.id, payload)}
        onCancel={() => setView({ mode: 'detail', id: view.id })}
      />
    );
  }

  if (view.mode === 'detail') {
    if (detailLoading || !current) {
      return <p className="muted">{detailError ?? 'Loading…'}</p>;
    }
    return (
      <ExhibitionDetailView
        exhibition={current}
        onBack={() => setView({ mode: 'list' })}
        onEdit={() => setView({ mode: 'edit', id: current.id })}
        onMediaChanged={() => loadDetail(current.id)}
      />
    );
  }

  return (
    <ExhibitionList
      exhibitions={summaries}
      loading={listLoading}
      error={listError}
      onSelect={(id) => setView({ mode: 'detail', id })}
      onCreate={() => {
        setFormError(null);
        setView({ mode: 'create' });
      }}
      onDelete={handleDelete}
    />
  );
}
