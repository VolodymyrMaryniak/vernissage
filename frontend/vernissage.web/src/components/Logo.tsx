import { useId } from 'react';

interface Props {
  className?: string;
  /** Pixel height; the mark is square. */
  size?: number;
}

/**
 * The Vernissage mark — a deep peony-red dot with a soft, feathered edge: the red
 * "sold" sticker of an opening night, rendered as colour rather than an object.
 * Solid in the middle and fading out in the same warm red (a darker edge would
 * turn mauve over the light page). Decorative: labelled by the adjacent
 * wordmark text.
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
        <radialGradient id={gradientId} cx="60" cy="60" r="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A8172A" />
          <stop offset="0.4" stopColor="#A8172A" />
          <stop offset="0.52" stopColor="#A8172A" stopOpacity="0.92" />
          <stop offset="0.62" stopColor="#A8172A" stopOpacity="0.74" />
          <stop offset="0.72" stopColor="#A1182A" stopOpacity="0.5" />
          <stop offset="0.82" stopColor="#A1182A" stopOpacity="0.27" />
          <stop offset="0.91" stopColor="#A1182A" stopOpacity="0.09" />
          <stop offset="1" stopColor="#A1182A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill={`url(#${gradientId})`} />
    </svg>
  );
}
