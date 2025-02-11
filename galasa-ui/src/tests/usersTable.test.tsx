/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UsersTable from '@/components/users/UsersTable';
import { UserData } from '@/generated/galasaapi';
import '@testing-library/jest-dom';

// ------------------------------
// Mocks
// ------------------------------

// Mock Carbon's Loading component to render a simple div.
jest.mock('@carbon/react', () => {
  const originalModule = jest.requireActual('@carbon/react');
  return {
    __esModule: true,
    ...originalModule,
    Loading: () => <div data-testid="loading">Loading...</div>
  };
});

// Mock the ErrorPage component.
jest.mock('@/app/error/page', () => {
  function ErrorPageMock() {
    return <div data-testid="error-page">Error Page</div>;
  }
  return ErrorPageMock;
});

// Mock the CSS module.
jest.mock('@/styles/UsersList.module.css', () => ({
  userListContainer: 'userListContainer'
}));

// ------------------------------
// Tests
// ------------------------------
describe('UsersTable component', () => {
  test('displays loading spinner while fetching data', async () => {
    // Create a promise that never resolves to simulate the loading state.
    const pendingPromise: Promise<UserData[]> = new Promise(() => {});
    render(<UsersTable usersListPromise={pendingPromise} />);
    
    // The Loading component should be rendered.
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('renders table with user data after promise resolves', async () => {
    // Sample user data with both "web-ui" and "rest-api" clients.
    const userData: UserData[] = [
      {
        id: '1',
        loginId: 'user1',
        synthetic: {
          role: {
            metadata: { name: 'admin' }
          }
        },
        clients: [
          {
            clientName: 'web-ui',
            lastLogin: new Date('2020-01-01T00:00:00Z')
          },
          {
            clientName: 'rest-api',
            lastLogin: new Date('2020-01-02T00:00:00Z')
          }
        ]
      }
    ];

    const resolvedPromise: Promise<UserData[]> = Promise.resolve(userData);
    render(<UsersTable usersListPromise={resolvedPromise} />);

    // Wait until the table header appears, indicating data has been loaded.
    await waitFor(() => {
      expect(screen.getByText('Login ID')).toBeInTheDocument();
    });

    // Check that the user data is rendered.
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();

    // Verify that the formatted dates are rendered.
    const formattedLastLogin = new Intl.DateTimeFormat('en-GB').format(new Date('2020-01-01T00:00:00Z'));
    const formattedLastAccessTokenUse = new Intl.DateTimeFormat('en-GB').format(new Date('2020-01-02T00:00:00Z'));
    expect(screen.getByText(formattedLastLogin)).toBeInTheDocument();
    expect(screen.getByText(formattedLastAccessTokenUse)).toBeInTheDocument();
  });

  test('renders "n/a" for missing client data', async () => {
    // User data with missing role and no client information.
    const userData: UserData[] = [
      {
        id: '1',
        loginId: 'user1',
        synthetic: {}, // No role provided.
        clients: []    // No client data provided.
      }
    ];

    const resolvedPromise: Promise<UserData[]> = Promise.resolve(userData);
    render(<UsersTable usersListPromise={resolvedPromise} />);

    // Wait for the table header to appear.
    await waitFor(() => {
      expect(screen.getByText('Login ID')).toBeInTheDocument();
    });

    // Check that the loginId is rendered.
    expect(screen.getByText('user1')).toBeInTheDocument();

    // Since role and client dates are missing, they should display "n/a".
    const naElements = screen.getAllByText('n/a');
    expect(naElements.length).toBeGreaterThanOrEqual(3);
  });

  test('handles promise rejection without showing error page (due to bug)', async () => {
    // Create a promise that rejects.
    const rejectedPromise: Promise<UserData[]> = new Promise((resolve, reject) => {
      reject(new Error('Failed to fetch'));
    });
    
    render(<UsersTable usersListPromise={rejectedPromise} />);

    // Due to the catch block (which sets isError to false), the table header is rendered even on error.
    await waitFor(() => {
      expect(screen.getByText('Login ID')).toBeInTheDocument();
    });

    // Verify that the error page is not rendered.
    expect(screen.queryByTestId('error-page')).not.toBeInTheDocument();
  });
});
