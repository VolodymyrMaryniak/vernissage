import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { stubFetch } from '../../testUtils';
import MediaManager from './MediaManager';

const MB = 1024 * 1024;

/** A File whose reported size can exceed what we actually allocate. */
function fileOfSize(name: string, bytes: number): File {
  const file = new File(['x'], name, { type: 'image/jpeg' });
  Object.defineProperty(file, 'size', { value: bytes });
  return file;
}

describe('MediaManager', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects a file over the size cap without calling the API', async () => {
    const fetchMock = stubFetch();
    const onChanged = vi.fn();
    render(<MediaManager exhibitionId="a" media={[]} onChanged={onChanged} />);

    await userEvent.upload(
      screen.getByTestId('media-file-input'),
      fileOfSize('huge.jpg', 51 * MB),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));

    expect(screen.getByText(/the limit is 50 MB/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onChanged).not.toHaveBeenCalled();
  });

  it('uploads an acceptable file and notifies the parent', async () => {
    const fetchMock = stubFetch([
      { url: '/api/exhibitions', body: { id: 'm1', fileName: 'small.jpg' }, status: 201 },
    ]);
    const onChanged = vi.fn();
    render(<MediaManager exhibitionId="a" media={[]} onChanged={onChanged} />);

    await userEvent.upload(
      screen.getByTestId('media-file-input'),
      fileOfSize('small.jpg', 2 * MB),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => expect(onChanged).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
