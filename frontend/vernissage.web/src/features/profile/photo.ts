// Mirrors ProfileController.MaxPhotoBytes.
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/**
 * Client-side check before uploading a profile photo. The server enforces the
 * same rules; failing here avoids a pointless upload and gives a clearer message.
 * Returns an error message, or null when the file is fine.
 */
export function validatePhoto(
  file: File,
  messages: { photoTooLarge: string; photoNotImage: string } = {
    photoTooLarge: 'Photo must be 5 MB or smaller.',
    photoNotImage: 'Profile photo must be an image.',
  },
): string | null {
  if (file.size > MAX_PHOTO_BYTES) return messages.photoTooLarge;
  if (!file.type.startsWith('image/')) return messages.photoNotImage;
  return null;
}
