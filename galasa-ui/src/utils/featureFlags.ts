/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

// Centralized feature flags 
export const FEATURE_FLAGS = {
  TEST_RUNS: 'testRuns',
  INTERNATIONALIZATION: 'internationalization',
  THIRTY_TWO_SEVENTY_TERMINAL: 'thirtyTwoSeventyTerminal',
  GRAPH: 'graph',
  // Add other feature flags here
} as const;

export const DEFAULT_FEATURE_FLAGS = {
  testRuns: false, 
  internationalization: false,
  thirtyTwoSeventyTerminal: false,
  graph: false,
  // Add other feature flags here
} as const;