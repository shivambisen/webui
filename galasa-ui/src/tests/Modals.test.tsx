/*
 * Copyright contributors to the Galasa project
 */
import TokenRequestModal from '@/components/Modals';
import { render, screen } from '@testing-library/react';

test('renders Galasa Modal Token Request', () => {
  render(<TokenRequestModal />);
  const buttonElement = screen.getByText(/Request Access Token/i);
  const requestModalElement = screen.getByText(/Request a new Personal Access Token/i);
  const responseModalElement = screen.getByText(/Your new access token is:/i);
  expect(buttonElement).toBeInTheDocument();
  expect(requestModalElement).toBeInTheDocument();
  expect(responseModalElement).toBeInTheDocument();
});
