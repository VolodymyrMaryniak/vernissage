import { Font, pdf } from '@react-pdf/renderer';
import CvPdfDocument from './CvPdfDocument';
import { CV_FONT_SPECS } from './fonts';
import type { CvModel } from './model';

// Loaded only when a PDF is downloaded (dynamic import), so @react-pdf stays
// out of the main bundle.

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  const absolute = (path: string) => new URL(path, window.location.origin).href;
  for (const spec of Object.values(CV_FONT_SPECS)) {
    Font.register({
      family: spec.family,
      fonts: [
        { src: absolute(spec.files.regular) },
        { src: absolute(spec.files.bold), fontWeight: 'bold' },
        { src: absolute(spec.files.italic), fontStyle: 'italic' },
      ],
    });
  }
  // CV entries are short; never hyphenate names and titles.
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

/** Renders the CV to a PDF blob. `photo` is a JPEG/PNG data URL, or null. */
export async function renderCvPdf(model: CvModel, photo: string | null): Promise<Blob> {
  registerFonts();
  return pdf(<CvPdfDocument model={model} photo={photo} />).toBlob();
}
