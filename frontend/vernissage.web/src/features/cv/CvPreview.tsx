import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { CV_FONT_SPECS } from './fonts';
import type { CvEntry, CvModel } from './model';
import { CV_THEMES, PAGE_POINTS } from './theme';
import { useMessages } from '../../i18n/useI18n';

interface Props {
  model: CvModel;
  photoUrl: string | null;
}

// The sheet is laid out at true size (1pt = 4/3 CSS px) and scaled to fit, so
// what you see is proportioned exactly like the PDF.
const PX_PER_PT = 4 / 3;

function Entry({ entry }: { entry: CvEntry }) {
  return (
    <div className="cv-entry">
      <span className="cv-entry-year">{entry.year}</span>
      <span className="cv-entry-body">
        {entry.italicTitle ? <em>{entry.title}</em> : entry.title}
        {entry.detail && <span className="cv-entry-detail">, {entry.detail}</span>}
      </span>
    </div>
  );
}

function Sections({ model }: { model: CvModel }) {
  return (
    <>
      {model.sections.map((section) => (
        <section className="cv-section" key={section.title}>
          <h4 className="cv-section-title">
            <span>{section.title}</span>
          </h4>
          {section.entries.map((entry, i) =>
            section.prose ? (
              <p key={i} className="cv-prose">
                {entry.title}
              </p>
            ) : (
              <Entry key={i} entry={entry} />
            ),
          )}
        </section>
      ))}
    </>
  );
}

/** Live HTML rendering of the CV, styled like the generated PDF. */
export default function CvPreview({ model, photoUrl }: Props) {
  const emptyText = useMessages().cv.previewEmpty;
  const theme = CV_THEMES[model.template];
  const page = PAGE_POINTS[model.pageSize];
  const font = CV_FONT_SPECS[model.font];
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 0.5, height: 0 });

  // Scale the true-size sheet to the frame's width. A CSS transform doesn't
  // change layout size, so the frame reserves the scaled sheet's height itself.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const sheet = sheetRef.current;
    if (!frame || !sheet) return;
    const measure = () => {
      const scale = frame.clientWidth / (page.width * PX_PER_PT);
      setFit({ scale, height: sheet.offsetHeight * scale });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, [page.width]);

  const pt = (n: number) => `${n * PX_PER_PT}px`;
  const style = {
    '--cv-font': `'${font.family}', serif`,
    '--cv-accent': theme.accent,
    '--cv-muted': theme.muted,
    '--cv-sidebar': theme.sidebar ?? 'transparent',
    '--cv-name': pt(theme.nameSize),
    '--cv-headline': pt(theme.headlineSize),
    '--cv-body': pt(theme.bodySize),
    '--cv-title': pt(theme.titleSize),
    '--cv-year': pt(theme.yearWidth),
    '--cv-margin': pt(theme.margin),
    '--cv-photo': pt(theme.photoSize),
    '--cv-page-h': pt(page.height),
    width: pt(page.width),
    minHeight: pt(page.height),
    transform: `scale(${fit.scale})`,
  } as CSSProperties;

  const photo = photoUrl && (
    <img className={`cv-photo${theme.roundPhoto ? ' is-round' : ''}`} src={photoUrl} alt="" />
  );
  const header = (
    <>
      <h3 className="cv-name">{model.name}</h3>
      {model.headline && <p className="cv-headline">{model.headline}</p>}
    </>
  );

  return (
    <div className="cv-preview-frame" ref={frameRef} style={{ height: fit.height || undefined }}>
      <div
        className={`cv-sheet cv-sheet--${model.template}`}
        style={style}
        ref={sheetRef}
        role="document"
        aria-label="CV preview"
      >
        {model.template === 'modern' ? (
          <div className="cv-modern">
            <aside className="cv-sidebar">
              {photo}
              {header}
              {model.contact.length > 0 && (
                <ul className="cv-contact-list">
                  {model.contact.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </aside>
            <div className="cv-main">
              <Sections model={model} />
            </div>
          </div>
        ) : (
          <>
            <header className="cv-header">
              {photo}
              <div className="cv-header-text">
                {header}
                {model.contact.length > 0 && <p className="cv-contact">{model.contact.join('  ·  ')}</p>}
              </div>
            </header>
            <Sections model={model} />
          </>
        )}
        {model.sections.length === 0 && (
          <p className="cv-empty">{emptyText}</p>
        )}
      </div>
    </div>
  );
}
