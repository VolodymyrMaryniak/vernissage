import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { applyTheme, savedTheme } from './theme';

describe('theme', () => {
  afterEach(() => {
    localStorage.clear();
    applyTheme('light');
  });

  it('is light unless the visitor chose dark', () => {
    expect(savedTheme()).toBe('light');
    localStorage.setItem('vernissage.theme', 'dark');
    expect(savedTheme()).toBe('dark');
  });

  it('switches to dark and back, keeping every toggle in step', () => {
    applyTheme('light');
    render(
      <>
        <ThemeToggle />
        <ThemeToggle />
      </>,
    );
    const [first, second] = screen.getAllByRole('button', { name: 'Switch to dark theme' });

    fireEvent.click(first);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('vernissage.theme')).toBe('dark');
    expect(second).toHaveAccessibleName('Switch to light theme');

    fireEvent.click(second);
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
