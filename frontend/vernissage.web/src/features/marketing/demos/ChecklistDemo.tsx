import { useState } from 'react';
import { useMessages } from '../../../i18n/useI18n';
import { fmt } from '../../../i18n/format';

const WORKS = [
  { no: '01', title: 'Threshold (Antechamber)', artist: 'M. Kravets', medium: 'plaster' },
  { no: '02', title: 'Load-Bearing', artist: 'O. Lysenko', medium: 'steel' },
  { no: '03', title: 'Soft Wall (i–iv)', artist: 'A. Berger', medium: 'video' },
  { no: '04', title: 'Interior, Facing North', artist: 'M. Kravets', medium: 'graphite' },
  { no: '05', title: 'Untitled (Scaffold)', artist: 'I. Petrenko', medium: 'concrete' },
] as const;

/** A works checklist you can tick off: the progress bar shows how close the catalogue is. */
export default function ChecklistDemo() {
  const t = useMessages().curators.checklist;
  const [done, setDone] = useState<Set<string>>(new Set(['01', '02', '04']));
  const toggle = (no: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(no)) next.delete(no);
      else next.add(no);
      return next;
    });
  const percent = Math.round((done.size / WORKS.length) * 100);

  return (
    <div className="plaque checklist-demo">
      <div className="checklist-head">
        <div>
          <p className="checklist-show">Soft Architectures</p>
          <p className="checklist-meta">{fmt(t.meta, { n: WORKS.length })}</p>
        </div>
        <div className="checklist-progress" aria-live="polite">
          <span>{fmt(t.progress, { done: done.size, total: WORKS.length })}</span>
          <span className="checklist-bar" aria-hidden="true">
            <span style={{ width: `${percent}%` }} />
          </span>
        </div>
      </div>
      <ul className="checklist-rows">
        {WORKS.map((w) => {
          const isDone = done.has(w.no);
          return (
            <li key={w.no} className={isDone ? 'is-done' : undefined}>
              <span className="checklist-no">{w.no}</span>
              <span className="checklist-work">
                <span className="checklist-title">{w.title}</span>
                <span className="checklist-sub">
                  {w.artist} · {t.mediums[w.medium]}
                </span>
              </span>
              <button type="button" className="checklist-status" aria-pressed={isDone} onClick={() => toggle(w.no)}>
                <span className="visually-hidden">{w.title}: </span>
                {isDone ? t.catalogued : t.mark}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
