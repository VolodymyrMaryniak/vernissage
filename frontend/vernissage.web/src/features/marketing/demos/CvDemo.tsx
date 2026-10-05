import { useState } from 'react';
import CvPreview from '../../cv/CvPreview';
import type { CvEntry, CvModel } from '../../cv/model';
import { CV_TEMPLATES } from '../../../types/cv';
import type { CvTemplate } from '../../../types/cv';
import { useMessages } from '../../../i18n/useI18n';
import { fmt } from '../../../i18n/format';
import type { Messages } from '../../../i18n/en';

interface DemoShow {
  id: string;
  kind: 'solo' | 'group';
  entry: CvEntry;
}

// Show titles and venues are proper names, so they stay as written.
function shows(m: Messages): DemoShow[] {
  return [
    { id: 'a', kind: 'solo', entry: { year: '2026', title: 'Afterimage', detail: 'Voloshyn Gallery, Kyiv', italicTitle: true } },
    {
      id: 'b',
      kind: 'group',
      entry: {
        year: '2025',
        title: 'Northern Light',
        detail: `Kunsthalle Wien, Vienna. ${fmt(m.cv.doc.curatedBy, { name: 'Anna Berger' })}`,
        italicTitle: true,
      },
    },
    { id: 'c', kind: 'group', entry: { year: '2024', title: 'Тиха вода', detail: 'Мистецький арсенал, Київ', italicTitle: true } },
    { id: 'd', kind: 'solo', entry: { year: '2023', title: 'Small Hours', detail: 'Lviv Municipal Art Center', italicTitle: true } },
  ];
}

/** A working miniature of the CV builder: tick shows, switch layouts, watch the CV change. */
export default function CvDemo() {
  const m = useMessages();
  const t = m.artists.cvDemo;
  const [chosen, setChosen] = useState<Set<string>>(new Set(['a', 'b']));
  const [template, setTemplate] = useState<CvTemplate>('classic');

  const toggle = (id: string) =>
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const all = shows(m);
  const picked = all.filter((s) => chosen.has(s.id));
  const group = (kind: DemoShow['kind']) => picked.filter((s) => s.kind === kind).map((s) => s.entry);
  const model: CvModel = {
    template,
    font: template === 'modern' ? 'helvetica' : template === 'minimal' ? 'times' : 'garamond',
    pageSize: 'A4',
    name: t.name,
    headline: t.headline,
    contact: ['you@studio.com', t.city],
    sections: [
      { title: m.cv.doc.kind.solo, entries: group('solo') },
      { title: m.cv.doc.kind.group, entries: group('group') },
      {
        title: t.education,
        entries: [{ year: '2016–2018', title: t.educationLine, detail: null, italicTitle: false }],
      },
    ].filter((s) => s.entries.length > 0),
  };

  return (
    <div className="cv-demo">
      <div className="cv-demo-controls">
        <p className="demo-step">
          <span>1</span> {t.step1}
        </p>
        <ul className="cv-demo-shows">
          {all.map((s) => (
            <li key={s.id}>
              <label className={chosen.has(s.id) ? 'is-on' : undefined}>
                <input type="checkbox" checked={chosen.has(s.id)} onChange={() => toggle(s.id)} />
                <span className="cv-demo-show-title">{s.entry.title}</span>
                <span className="cv-demo-show-meta">
                  {s.entry.year} · {s.kind === 'solo' ? t.solo : t.group}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="demo-step">
          <span>2</span> {t.step2}
        </p>
        <div className="demo-segmented" role="group" aria-label={t.layout}>
          {CV_TEMPLATES.map((key) => (
            <button key={key} type="button" aria-pressed={template === key} onClick={() => setTemplate(key)}>
              {m.cv.design.templates[key].label}
            </button>
          ))}
        </div>
        <p className="demo-step">
          <span>3</span> {t.step3}
        </p>
      </div>
      <div className="cv-demo-sheet">
        <CvPreview model={model} photoUrl={null} />
      </div>
    </div>
  );
}
