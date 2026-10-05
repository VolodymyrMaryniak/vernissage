import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import en from './en';
import fr from './fr';
import uk from './uk';
import { fmt, plural } from './format';
import Rich from './Rich';
import { I18nProvider } from './I18nContext';
import { savedLocale } from './locales';
import SiteHeader from '../components/SiteHeader';
import { AuthProvider } from '../features/auth/AuthContext';
import { ConfigProvider } from '../features/config/ConfigContext';
import { stubFetch } from '../testUtils';

/** Every string leaf of a dictionary, with its dotted path. */
function leaves(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [];
}

describe('i18n', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  it('uses the Ukrainian plural forms', () => {
    const forms = uk.ex.list.entries;
    expect(plural(1, forms, 'uk')).toBe('1 запис');
    expect(plural(3, forms, 'uk')).toBe('3 записи');
    expect(plural(5, forms, 'uk')).toBe('5 записів');
    expect(plural(21, forms, 'uk')).toBe('21 запис');
    expect(plural(1, en.ex.list.entries, 'en')).toBe('1 entry');
    expect(plural(2, en.ex.list.entries, 'en')).toBe('2 entries');
  });

  it('fills placeholders and renders *emphasis*', () => {
    expect(fmt('Page {page} of {pages}', { page: 2, pages: 5 })).toBe('Page 2 of 5');
    const { container } = render(<Rich text="Same inventory, *used your way*." />);
    expect(container.querySelector('em')?.textContent).toBe('used your way');
  });

  it('defaults to English, whatever the browser language', () => {
    vi.stubGlobal('navigator', { ...navigator, language: 'fr-FR', languages: ['fr-FR'] });
    expect(savedLocale()).toBe('en');
  });

  it('switches the site language from the header and remembers it', async () => {
    stubFetch([]);
    render(
      <I18nProvider>
        <MemoryRouter>
          <ConfigProvider>
            <AuthProvider>
              <SiteHeader />
            </AuthProvider>
          </ConfigProvider>
        </MemoryRouter>
      </I18nProvider>,
    );
    expect(screen.getByRole('link', { name: 'How it works' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), { target: { value: 'fr' } });
    expect(await screen.findByRole('link', { name: 'Comment ça marche' })).toBeInTheDocument();
    expect(localStorage.getItem('vernissage.locale')).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');

    // The picker relabels itself in the new language.
    fireEvent.change(screen.getByRole('combobox', { name: 'Langue' }), { target: { value: 'uk' } });
    await waitFor(() => expect(screen.getByRole('link', { name: 'Як це працює' })).toBeInTheDocument());
    expect(screen.getByRole('combobox', { name: 'Мова' })).toHaveValue('uk');
  });

  it('translates every sentence-length string', () => {
    // Short labels (CV, Audio, Galerie Nord, …) may legitimately match English.
    const english = new Map(leaves(en));
    for (const [name, dict] of [
      ['fr', fr],
      ['uk', uk],
    ] as const) {
      const untranslated = leaves(dict)
        .filter(([path, text]) => text.length > 24 && english.get(path) === text)
        .map(([path]) => path);
      expect(untranslated, `${name}: still in English`).toEqual([]);
      expect(leaves(dict).filter(([, text]) => text.trim() === ''), `${name}: empty strings`).toEqual([]);
    }
  });
});
