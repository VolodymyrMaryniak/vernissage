import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

export default function HowItWorksPage() {
  useDocumentMeta({
    title: 'How it works',
    description:
      'A four-step pipeline that carries an exhibition from opening night to a permanent, citable page.',
  });

  return (
    <>
      {/* ---- Hero ------------------------------------------------ */}
      <section className="page-hero">
        <div className="wash-drift" aria-hidden="true" />
        <div className="container page-hero-inner">
          <p className="eyebrow">How it works</p>
          <h1 className="display">
            From opening night to a <em>citable</em> page.
          </h1>
          <p className="lede">
            Vernissage is a working pipeline, not a template. It carries a show from the night the
            doors open — through its files, its rooms, and its record — to a permanent page a
            researcher can point to. Four steps, in order, each building on the last.
          </p>
          <div className="hero-actions">
            <Link className="cta" to="/exhibitions/new">
              Document a show
            </Link>
            <Link className="cta cta--secondary" to="/archive">
              Browse the archive
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Step 01 -------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Step 01</p>
            <h2 className="headline">
              Set up the <em>show</em>.
            </h2>
          </div>
          <p className="prose">
            You begin with a catalogue, not a blank document. Title, opening and closing dates, the
            artists, and every work on view — each entered against a proper schema so it stays
            consistent from the first entry to the thousandth. Dates are dates, artists are records,
            works carry their medium and dimensions.
          </p>
          <p className="prose">
            Structure at this stage is what makes everything downstream possible. Because the show
            is described in fields rather than prose, it can later be searched, filtered, and cited
            without anyone having to reread it. The catalogue is the spine the rest of the pipeline
            hangs on.
          </p>
        </div>
      </section>

      {/* ---- Step 02 -------------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Step 02</p>
            <h2 className="headline">
              Sync to <em>Drive</em>.
            </h2>
          </div>
          <p className="prose">
            Opening an exhibition provisions a structured Google Drive folder at
            <code> /Exhibitions/&#123;Year&#125;/&#123;Show&#125;/</code>, with subfolders waiting
            for each kind of material — masters, HDRs, press, and essays. Nothing has to be
            invented on the fly; the shape of the folder is decided before the first upload lands.
          </p>
          <p className="prose">
            This is where documentation usually falls apart, and where the pipeline holds it
            together. Installation masters stay separate from press scans, HDR brackets stay out of
            the essays, and every file sits under the one show it belongs to. Months later the
            folder still reads cleanly, because it was never allowed to scatter in the first place.
          </p>
        </div>
      </section>

      {/* ---- Step 03 -------------------------------------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Step 03</p>
            <h2 className="headline">
              Capture in <em>VR</em>.
            </h2>
          </div>
          <p className="prose">
            A photograph records a wall; a walkthrough records a room. Attach a Matterport or 360°
            capture and it embeds directly beside the catalogue, so the space itself becomes part
            of the record — the sightlines, the sequence, the scale a visitor actually moved
            through.
          </p>
          <p className="prose">
            Long after the walls come down, the show does not have to close. The walkthrough sits
            alongside the works and the files as one continuous document of the exhibition, letting
            anyone step back inside the room years after it was dismantled.
          </p>
        </div>
      </section>

      {/* ---- Step 04 -------------------------------------------- */}
      <section className="section section--band">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Step 04</p>
            <h2 className="headline">
              Publish &amp; <em>cite</em>.
            </h2>
          </div>
          <p className="prose">
            When the record is complete it publishes to a permanent Vernissage URL — versioned, so
            a citation always resolves to the state of the page at the moment it was referenced.
            Nothing overwrites the past; each revision is kept, and each is addressable.
          </p>
          <p className="prose">
            The published page is indexed and researcher-ready: a stable, quotable reference for a
            show that would otherwise survive only in scattered photographs and memory. This is the
            point of the whole pipeline — an exhibition that can be cited like any other source.
          </p>
        </div>
      </section>

      {/* ---- CTA band ------------------------------------------- */}
      <section className="cta-band">
        <div className="container section cta-band-inner">
          <div>
            <p className="eyebrow">Open access, non-commercial</p>
            <h2 className="headline">A record worth keeping open.</h2>
          </div>
          <div>
            <p className="prose">
              Vernissage exists to document exhibitions properly and keep that record public. Start
              cataloguing your own, or read what others have already published.
            </p>
            <div className="cta-band-actions">
              <Link className="cta" to="/exhibitions/new">
                Document a show
              </Link>
              <Link className="cta cta--secondary" to="/archive">
                Browse the archive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
