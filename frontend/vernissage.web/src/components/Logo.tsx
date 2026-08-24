import { useId } from 'react';

interface Props {
  className?: string;
  /** Pixel height; width scales with the mark's aspect ratio. */
  size?: number;
}

/**
 * The Vernissage mark — the same folded "V" glyph used as the favicon, drawn
 * with a bright violet→magenta gradient so the header, footer and browser tab
 * share one identity. Decorative: labelled by the adjacent wordmark text.
 */
export default function Logo({ className, size = 28 }: Props) {
  const gradientId = useId();
  return (
    <svg
      className={className}
      viewBox="0 0 48 46"
      height={size}
      width={(size * 48) / 46}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#a21ff0" />
          <stop offset="100%" stopColor="#e0399a" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
      />
    </svg>
  );
}
