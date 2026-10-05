import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PhotoSlideshow from './PhotoSlideshow';
import { PHOTOS } from './photos';

describe('PhotoSlideshow', () => {
  it('credits the photo on screen and moves between slides', () => {
    render(<PhotoSlideshow photos={PHOTOS} />);

    expect(screen.getByRole('link', { name: PHOTOS[0].creator })).toHaveAttribute(
      'href',
      PHOTOS[0].sourceUrl,
    );
    expect(screen.getByText(PHOTOS[0].caption)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(screen.getByRole('link', { name: PHOTOS[1].creator })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
    expect(screen.getByText(PHOTOS[PHOTOS.length - 1].caption)).toBeInTheDocument();
  });

  it('can be paused', () => {
    render(<PhotoSlideshow photos={PHOTOS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }));
    expect(screen.getByRole('button', { name: 'Play slideshow' })).toBeInTheDocument();
  });
});
