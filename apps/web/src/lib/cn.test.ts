import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges truthy class values', () => {
    expect(cn('flex', false, 'gap-2')).toBe('flex gap-2');
  });
});
