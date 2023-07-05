/*
 * Copyright contributors to the Galasa project
 */
import HomePage from '@/app/page';
import { render, screen } from '@testing-library/react';

test('renders Galasa Ecosystem homepage', () => {
  render(<HomePage />);
  const titleElement = screen.getByText(/Galasa/i);
  expect(titleElement).toBeInTheDocument();
});
