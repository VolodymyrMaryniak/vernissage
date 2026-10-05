import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { CV_FONT_SPECS } from './fonts';
import type { CvEntry, CvModel } from './model';
import { CV_THEMES } from './theme';

/** The CV as a @react-pdf document (see cvPdf.tsx for rendering it to a file). */
export default function CvPdfDocument({ model, photo }: { model: CvModel; photo: string | null }) {
  const t = CV_THEMES[model.template];
  const family = CV_FONT_SPECS[model.font].family;
  const modern = model.template === 'modern';
  const classic = model.template === 'classic';
  const minimal = model.template === 'minimal';
  const sidebarWidth = '33%';

  const s = StyleSheet.create({
    page: {
      fontFamily: family,
      fontSize: t.bodySize,
      color: '#1a1715',
      lineHeight: 1.4,
      padding: modern ? 0 : t.margin,
      flexDirection: modern ? 'row' : 'column',
    },
    sidebarBg: { position: 'absolute', top: 0, left: 0, bottom: 0, width: sidebarWidth, backgroundColor: t.sidebar ?? '#fff' },
    sidebar: { width: sidebarWidth, paddingVertical: t.margin, paddingHorizontal: 26 },
    main: { flex: 1, paddingVertical: t.margin, paddingHorizontal: 34 },
    header: {
      flexDirection: minimal ? 'row' : 'column',
      alignItems: classic ? 'center' : minimal ? 'flex-start' : 'flex-start',
      justifyContent: minimal ? 'space-between' : 'flex-start',
      marginBottom: 22,
    },
    headerText: { flexDirection: 'column', alignItems: classic ? 'center' : 'flex-start', flex: minimal ? 1 : undefined },
    photo: {
      width: t.photoSize,
      height: t.photoSize,
      borderRadius: t.roundPhoto ? t.photoSize / 2 : 0,
      marginBottom: minimal ? 0 : 14,
      marginLeft: minimal ? 18 : 0,
      objectFit: 'cover',
    },
    name: { fontSize: t.nameSize, lineHeight: 1.1, textAlign: classic ? 'center' : 'left' },
    headline: {
      fontSize: t.headlineSize,
      fontStyle: 'italic',
      color: t.muted,
      marginTop: 5,
      textAlign: classic ? 'center' : 'left',
    },
    contactLine: { fontSize: t.bodySize - 1, color: t.muted, marginTop: 8, textAlign: classic ? 'center' : 'left' },
    contactItem: { fontSize: t.bodySize - 1, color: '#3c3733', marginTop: 4 },
    contactList: { marginTop: 18 },
    section: { marginTop: classic ? 16 : 14 },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
    rule: { flex: 1, height: 0.6, backgroundColor: '#c9c3bb' },
    title: {
      fontSize: t.titleSize,
      fontWeight: modern ? 'bold' : 'normal',
      textTransform: 'uppercase',
      letterSpacing: classic ? 2.2 : minimal ? 2.4 : 1.2,
      color: t.accent,
      paddingHorizontal: classic ? 10 : 0,
    },
    titleUnderline: { borderBottomWidth: 0.8, borderBottomColor: t.accent, paddingBottom: 3, marginBottom: 7 },
    entry: { flexDirection: 'row', marginBottom: 3.5 },
    year: { width: t.yearWidth, color: minimal ? t.accent : t.muted },
    body: { flex: 1 },
    detail: { color: '#3c3733' },
  });

  const entry = (e: CvEntry, i: number) => (
    <View key={i} style={s.entry} wrap={false}>
      <Text style={s.year}>{e.year ?? ''}</Text>
      <Text style={s.body}>
        <Text style={e.italicTitle ? { fontStyle: 'italic' } : undefined}>{e.title}</Text>
        {e.detail ? <Text style={s.detail}>, {e.detail}</Text> : null}
      </Text>
    </View>
  );

  const sections = model.sections.map((section) => (
    <View key={section.title} style={s.section}>
      {classic ? (
        <View style={s.titleRow} wrap={false}>
          <View style={s.rule} />
          <Text style={s.title}>{section.title}</Text>
          <View style={s.rule} />
        </View>
      ) : (
        <View style={modern ? s.titleUnderline : { marginBottom: 7 }} wrap={false}>
          <Text style={s.title}>{section.title}</Text>
        </View>
      )}
      {section.prose
        ? section.entries.map((e, i) => (
            <Text key={i} style={{ marginBottom: 5 }}>
              {e.title}
            </Text>
          ))
        : section.entries.map(entry)}
    </View>
  ));

  const photoEl = photo ? <Image src={photo} style={s.photo} /> : null;
  const nameEls = (
    <>
      <Text style={s.name}>{model.name}</Text>
      {model.headline ? <Text style={s.headline}>{model.headline}</Text> : null}
    </>
  );

  return (
    <Document title={`${model.name} — CV`} author={model.name} creator="Vernissage">
      <Page size={model.pageSize === 'Letter' ? 'LETTER' : 'A4'} style={s.page}>
        {modern ? (
          <>
            <View fixed style={s.sidebarBg} />
            <View style={s.sidebar}>
              {photoEl}
              {nameEls}
              {model.contact.length > 0 && (
                <View style={s.contactList}>
                  {model.contact.map((c) => (
                    <Text key={c} style={s.contactItem}>
                      {c}
                    </Text>
                  ))}
                </View>
              )}
            </View>
            <View style={s.main}>{sections}</View>
          </>
        ) : (
          <>
            <View style={s.header}>
              {!minimal && photoEl}
              <View style={s.headerText}>
                {nameEls}
                {model.contact.length > 0 && <Text style={s.contactLine}>{model.contact.join('  ·  ')}</Text>}
              </View>
              {minimal && photoEl}
            </View>
            {sections}
          </>
        )}
      </Page>
    </Document>
  );
}
