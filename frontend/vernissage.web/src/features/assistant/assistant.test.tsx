import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { stubFetch } from '../../testUtils';
import type { ExhibitionWrite } from '../../types/exhibition';
import ExhibitionForm from '../exhibitions/ExhibitionForm';
import DraftPanel from './DraftPanel';
import TextAssist from './TextAssist';
import { suggestionsFrom } from './suggestions';

const empty: ExhibitionWrite = {
  roles: [],
  name: '',
  startDate: null,
  endDate: null,
  location: null,
  focus: null,
  curator: null,
  galleryLocation: null,
  explication: null,
  investigationMaterial: null,
  team: null,
  artworksList: null,
  preOpeningDetails: null,
  openingDetails: null,
  eventsDetails: null,
  notes: null,
  referencedLiterature: null,
  aim: null,
};

describe('AI assistant', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps only usable suggestions: real dates, no repeats of current values', () => {
    const found = suggestionsFrom(
      {
        summary: '',
        name: 'Soft Wall',
        startDate: 'September 2026',
        endDate: '2026-10-26',
        curator: 'Same',
        aim: '  ',
      },
      { ...empty, curator: 'Same' },
    );
    expect(found.map((s) => s.key)).toEqual(['name', 'endDate']);
  });

  it('drafts from notes and fills only the suggestions you keep', async () => {
    const fetchMock = stubFetch([
      {
        url: '/api/assistant/draft',
        body: {
          summary: 'Found the title, venue and curator; dates are missing.',
          name: 'Soft Wall',
          galleryLocation: 'Galerie Nord',
          curator: 'Oksana H.',
          startDate: null,
        },
      },
    ]);
    const onApply = vi.fn();
    render(<DraftPanel current={{ ...empty, curator: 'Me' }} onApply={onApply} defaultOpen />);

    fireEvent.change(screen.getByLabelText('Your material'), {
      target: { value: 'Soft Wall at Galerie Nord, curated by Oksana H.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Draft the record' }));

    expect(await screen.findByText(/dates are missing/)).toBeInTheDocument();
    const call = fetchMock.mock.calls.find(([u]) => String(u).includes('/api/assistant/draft'));
    const init = (call as unknown as [string, RequestInit])[1];
    expect((init.body as FormData).get('notes')).toContain('Soft Wall');

    // Empty fields are ticked; a field you already filled is not, and shows what it replaces.
    expect(screen.getByRole('checkbox', { name: 'Name' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Curator' })).not.toBeChecked();
    expect(screen.getByText('Me')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Fill in 2 fields' }));
    expect(onApply).toHaveBeenCalledWith({ name: 'Soft Wall', galleryLocation: 'Galerie Nord' });
  });

  it('shows the error the API gives', async () => {
    stubFetch([
      { url: '/api/assistant/draft', status: 422, body: { message: 'Try a shorter excerpt.' } },
    ]);
    render(<DraftPanel current={empty} onApply={vi.fn()} defaultOpen />);

    fireEvent.change(screen.getByLabelText('Your material'), { target: { value: 'notes' } });
    fireEvent.click(screen.getByRole('button', { name: 'Draft the record' }));

    expect(await screen.findByText('Try a shorter excerpt.')).toBeInTheDocument();
  });

  it('offers a rewrite and applies it only when accepted', async () => {
    stubFetch([{ url: '/api/assistant/improve', body: { text: 'A tighter statement.' } }]);
    const onAccept = vi.fn();
    render(
      <TextAssist
        field="explication"
        label="Explication"
        text="A rather long and winding curatorial statement about walls."
        onAccept={onAccept}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Shorten Explication' }));
    expect(await screen.findByText('A tighter statement.')).toBeInTheDocument();
    expect(onAccept).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Use this' }));
    expect(onAccept).toHaveBeenCalledWith('A tighter statement.');
  });

  it('stays out of the form unless the assistant is enabled', () => {
    const props = { submitting: false, error: null, onSubmit: vi.fn(), onCancel: vi.fn() };
    const { unmount } = render(<ExhibitionForm {...props} />);
    expect(screen.queryByRole('region', { name: 'Draft with AI' })).not.toBeInTheDocument();
    unmount();

    render(<ExhibitionForm {...props} assistantEnabled />);
    expect(screen.getByRole('region', { name: 'Draft with AI' })).toBeInTheDocument();
  });

  it('fills the form from an accepted draft', async () => {
    stubFetch([
      {
        url: '/api/assistant/draft',
        body: { summary: 'ok', name: 'Soft Wall', endDate: '2026-10-26' },
      },
    ]);
    render(
      <ExhibitionForm
        submitting={false}
        error={null}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        assistantEnabled
      />,
    );

    fireEvent.change(screen.getByLabelText('Your material'), { target: { value: 'notes' } });
    fireEvent.click(screen.getByRole('button', { name: 'Draft the record' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Fill in 2 fields' }));

    await waitFor(() =>
      expect(screen.getByPlaceholderText(/Light & Shadow/)).toHaveValue('Soft Wall'),
    );
    expect(screen.getByLabelText('End date')).toHaveValue('2026-10-26');
  });
});
