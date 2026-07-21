import { useEffect, useState } from 'react';
import type { BackendVersion, FrontendVersion } from '../../types/version';
import { getBackendVersion } from '../../api/versionApi';
import { useDocumentMeta } from '../../lib/useDocumentMeta';

const frontend: FrontendVersion = {
  branch: __APP_BRANCH__,
  buildTimeUtc: __APP_BUILD_TIME__,
};

function formatTimestamp(value: string | null | undefined): string {
  if (!value) return 'unknown';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'unknown' : parsed.toLocaleString();
}

/**
 * Build information for both halves of the app. Deliberately unlisted: no nav
 * or footer links point here, and the page asks not to be indexed — it exists
 * for whoever needs to check what is actually deployed.
 */
export default function VersionPage() {
  useDocumentMeta({ title: 'Build info', noIndex: true });

  const [backend, setBackend] = useState<BackendVersion | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getBackendVersion()
      .then((info) => {
        if (active) setBackend(info);
      })
      .catch((err: unknown) => {
        if (active) {
          setBackendError(err instanceof Error ? err.message : 'Failed to load backend version');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="version-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Deployment</p>
          <h2>Build info</h2>
          <p className="page-sub">What is currently deployed on each side of the app.</p>
        </div>
      </header>

      <div className="version-blocks">
        <section className="card version-block">
          <h3 className="version-title">Frontend</h3>
          <dl className="version-list">
            <div className="version-row">
              <dt>Branch</dt>
              <dd>{frontend.branch}</dd>
            </div>
            <div className="version-row">
              <dt>Built</dt>
              <dd>{formatTimestamp(frontend.buildTimeUtc)}</dd>
            </div>
          </dl>
        </section>

        <section className="card version-block">
          <h3 className="version-title">Backend</h3>
          {backendError ? (
            <p className="version-error">Unavailable ({backendError})</p>
          ) : backend ? (
            <dl className="version-list">
              <div className="version-row">
                <dt>Version</dt>
                <dd>{backend.version}</dd>
              </div>
              <div className="version-row">
                <dt>Branch</dt>
                <dd>{backend.branch}</dd>
              </div>
              <div className="version-row">
                <dt>Built</dt>
                <dd>{formatTimestamp(backend.buildTimeUtc)}</dd>
              </div>
            </dl>
          ) : (
            <p className="version-loading">Loading…</p>
          )}
        </section>
      </div>
    </div>
  );
}
