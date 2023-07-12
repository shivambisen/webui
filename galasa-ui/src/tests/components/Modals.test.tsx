/*
 * Copyright contributors to the Galasa project
 */
import TokenRequestModal from '@/components/Modals';
import { render, screen } from '@testing-library/react';

beforeEach (()=>{
  render(<TokenRequestModal openState={false} submitState={false} />);
});

test('renders Galasa Modal Token Request', () => {
  const buttonElement = screen.getByText(/Request Access Token/i);
  const requestModalElement = screen.getByText(/Request a new Personal Access Token/i);
  const responseModalElement = screen.getByText(/Your new access token is:/i);
  expect(buttonElement).toBeInTheDocument();
  expect(requestModalElement).toBeInTheDocument();
  expect(responseModalElement).toBeInTheDocument();
});

test('renders Galasa Modal Token Request Submit Modal Open', () => {
  const buttonElement = screen.getByText(/Request Access Token/i);
  screen.
  const requestModalElement = screen.getByText(/Request a new Personal Access Token/i);
  const responseModalElement = screen.getByText(/Your new access token is:/i);
  expect(buttonElement).toBeInTheDocument();
  expect(requestModalElement).toBeInTheDocument();
  expect(responseModalElement).toBeInTheDocument();
});

test('renders Galasa Modal Token Request Response Modal Open', () => {
  const buttonElement = screen.getByText(/Request Access Token/i);
  const requestModalElement = screen.getByText(/Request a new Personal Access Token/i);
  const responseModalElement = screen.getByText(/Your new access token is:/i);
  expect(buttonElement).toBeInTheDocument();
  expect(requestModalElement).toBeInTheDocument();
  expect(responseModalElement).toBeInTheDocument();
});