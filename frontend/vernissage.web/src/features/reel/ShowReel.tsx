import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReelData, Scene } from './scenes';
import { MAX_WORKS, buildScenes, sceneAt, sceneStart, totalDuration } from './scenes';
import { useMessages } from '../../i18n/useI18n';
import { fmt, formatNumber, plural } from '../../i18n/format';
import type { Messages } from '../../i18n/en';

interface Props {
  data: ReelData;
  /** Start playing once the reel is mostly on screen (never with reduced motion). */
  autoPlay?: boolean;
  /** Line under the title on the closing card. */
  endLine?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function timecode(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function number(value: number, fractionDigits = 0): string {
  return formatNumber(value, undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * A show reel: a short film generated from an exhibition's inventory, played in
 * the browser like a video (play/pause, scene scrubber, timecode). No video file
 * is rendered; each scene is drawn from the data and animated by time.
 */
export default function ShowReel({ data, autoPlay = false, endLine }: Props) {
  const m = useMessages();
  const t = m.reel;
  const scenes = useMemo(() => buildScenes(data), [data]);
  const duration = useMemo(() => totalDuration(scenes), [scenes]);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);

  const { index, progress } = sceneAt(scenes, time);
  const scene = scenes[index];
  const finished = time >= duration;

  const seek = useCallback((t: number) => {
    timeRef.current = t;
    setTime(t);
  }, []);

  const play = useCallback(() => {
    if (timeRef.current >= duration) seek(0);
    setStarted(true);
    setPlaying(true);
  }, [duration, seek]);

  // The clock: advance by real elapsed time while playing.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const next = Math.min(duration, timeRef.current + (now - last) / 1000);
      last = now;
      timeRef.current = next;
      setTime(next);
      if (next >= duration) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration]);

  // Auto-play in view; pause when scrolled away.
  useEffect(() => {
    const el = rootRef.current;
    if (!autoPlay || !el || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;
    let autoStarted = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoStarted) {
          autoStarted = true;
          play();
        } else if (!entry.isIntersecting) {
          setPlaying(false);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay, play]);

  const toggle = () => (playing ? setPlaying(false) : play());

  return (
    <div
      className={`reel${playing ? ' is-playing' : ''}`}
      ref={rootRef}
      role="region"
      aria-roledescription="show reel"
      aria-label={fmt(t.region, { title: data.title })}
    >
      <div className="reel-screen" onClick={toggle}>
        <div className="reel-scene" key={index} data-kind={scene.kind}>
          <SceneView scene={scene} data={data} progress={progress} endLine={endLine} t={t} />
        </div>
        <span className="reel-rec chip-mono" aria-hidden="true">
          {t.badge}
        </span>
        {(!started || finished) && !playing && (
          <span className="reel-bigplay" aria-hidden="true">
            {finished ? '↺' : '▶'}
          </span>
        )}
      </div>

      <div className="reel-controls">
        <button
          type="button"
          className="reel-play"
          onClick={toggle}
          aria-label={playing ? t.pause : finished ? t.replay : t.play}
        >
          {playing ? '❚❚' : finished ? '↺' : '▶'}
        </button>
        <div className="reel-scrubber" role="group" aria-label={t.scenes}>
          {scenes.map((s, i) => {
            const fill = i < index ? 1 : i === index ? progress : 0;
            return (
              <button
                type="button"
                key={i}
                className="reel-seg"
                style={{ flexGrow: s.duration }}
                aria-label={fmt(t.scene, { n: i + 1, label: t.sceneLabel[s.kind] })}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => {
                  // Like a video player: jumping to a scene plays from there.
                  seek(sceneStart(scenes, i));
                  setStarted(true);
                  setPlaying(true);
                }}
              >
                <span style={{ transform: `scaleX(${fill})` }} />
              </button>
            );
          })}
        </div>
        <span className="reel-time" aria-hidden="true">
          {timecode(time)} / {timecode(duration)}
        </span>
      </div>
    </div>
  );
}

function SceneView({
  scene,
  data,
  progress,
  endLine,
  t,
}: {
  scene: Scene;
  data: ReelData;
  progress: number;
  endLine?: string;
  t: Messages['reel'];
}) {
  switch (scene.kind) {
    case 'title':
      return (
        <div className="reel-title">
          <p className="reel-kicker">{t.presents}</p>
          <h3>{data.title}</h3>
          {(data.byline || data.dates || data.venue) && (
            <p className="reel-sub">
              {[data.byline, data.venue, data.dates].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      );

    case 'photo':
      return (
        <figure className="reel-photo">
          <img
            src={scene.photo.src}
            alt={scene.photo.caption ?? ''}
            // Slow drift tied to the reel clock, so pause and seek freeze it.
            style={{
              transform: `scale(${1.04 + 0.08 * progress}) translate(${(scene.index % 2 ? -1 : 1) * 1.5 * progress}%, ${-1 * progress}%)`,
            }}
          />
          <figcaption className="reel-lower">
            <span className="reel-kicker">
              {String(scene.index + 1).padStart(2, '0')}
              {scene.photo.tag ? ` · ${scene.photo.tag}` : ''}
            </span>
            {scene.photo.caption && <span className="reel-caption">{scene.photo.caption}</span>}
          </figcaption>
        </figure>
      );

    case 'works': {
      const shown = data.works.slice(0, MAX_WORKS);
      const more = data.works.length - shown.length;
      return (
        <div className="reel-works">
          <p className="reel-kicker">{fmt(t.works, { n: data.works.length })}</p>
          <ol>
            {shown.map((w, i) => (
              <li key={i} style={{ animationDelay: `${0.15 + i * 0.22}s` }}>
                <span className="reel-work-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="reel-work-title">{w.title}</span>
                {w.sold && <span className="reel-sold" aria-label={t.sold} />}
              </li>
            ))}
          </ol>
          {more > 0 && <p className="reel-more">{plural(more, t.more)}</p>}
        </div>
      );
    }

    case 'numbers': {
      const s = data.stats ?? {};
      const k = easeOut(progress / 0.55);
      const tiles = [
        typeof s.visitors === 'number' && { label: t.visitors, value: number(s.visitors * k) },
        typeof s.sold === 'number' && {
          label: t.worksSold,
          value: number(s.sold * k),
          extra: data.works.length >= s.sold ? fmt(t.ofTotal, { n: data.works.length }) : undefined,
        },
        typeof s.revenue === 'number' && { label: t.revenue, value: number(s.revenue * k) },
        typeof s.satisfaction === 'number' && {
          label: t.satisfaction,
          value: number(s.satisfaction * k, 1),
          extra: '/ 10',
        },
      ].filter(Boolean) as { label: string; value: string; extra?: string }[];
      return (
        <div className="reel-numbers">
          <p className="reel-kicker">{t.numbers}</p>
          <dl>
            {tiles.map((t) => (
              <div key={t.label}>
                <dt>{t.label}</dt>
                <dd>
                  {t.value}
                  {t.extra && <small> {t.extra}</small>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );
    }

    case 'costs': {
      const costs = [...(data.stats?.costs ?? [])].sort((a, b) => b.amount - a.amount).slice(0, 5);
      const max = Math.max(...costs.map((c) => c.amount), 1);
      const total = (data.stats?.costs ?? []).reduce((sum, c) => sum + c.amount, 0);
      const revenue = data.stats?.revenue;
      return (
        <div className="reel-costs">
          <p className="reel-kicker">{fmt(t.costs, { total: number(total) })}</p>
          <ul>
            {costs.map((c, i) => (
              <li key={c.label + i}>
                <span className="reel-cost-label">{c.label}</span>
                <span className="reel-bar">
                  <span
                    style={{
                      transform: `scaleX(${(c.amount / max) * easeOut((progress - i * 0.06) / 0.5)})`,
                    }}
                  />
                </span>
                <span className="reel-cost-amount">{number(c.amount)}</span>
              </li>
            ))}
          </ul>
          {typeof revenue === 'number' && (
            <p className="reel-margin">
              {t.margin} <strong>{number(revenue - total)}</strong>
            </p>
          )}
        </div>
      );
    }

    case 'end':
      return (
        <div className="reel-end">
          <span className="reel-dot" aria-hidden="true" />
          <h3>{data.title}</h3>
          <p className="reel-sub">{endLine ?? t.endLine}</p>
        </div>
      );
  }
}
