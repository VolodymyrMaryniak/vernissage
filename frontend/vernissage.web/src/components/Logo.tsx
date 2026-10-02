interface Props {
  className?: string;
  /** Pixel size; the mark is square. */
  size?: number;
}

const OUTER = [0, 45, 90, 135, 180, 225, 270, 315];
const INNER = [22.5, 82.5, 142.5, 202.5, 262.5, 322.5];

/** A petal rising from the centre to the top of the box. */
const OUTER_PETAL = 'M16 16.6C11.4 13.9 10.8 7.8 16 4c5.2 3.8 4.6 9.9 0 12.6z';
const INNER_PETAL = 'M16 16.4c-2.8-1.7-3.1-5.5 0-7.8 3.1 2.3 2.8 6.1 0 7.8z';

/**
 * The Vernissage mark — a peony, the flower given to the artist on opening
 * night, with a red dot at its centre: the mark a gallery puts beside a work
 * once it is sold. Petals are tinted from the brand red and layered in two
 * rings so the bloom reads even at favicon size; the dot stays full-strength
 * red, because that is the thing it signifies.
 * Decorative: labelled by the adjacent wordmark text.
 */
export default function Logo({ className, size = 28 }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {OUTER.map((angle) => (
        <path
          key={`o${angle}`}
          d={OUTER_PETAL}
          fill="#c21f2b"
          fillOpacity="0.2"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      {INNER.map((angle) => (
        <path
          key={`i${angle}`}
          d={INNER_PETAL}
          fill="#c21f2b"
          fillOpacity="0.38"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      {/* The red dot — a sold work */}
      <circle cx="16" cy="16" r="2.9" fill="#c21f2b" />
    </svg>
  );
}
