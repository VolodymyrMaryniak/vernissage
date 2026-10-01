export type IconName =
  | 'document'
  | 'folder'
  | 'vr'
  | 'globe'
  | 'portfolio'
  | 'bell'
  | 'palette';

interface Props {
  name: IconName;
  className?: string;
  size?: number;
}

/** Shared stroke glyphs, drawn in `currentColor` so they take the brand tint. */
const PATHS: Record<IconName, React.ReactNode> = {
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.6.8l1 1.4a2 2 0 0 0 1.6.8H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  vr: (
    <>
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3.2a2 2 0 0 1-1.6-.8l-.8-1.1a1.7 1.7 0 0 0-2.8 0l-.8 1.1a2 2 0 0 1-1.6.8H5a2 2 0 0 1-2-2z" />
      <circle cx="7.75" cy="11.5" r="1.4" />
      <circle cx="16.25" cy="11.5" r="1.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
    </>
  ),
  portfolio: (
    <>
      <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
      <path d="M13 3v4a1 1 0 0 0 1 1h4" />
      <path d="M9 13h4M9 17h3" />
      <path d="m18.2 2.6.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </>
  ),
  palette: (
    <>
      <path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 3-3 3h-1.6a1.9 1.9 0 0 0-1.3 3.3A1.9 1.9 0 0 1 12 21z" />
      <circle cx="8" cy="11" r="1.2" />
      <circle cx="12" cy="7.8" r="1.2" />
      <circle cx="15.8" cy="10.6" r="1.2" />
    </>
  ),
};

export default function Icon({ name, className, size = 22 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
