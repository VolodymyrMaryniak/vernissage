import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ExhibitionForm from './ExhibitionForm';
import { FIELD_SECTIONS } from './fields';

function renderForm(overrides: Partial<Parameters<typeof ExhibitionForm>[0]> = {}) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(
    <ExhibitionForm
      submitting={false}
      error={null}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...overrides}
    />,
  );
  return { onSubmit, onCancel };
}

describe('ExhibitionForm', () => {
  it('renders every configured field section', () => {
    renderForm();

    for (const section of FIELD_SECTIONS) {
      expect(screen.getByRole('heading', { name: section.title })).toBeInTheDocument();
    }
  });

  it('keeps submit disabled until a name is entered', async () => {
    const { onSubmit } = renderForm();

    const submit = screen.getByRole('button', { name: 'Create exhibition' });
    expect(submit).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/Name/), 'Northern Lights');

    expect(submit).toBeEnabled();
    await userEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('submits a trimmed name and nulls for untouched fields', async () => {
    const { onSubmit } = renderForm();

    await userEvent.type(screen.getByLabelText(/Name/), '  Northern Lights  ');
    await userEvent.type(screen.getByLabelText('Curator'), 'Ada Curator');
    await userEvent.click(screen.getByRole('button', { name: 'Create exhibition' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Northern Lights',
        curator: 'Ada Curator',
        location: null,
        notes: null,
      }),
    );
  });

  it('pre-fills from an existing exhibition when editing', () => {
    renderForm({
      initial: {
        id: 'a',
        name: 'Northern Lights',
        startDate: '2026-05-01',
        endDate: null,
        location: 'Kyiv',
        focus: null,
        curator: 'Ada Curator',
        ownerId: 'user-1',
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
        aim: 'Explore light.',
        createdAtUtc: '2026-05-01T00:00:00Z',
        updatedAtUtc: '2026-05-01T00:00:00Z',
        media: [],
      },
    });

    expect(screen.getByLabelText(/Name/)).toHaveValue('Northern Lights');
    expect(screen.getByLabelText('Location')).toHaveValue('Kyiv');
    expect(screen.getByLabelText('Aim')).toHaveValue('Explore light.');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });
});
