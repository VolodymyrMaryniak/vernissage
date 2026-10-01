interface Props {
  className?: string;
  /** Pixel height; the mark is square. */
  size?: number;
}

/**
 * The Vernissage mark — a document with a folded corner and lines of text,
 * standing for the act of documenting a show into a lasting record. Drawn in a
 * single colour via `currentColor` so it inherits the green brand wherever it
 * sits (header, footer). Decorative: labelled by the adjacent wordmark text.
 */
export default function Logo({ className, size = 28 }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      height={size}
      width={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Page body with a folded top-right corner */}
      <path
        d="M10 3H19L24.5 8.5V26.5A1.5 1.5 0 0 1 23 28H10A1.5 1.5 0 0 1 8.5 26.5V4.5A1.5 1.5 0 0 1 10 3Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* The fold crease */}
      <path
        d="M19 3V7A1.5 1.5 0 0 0 20.5 8.5H24.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lines of text on the record */}
      <path
        d="M12 13.5H20.5M12 17.5H20.5M12 21.5H17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
