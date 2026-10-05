import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TabStopType,
  TextRun,
  WidthType,
} from 'docx';
import { CV_FONT_SPECS } from './fonts';
import type { CvEntry, CvModel } from './model';
import { CV_THEMES } from './theme';

// Loaded only when a Word file is downloaded (dynamic import).

const TWIPS_PER_PT = 20;
const halfPoints = (pt: number) => Math.round(pt * 2);
const hex = (color: string) => color.replace('#', '');

const PAGE_TWIPS = {
  A4: { width: 11906, height: 16838 },
  Letter: { width: 12240, height: 15840 },
} as const;

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

/** Renders the CV as a .docx blob. `photo` is the photo as JPEG bytes, or null. */
export async function renderCvDocx(model: CvModel, photo: Uint8Array | null): Promise<Blob> {
  const t = CV_THEMES[model.template];
  const font = CV_FONT_SPECS[model.font].docxFont;
  const classic = model.template === 'classic';
  const modern = model.template === 'modern';
  const align = classic ? AlignmentType.CENTER : AlignmentType.LEFT;
  const yearTab = t.yearWidth * TWIPS_PER_PT;

  const entry = (e: CvEntry) =>
    new Paragraph({
      // Year in a hanging column, so wrapped lines align with the text.
      tabStops: [{ type: TabStopType.LEFT, position: yearTab }],
      indent: { left: yearTab, hanging: yearTab },
      spacing: { after: 60 },
      children: [
        new TextRun({ text: e.year ?? '', color: hex(model.template === 'minimal' ? t.accent : t.muted) }),
        new TextRun({ text: '\t' }),
        new TextRun({ text: e.title, italics: e.italicTitle }),
        ...(e.detail ? [new TextRun({ text: `, ${e.detail}`, color: '3C3733' })] : []),
      ],
    });

  const sections = model.sections.flatMap((section) => [
    new Paragraph({
      alignment: align,
      spacing: { before: 300, after: 120 },
      keepNext: true,
      border: modern
        ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: hex(t.accent), space: 3 } }
        : classic
          ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'C9C3BB', space: 4 } }
          : undefined,
      children: [
        new TextRun({
          text: section.title.toUpperCase(),
          size: halfPoints(t.titleSize),
          bold: modern,
          color: hex(t.accent),
          characterSpacing: classic || model.template === 'minimal' ? 40 : 20,
        }),
      ],
    }),
    ...section.entries.map((e) =>
      section.prose
        ? new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: e.title })] })
        : entry(e),
    ),
  ]);

  const photoParagraph = photo
    ? [
        new Paragraph({
          alignment: align,
          spacing: { after: 200 },
          children: [
            new ImageRun({
              type: 'jpg',
              data: photo,
              transformation: { width: t.photoSize * (96 / 72), height: t.photoSize * (96 / 72) },
            }),
          ],
        }),
      ]
    : [];

  const heading = [
    new Paragraph({
      alignment: align,
      children: [new TextRun({ text: model.name, size: halfPoints(t.nameSize) })],
    }),
    ...(model.headline
      ? [
          new Paragraph({
            alignment: align,
            spacing: { before: 80 },
            children: [
              new TextRun({ text: model.headline, italics: true, size: halfPoints(t.headlineSize), color: hex(t.muted) }),
            ],
          }),
        ]
      : []),
  ];

  const page = PAGE_TWIPS[model.pageSize];
  const margin = (modern ? 34 : t.margin) * TWIPS_PER_PT;
  let children: (Paragraph | Table)[];

  if (modern) {
    // Sidebar + main column as a borderless two-cell table.
    const contentWidth = page.width - 2 * margin;
    const sideWidth = Math.round(contentWidth * 0.33);
    const contact = model.contact.map(
      (c, i) =>
        new Paragraph({
          spacing: { before: i === 0 ? 240 : 60 },
          children: [new TextRun({ text: c, size: halfPoints(t.bodySize - 1), color: '3C3733' })],
        }),
    );
    children = [
      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [sideWidth, contentWidth - sideWidth],
        borders: NO_BORDERS,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: sideWidth, type: WidthType.DXA },
                shading: { type: ShadingType.CLEAR, color: 'auto', fill: hex(t.sidebar ?? '#ffffff') },
                margins: { top: 300, bottom: 300, left: 240, right: 240 },
                children: [...photoParagraph, ...heading, ...contact],
              }),
              new TableCell({
                width: { size: contentWidth - sideWidth, type: WidthType.DXA },
                margins: { top: 60, left: 360, right: 120 },
                children: sections.length > 0 ? sections : [new Paragraph('')],
              }),
            ],
          }),
        ],
      }),
    ];
  } else {
    const contact = model.contact.length
      ? [
          new Paragraph({
            alignment: align,
            spacing: { before: 120 },
            children: [
              new TextRun({ text: model.contact.join('  ·  '), size: halfPoints(t.bodySize - 1), color: hex(t.muted) }),
            ],
          }),
        ]
      : [];
    children = [...photoParagraph, ...heading, ...contact, ...sections];
  }

  const doc = new Document({
    creator: 'Vernissage',
    title: `${model.name} — CV`,
    styles: {
      default: {
        document: {
          run: { font, size: halfPoints(t.bodySize), color: '1A1715' },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: page.width, height: page.height },
            margin: { top: margin, bottom: margin, left: margin, right: margin },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
