/*
 * Copyright contributors to the Galasa project
 */
import TokenRequestModal from '@/components/TokenRequestModal';
import { render, screen } from '@testing-library/react';

beforeEach (()=>{
  render(<TokenRequestModal openState={false} />);
});

test('renders Galasa Modal Token Request', () => {
  const buttonElement = screen.getByText(/Request Access Token/i);
  const requestModalElement = screen.getByText(/Request a new Personal Access Token/i);
  expect(buttonElement).toBeInTheDocument();
  expect(requestModalElement).toBeInTheDocument();
});
