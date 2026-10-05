import { useEffect, useState } from 'react';
import type { MarketingPhoto } from './photos';
import { licenseUrl } from './photos';

interface Props {
  photos: MarketingPhoto[];
  /** Milliseconds per slide. */
  interval?: number;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * A crossfading slideshow of exhibition and opening-night photographs, with a
 * slow drift on each frame. Pauses on hover/focus and on request; never
 * auto-advances for people who prefer reduced motion. Each slide carries its
 * Creative Commons credit.
 */
export default function PhotoSlideshow({ photos, interval = 5500 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [hovered, setHovered] = useState(false);
  const running = !paused && !hovered && photos.length > 1;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % photos.length), interval);
    return () => window.clearTimeout(id);
  }, [running, index, interval, photos.length]);

  const go = (i: number) => setIndex((i + photos.length) % photos.length);
  const current = photos[index];

  return (
    <div
      className={`slideshow${running ? ' is-running' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Exhibitions and opening nights"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ ['--slide-ms' as string]: `${interval}ms` }}
    >
      <div className="slideshow-frame">
        {photos.map((p, i) => (
          <figure
            key={p.src}
            className={`slide${i === index ? ' is-active' : ''}`}
            aria-hidden={i !== index}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${photos.length}`}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </figure>
        ))}
        <div className="slideshow-caption" aria-live={running ? 'off' : 'polite'}>
          <span className="slideshow-tag">
            {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')} ·{' '}
            {current.tag}
          </span>
          <span className="slideshow-title">{current.caption}</span>
        </div>
        <div className="slideshow-nav">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo">
            ←
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
          >
            {paused ? '▶' : '❚❚'}
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next photo">
            →
          </button>
        </div>
      </div>

      <div className="slideshow-foot">
        <div className="slideshow-dots" role="group" aria-label="Choose a photo">
          {photos.map((p, i) => (
            <button
              type="button"
              key={p.src}
              className={i === index ? 'is-active' : undefined}
              aria-label={`Photo ${i + 1}: ${p.caption}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
            >
              <span key={i === index ? `on-${index}` : 'off'} />
            </button>
          ))}
        </div>
        <p className="slideshow-credit">
          Photo:{' '}
          <a href={current.sourceUrl} target="_blank" rel="noreferrer noopener">
            {current.creator}
          </a>
          ,{' '}
          <a href={licenseUrl(current)} target="_blank" rel="noreferrer noopener license">
            {current.license}
          </a>
        </p>
      </div>
    </div>
  );
}
