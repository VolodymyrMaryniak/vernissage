import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the heading and action buttons', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Vernissage' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Call API' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Call Another API' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check DB Connection' })).toBeInTheDocument();
  });
});
