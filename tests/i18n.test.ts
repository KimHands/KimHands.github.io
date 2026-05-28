import { describe, it, expect } from 'vitest';
import { ui } from '../src/i18n/ui';
describe('i18n dictionaries', () => {
  it('en has every key that ko has', () => {
    const koKeys = Object.keys(ui.ko).sort();
    const enKeys = Object.keys(ui.en).sort();
    expect(enKeys).toEqual(koKeys);
  });
});
