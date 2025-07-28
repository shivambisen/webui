/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

/**
 * Converts a user-friendly date format string (e.g., 'MM/DD/YYYY')
 * into the format required by the Flatpickr library (e.g., 'm/d/Y').
 * @param {string} displayFormat - The date format string to convert. For example, 'MM/DD/YYYY' or 'DD/MM/YYYY'.
 * @returns {string} The converted format string for Flatpickr. For example, 'm/d/Y' or 'd/m/Y'.
 */
export const convertDisplayFormatToFlatpickr = (displayFormat: string): string => {
  return displayFormat
    .replace(/MM/g, 'm')
    .replace(/DD/g, 'd')
    .replace(/YYYY/g, 'Y');
};