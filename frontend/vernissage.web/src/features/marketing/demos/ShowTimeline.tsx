import { useState } from 'react';
import { useMessages } from '../../../i18n/useI18n';
import type { Messages } from '../../../i18n/en';

type StageKey = keyof Messages['curators']['timeline']['stages'];

// Each stage lists the fields and file types the exhibition record really has.
const STAGES: StageKey[] = ['concept', 'research', 'checklist', 'install', 'opening', 'after'];

/** The life of a show, stage by stage: click a stage to see what Vernissage keeps for it. */
export default function ShowTimeline() {
  const t = useMessages().curators.timeline;
  const [active, setActive] = useState(2);
  const key = STAGES[active];
  const stage = t.stages[key];

  return (
    <div className="show-timeline">
      <div className="show-timeline-track" role="tablist" aria-label={t.label}>
        {STAGES.map((k, i) => (
          <button
            key={k}
            type="button"
            role="tab"
            id={`stage-${k}`}
            aria-selected={i === active}
            aria-controls="stage-panel"
            className={i < active ? 'is-done' : undefined}
            onClick={() => setActive(i)}
          >
            <span className="show-timeline-dot" aria-hidden="true" />
            <span className="show-timeline-label">{t.stages[k].label}</span>
            <span className="show-timeline-when">{t.stages[k].when}</span>
          </button>
        ))}
      </div>
      <div className="show-timeline-panel" role="tabpanel" id="stage-panel" aria-labelledby={`stage-${key}`}>
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
