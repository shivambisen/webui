/*
 * Copyright contributors to the Galasa project
 */
import Sidebar from '@/components/Sidebar';
import { render, screen } from '@testing-library/react';

test('renders Galasa Modal Token Request', () => {
    render(<Sidebar />);
    const tokenManagementEelement = screen.getByText(/Token Management/i);
    const loginElement = screen.getByText(/You are logged in as:/i);
    const previousLoginElement = screen.getByText(/Previous login/i);
    const accessRolesElement = screen.getByText(/Your access roles:/i);
    expect(tokenManagementEelement).toBeInTheDocument();
    expect(loginElement).toBeInTheDocument();
    expect(previousLoginElement).toBeInTheDocument();
    expect(accessRolesElement).toBeInTheDocument();
  });