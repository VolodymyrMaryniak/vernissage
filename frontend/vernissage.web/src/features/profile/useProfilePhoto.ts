import { useEffect, useState } from 'react';
import { fetchProfilePhotoUrl } from '../../api/profileApi';

/**
 * Loads the signed-in user's profile photo as an object URL (the endpoint needs
 * the auth header, so a plain <img src> won't do) and revokes it when it is no
 * longer shown. Bump `version` after an upload to fetch the new photo.
 */
export function useProfilePhoto(hasPhoto: boolean, version = 0): string | null {
  const key = hasPhoto ? version : null;
  const [loaded, setLoaded] = useState<{ key: number; url: string | null } | null>(null);

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    let created: string | null = null;
    fetchProfilePhotoUrl()
      .then((url) => {
        if (cancelled) {
          if (url) URL.revokeObjectURL(url);
          return;
        }
        created = url;
        setLoaded({ key, url });
      })
      .catch(() => {
        // A photo failing to load is not fatal; the initials avatar shows instead.
      });
    return () => {
      cancelled = true;
      if (created) URL.revokeObjectURL(created);
    };
  }, [key]);

  return key !== null && loaded?.key === key ? loaded.url : null;
}
