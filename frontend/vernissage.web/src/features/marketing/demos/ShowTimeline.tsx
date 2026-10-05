import { useState } from 'react';

interface Stage {
  key: string;
  label: string;
  when: string;
  line: string;
  keeps: string[];
}

// Each stage lists the fields and file types the exhibition record really has.
const STAGES: Stage[] = [
  {
    key: 'concept',
    label: 'Concept',
    when: '6 months out',
    line: 'Write down why the show exists before anyone asks.',
    keeps: ['Aim', 'Explication', 'Focus / topic'],
  },
  {
    key: 'research',
    label: 'Research',
    when: '4 months out',
    line: 'Sources, readings and references, kept next to the idea they feed.',
    keeps: ['Investigation material', 'Referenced literature', 'Notes'],
  },
  {
    key: 'checklist',
    label: 'Checklist',
    when: '8 weeks out',
    line: 'Works, artists and the people making it happen, in one list.',
    keeps: ['Artworks list', 'Team', 'Artwork images'],
  },
  {
    key: 'install',
    label: 'Install',
    when: 'Install week',
    line: 'Plans and views, so the next venue can rebuild the room.',
    keeps: ['Exposition design plan', 'Lighting plan', 'Location plan', 'Expo design photos'],
  },
  {
    key: 'opening',
    label: 'Opening',
    when: 'Opening night',
    line: 'The night itself, and everything that happens around it.',
    keeps: ['Pre-opening details', 'Opening details', 'Events', 'Event photos', 'Audio'],
  },
  {
    key: 'after',
    label: 'After',
    when: 'Forever',
    line: 'The record stays yours: what worked, who came, what it cost.',
    keeps: ['Private metrics', 'VR excursion', 'Your CV'],
  },
];

/** The life of a show, stage by stage: click a stage to see what Vernissage keeps for it. */
export default function ShowTimeline() {
  const [active, setActive] = useState(2);
  const stage = STAGES[active];

  return (
    <div className="show-timeline">
      <div className="show-timeline-track" role="tablist" aria-label="Stages of a show">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            id={`stage-${s.key}`}
            aria-selected={i === active}
            aria-controls="stage-panel"
            className={i < active ? 'is-done' : undefined}
            onClick={() => setActive(i)}
          >
            <span className="show-timeline-dot" aria-hidden="true" />
            <span className="show-timeline-label">{s.label}</span>
            <span className="show-timeline-when">{s.when}</span>
          </button>
        ))}
      </div>
      <div className="show-timeline-panel" role="tabpanel" id="stage-panel" aria-labelledby={`stage-${stage.key}`}>
        <p className="show-timeline-line">{stage.line}</p>
        <ul className="show-timeline-keeps">
          {stage.keeps.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
