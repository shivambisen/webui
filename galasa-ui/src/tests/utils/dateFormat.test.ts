/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { convertDisplayFormatToFlatpickr } from '@/utils/dateFormat';

describe('convertDisplayFormatToFlatpickr', () => {
  it('should convert the common US format (MM/DD/YYYY)', () => {
    expect(convertDisplayFormatToFlatpickr('MM/DD/YYYY')).toBe('m/d/Y');
  });

  it('should convert a common European format (DD/MM/YYYY)', () => {
    expect(convertDisplayFormatToFlatpickr('DD/MM/YYYY')).toBe('d/m/Y');
  });

  it('should convert a format with different separators (YYYY-MM-DD)', () => {
    expect(convertDisplayFormatToFlatpickr('YYYY-MM-DD')).toBe('Y-m-d');
  });

  it('should handle formats with other text', () => {
    expect(convertDisplayFormatToFlatpickr('Date: DD.MM.YYYY')).toBe('Date: d.m.Y');
  });

  it('should return an empty string if given an empty string', () => {
    expect(convertDisplayFormatToFlatpickr('')).toBe('');
  });

  it('should not change a string with no matching tokens', () => {
    expect(convertDisplayFormatToFlatpickr('Test')).toBe('Test');
  });
});