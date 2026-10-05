import { useState } from 'react';
import CvPreview from '../../cv/CvPreview';
import type { CvEntry, CvModel } from '../../cv/model';
import { TEMPLATE_LABELS } from '../../cv/theme';
import { CV_TEMPLATES } from '../../../types/cv';
import type { CvTemplate } from '../../../types/cv';

interface DemoShow {
  id: string;
  kind: 'Solo exhibitions' | 'Group exhibitions';
  entry: CvEntry;
}

const SHOWS: DemoShow[] = [
  { id: 'a', kind: 'Solo exhibitions', entry: { year: '2026', title: 'Afterimage', detail: 'Voloshyn Gallery, Kyiv', italicTitle: true } },
  { id: 'b', kind: 'Group exhibitions', entry: { year: '2025', title: 'Northern Light', detail: 'Kunsthalle Wien, Vienna. Curated by Anna Berger', italicTitle: true } },
  { id: 'c', kind: 'Group exhibitions', entry: { year: '2024', title: 'Тиха вода', detail: 'Мистецький арсенал, Київ', italicTitle: true } },
  { id: 'd', kind: 'Solo exhibitions', entry: { year: '2023', title: 'Small Hours', detail: 'Lviv Municipal Art Center', italicTitle: true } },
];

/** A working miniature of the CV builder: tick shows, switch layouts, watch the CV change. */
export default function CvDemo() {
  const [chosen, setChosen] = useState<Set<string>>(new Set(['a', 'b']));
  const [template, setTemplate] = useState<CvTemplate>('classic');

  const toggle = (id: string) =>
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const picked = SHOWS.filter((s) => chosen.has(s.id));
  const group = (kind: DemoShow['kind']) => picked.filter((s) => s.kind === kind).map((s) => s.entry);
  const model: CvModel = {
    template,
    font: template === 'modern' ? 'helvetica' : template === 'minimal' ? 'times' : 'garamond',
    pageSize: 'A4',
    name: 'Your Name',
    headline: 'Artist · Painting & installation · Kyiv',
    contact: ['you@studio.com', 'Kyiv, Ukraine'],
    sections: [
      { title: 'Solo exhibitions', entries: group('Solo exhibitions') },
      { title: 'Group exhibitions', entries: group('Group exhibitions') },
      {
        title: 'Education',
        entries: [{ year: '2016–2018', title: 'MA Fine Art, National Academy of Fine Arts, Kyiv', detail: null, italicTitle: false }],
      },
    ].filter((s) => s.entries.length > 0),
  };

  return (
    <div className="cv-demo">
      <div className="cv-demo-controls">
        <p className="demo-step">
          <span>1</span> Tick the shows you&apos;ve documented
        </p>
        <ul className="cv-demo-shows">
          {SHOWS.map((s) => (
            <li key={s.id}>
              <label className={chosen.has(s.id) ? 'is-on' : undefined}>
                <input type="checkbox" checked={chosen.has(s.id)} onChange={() => toggle(s.id)} />
                <span className="cv-demo-show-title">{s.entry.title}</span>
                <span className="cv-demo-show-meta">
                  {s.entry.year} · {s.kind === 'Solo exhibitions' ? 'Solo' : 'Group'}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="demo-step">
          <span>2</span> Pick a design
        </p>
        <div className="demo-segmented" role="group" aria-label="CV layout">
          {CV_TEMPLATES.map((t) => (
            <button key={t} type="button" aria-pressed={template === t} onClick={() => setTemplate(t)}>
              {TEMPLATE_LABELS[t].label}
            </button>
          ))}
        </div>
        <p className="demo-step">
          <span>3</span> Download it as PDF or Word
        </p>
      </div>
      <div className="cv-demo-sheet">
        <CvPreview model={model} photoUrl={null} />
      </div>
    </div>
  );
}
