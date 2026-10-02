import { useId } from 'react';

interface Props {
  className?: string;
  /** Pixel height; the mark is square. */
  size?: number;
}

/**
 * The Vernissage mark — a deep peony-red dot with a soft, feathered edge: the red
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
          <stop offset="0" stopColor="#A8172A" />
          <stop offset="0.18" stopColor="#A8172A" />
          <stop offset="0.282" stopColor="#A8172A" stopOpacity="0.957" />
          <stop offset="0.385" stopColor="#A8172A" stopOpacity="0.844" />
          <stop offset="0.487" stopColor="#A8172A" stopOpacity="0.684" />
          <stop offset="0.59" stopColor="#A8172A" stopOpacity="0.5" />
          <stop offset="0.693" stopColor="#A8172A" stopOpacity="0.316" />
          <stop offset="0.795" stopColor="#A8172A" stopOpacity="0.156" />
          <stop offset="0.897" stopColor="#A8172A" stopOpacity="0.043" />
          <stop offset="1" stopColor="#A8172A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#${gradientId})`} />
    </svg>
  );
}
