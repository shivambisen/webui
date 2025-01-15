/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import HomeContent from '@/components/HomeContent';

afterEach(() => {
  jest.resetAllMocks();
});

test('renders markdown content', async () => {
  const mockMarkdownContent = Promise.resolve("# Mocked Markdown Content This is a test");
  render(<HomeContent markdownContentPromise={mockMarkdownContent} />);
  const content = await screen.findByText('Mocked Markdown Content This is a test');
  expect(content).toBeInTheDocument();
});

test("render home content title", async () => {
  const mockMarkdownContent = Promise.resolve("# Mocked Markdown Content This is a test");
  render(<HomeContent markdownContentPromise={mockMarkdownContent} />);

  await act(async () => {
    // Simulate the useEffect hook
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  const title = screen.getByText("Mocked Markdown Content This is a test");

  expect(title).toBeInTheDocument();
});

test("render home content sub-title", async () => {
  const mockMarkdownContent = Promise.resolve(`
# This is a title
## This is a subtitle
  `);
  render(<HomeContent markdownContentPromise={mockMarkdownContent} />);

  await act(async () => {
    // Simulate the useEffect the useEffect hook
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  const subTitle = screen.getByText("This is a subtitle");

  expect(subTitle).toBeInTheDocument();
});
