import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ShowReel from './ShowReel';
import type { ReelData } from './scenes';

const data: ReelData = {
  title: 'Soft Wall',
  dates: '12 Sep – 26 Oct 2026',
  photos: [{ src: '/a.webp', caption: 'Installation view', tag: 'The room' }],
  works: [{ title: 'Salt Line', sold: true }, { title: 'Small Hours' }],
  stats: { visitors: 1240, sold: 1, costs: [{ label: 'Framing', amount: 200 }] },
};

describe('ShowReel', () => {
  it('opens on the title card with a play control', () => {
    render(<ShowReel data={data} />);
    expect(screen.getByRole('heading', { name: 'Soft Wall' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play reel' })).toBeInTheDocument();
  });

  it('jumps to a scene from the scrubber', () => {
    render(<ShowReel data={data} />);

    fireEvent.click(screen.getByRole('button', { name: /Scene 2: Photograph/ }));
    expect(screen.getByText('Installation view')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Scene 3: The works/ }));
    expect(screen.getByText('Salt Line')).toBeInTheDocument();
    expect(screen.getByLabelText('sold')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Scene 4: The numbers/ }));
    expect(screen.getByText('Visitors')).toBeInTheDocument();
    expect(screen.getByText('Works sold')).toBeInTheDocument();
  });

  it('has no numbers scene without stats', () => {
    render(<ShowReel data={{ ...data, stats: null }} />);
    expect(screen.queryByRole('button', { name: /The numbers/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /The costs/ })).not.toBeInTheDocument();
  });
});
