import { useState } from 'react';

const WORKS = [
  { no: '01', title: 'Threshold (Antechamber)', artist: 'M. Kravets', medium: 'Plaster, pigment' },
  { no: '02', title: 'Load-Bearing', artist: 'O. Lysenko', medium: 'Steel, felt' },
  { no: '03', title: 'Soft Wall (i–iv)', artist: 'A. Berger', medium: 'Video, sound' },
  { no: '04', title: 'Interior, Facing North', artist: 'M. Kravets', medium: 'Graphite on paper' },
  { no: '05', title: 'Untitled (Scaffold)', artist: 'I. Petrenko', medium: 'Cast concrete' },
];

/** A works checklist you can tick off: the progress bar shows how close the catalogue is. */
export default function ChecklistDemo() {
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
          <p className="checklist-meta">Checklist · {WORKS.length} works</p>
        </div>
        <div className="checklist-progress" aria-live="polite">
          <span>
            {done.size} of {WORKS.length} catalogued
          </span>
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
                  {w.artist} · {w.medium}
                </span>
              </span>
              <button type="button" className="checklist-status" aria-pressed={isDone} onClick={() => toggle(w.no)}>
                <span className="visually-hidden">{w.title}: </span>
                {isDone ? 'Catalogued' : 'Mark catalogued'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
