/** Saves a blob as a file via a temporary link. */
export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before freeing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Re-encodes a photo (any browser-readable image) as a square, centre-cropped
 * JPEG, which both the PDF and Word renderers accept. Returns the data URL and
 * the raw bytes.
 */
export async function squareJpeg(src: string, size = 480): Promise<{ dataUrl: string; bytes: Uint8Array }> {
  const image = new Image();
  image.src = src;
  await image.decode();
  const side = Math.min(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available');
  context.drawImage(
    image,
    (image.naturalWidth - side) / 2,
    (image.naturalHeight - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const binary = atob(dataUrl.split(',')[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { dataUrl, bytes };
}
