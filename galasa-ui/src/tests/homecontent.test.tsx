/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import HomeContent from '@/components/HomeContent';
import { useRouter } from 'next/navigation';

// Mock out the native time functions to so that we can control time as needed
jest.useFakeTimers();

afterEach(() => {
  jest.resetAllMocks();
});

const mockRouter = {
  refresh: jest.fn(() => useRouter().refresh)
};

jest.mock('next/navigation', () => ({

  useRouter: jest.fn(() => mockRouter),

}));

test('renders markdown content', async () => {
  // Given...
  const mockMarkdownContent = Promise.resolve("# Mocked Markdown Content This is a test");

  // When...
  render(<HomeContent markdownContentPromise={mockMarkdownContent} />);

  // Then...
  const content = await screen.findByText('Mocked Markdown Content This is a test');
  expect(content).toBeInTheDocument();
});

test("render home content title", async () => {
  // Given...
  const mockMarkdownContent = Promise.resolve("# Mocked Markdown Content This is a test");
  
  // When...
  render(<HomeContent markdownContentPromise={mockMarkdownContent} />);
  await act(async () => {
    jest.advanceTimersByTime(1000);
  });

  // Then...
  const title = screen.getByText("Mocked Markdown Content This is a test");

  expect(title).toBeInTheDocument();
  expect(title).toBeInstanceOf(HTMLHeadingElement);
  expect(title.tagName).toBe("H1");
});

test("render home content sub-title", async () => {
  // Given...
  const mockMarkdownContent = Promise.resolve(`
# This is a title
## This is a subtitle
  `);

  // When...
  render(<HomeContent markdownContentPromise={mockMarkdownContent} />);

  await act(async () => {
    jest.advanceTimersByTime(1000);
  });

  // Then...
  const subtitle = screen.getByText("This is a subtitle");

  expect(subtitle).toBeInTheDocument();
  expect(subtitle).toBeInstanceOf(HTMLHeadingElement);
  expect(subtitle.tagName).toBe("H2");
});
