/*
 * Copyright contributors to the Galasa project
 */
import PageHeader from '@/components/PageHeader';
import { render, screen } from '@testing-library/react';

test('renders Galasa Ecosystem header', () => {
  render(<PageHeader />);
  const titleElement = screen.getByText(/Galasa Ecosystem/i);
  expect(titleElement).toBeInTheDocument();
});
