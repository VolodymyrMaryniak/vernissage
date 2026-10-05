import type { CvFont } from '../../types/cv';

/** One typeface option: the bundled TTFs (preview + PDF) and the Word font. */
export interface CvFontSpec {
  key: CvFont;
  label: string;
  /** Family name registered with @react-pdf and used by the preview's @font-face. */
  family: string;
  files: { regular: string; bold: string; italic: string };
  /** Installed Office font with the same metrics, used in the .docx export. */
  docxFont: string;
}

const file = (name: string) => `/fonts/cv/${name}.ttf`;

// See public/fonts/cv/README.md: all four cover Latin and Cyrillic (OFL).
export const CV_FONT_SPECS: Record<CvFont, CvFontSpec> = {
  garamond: {
    key: 'garamond',
    label: 'Garamond',
    family: 'CV Garamond',
    files: { regular: file('ebgaramond-regular'), bold: file('ebgaramond-bold'), italic: file('ebgaramond-italic') },
    docxFont: 'Garamond',
  },
  times: {
    key: 'times',
    label: 'Times',
    family: 'CV Times',
    files: { regular: file('tinos-regular'), bold: file('tinos-bold'), italic: file('tinos-italic') },
    docxFont: 'Times New Roman',
  },
  helvetica: {
    key: 'helvetica',
    label: 'Helvetica',
    family: 'CV Helvetica',
    files: { regular: file('arimo-regular'), bold: file('arimo-bold'), italic: file('arimo-italic') },
    docxFont: 'Arial',
  },
  courier: {
    key: 'courier',
    label: 'Courier',
    family: 'CV Courier',
    files: { regular: file('cousine-regular'), bold: file('cousine-bold'), italic: file('cousine-italic') },
    docxFont: 'Courier New',
  },
};
