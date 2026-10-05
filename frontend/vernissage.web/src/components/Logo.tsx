import { useId } from 'react';

interface Props {
  className?: string;
  /** Pixel height; the mark is square. */
  size?: number;
}

// Burgundy; the theme sets --logo-dot (a touch lighter on the dark theme so it still reads).
const DOT = { stopColor: 'var(--logo-dot, #7D1D32)' };

/**
 * The Vernissage mark — a deep burgundy dot with a soft, feathered edge: the red
 * "sold" sticker of an opening night, rendered as colour rather than an object.
 * One colour with a smoothstep fade from a small solid centre to nothing, so the
 * edge has no visible step. Decorative: labelled by the adjacent wordmark text.
 */
export default function Logo({ className, size = 28 }: Props) {
  // Each instance (header, footer) needs its own gradient id.
  const gradientId = `${useId()}-peony-dot`;

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      height={size}
      width={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={gradientId} cx="60" cy="60" r="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={DOT} />
          <stop offset="0.18" style={DOT} />
          <stop offset="0.282" style={{ ...DOT, stopOpacity: 0.957 }} />
          <stop offset="0.385" style={{ ...DOT, stopOpacity: 0.844 }} />
          <stop offset="0.487" style={{ ...DOT, stopOpacity: 0.684 }} />
          <stop offset="0.59" style={{ ...DOT, stopOpacity: 0.5 }} />
          <stop offset="0.693" style={{ ...DOT, stopOpacity: 0.316 }} />
          <stop offset="0.795" style={{ ...DOT, stopOpacity: 0.156 }} />
          <stop offset="0.897" style={{ ...DOT, stopOpacity: 0.043 }} />
          <stop offset="1" style={{ ...DOT, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#${gradientId})`} />
    </svg>
  );
}
