// Mirrors ProfileController.MaxPhotoBytes.
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/**
 * Client-side check before uploading a profile photo. The server enforces the
 * same rules; failing here avoids a pointless upload and gives a clearer message.
 * Returns an error message, or null when the file is fine.
 */
export function validatePhoto(file: File): string | null {
  if (file.size > MAX_PHOTO_BYTES) return 'Photo must be 5 MB or smaller.';
  if (!file.type.startsWith('image/')) return 'Profile photo must be an image.';
  return null;
}
