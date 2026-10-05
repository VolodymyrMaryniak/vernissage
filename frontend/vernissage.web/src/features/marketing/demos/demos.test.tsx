import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ChecklistDemo from './ChecklistDemo';
import CvDemo from './CvDemo';
import MarginCalculator from './MarginCalculator';
import SeasonPlanner from './SeasonPlanner';
import ShowTimeline from './ShowTimeline';
import SoldWall from './SoldWall';

describe('audience page demos', () => {
  it('CV demo: ticking a show adds it to the CV preview', async () => {
    render(<CvDemo />);
    const preview = screen.getByRole('document', { name: 'CV preview' });
    expect(within(preview).queryByText('Small Hours')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('checkbox', { name: /Small Hours/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Minimal' }));

    expect(within(preview).getByText('Small Hours')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Minimal' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('sold wall: a red dot counts the work and its price', async () => {
    render(<SoldWall />);
    expect(screen.getByText('€2,400')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Тиха вода/ }));

    expect(screen.getByText('€7,600')).toBeInTheDocument();
    expect(screen.getByText(/of 6 sold/).parentElement).toHaveTextContent('2 of 6 sold');
  });

  it('timeline: each stage shows what the record keeps', async () => {
    render(<ShowTimeline />);
    await userEvent.click(screen.getByRole('tab', { name: /Install/ }));

    expect(screen.getByRole('tab', { name: /Install/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Lighting plan');
  });

  it('checklist: marking a work updates the progress', async () => {
    render(<ChecklistDemo />);
    expect(screen.getByText('3 of 5 catalogued')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Soft Wall/ }));

    expect(screen.getByText('4 of 5 catalogued')).toBeInTheDocument();
  });

  it('season planner: choosing a show opens its figures', async () => {
    render(<SeasonPlanner />);
    await userEvent.click(screen.getByRole('button', { name: /Small Hours/ }));

    expect(screen.getByText('640')).toBeInTheDocument();
    expect(screen.getByText('€8,700')).toBeInTheDocument();
  });

  it('margin calculator: commission on sales minus costs', () => {
    render(<MarginCalculator />);
    // Defaults: 8 × €2,200 = €17,600; 50% = €8,800; minus €6,500 costs.
    expect(screen.getByText('€2,300')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('slider', { name: /Show costs/ }), { target: { value: '10000' } });

    expect(screen.getByText('−€1,200')).toHaveClass('is-loss');
  });
});
