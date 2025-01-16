/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { render, screen, waitFor } from '@testing-library/react';
import MyProfilePage from '../app/myprofile/page';
import { RoleBasedAccessControlAPIApi, UsersAPIApi } from '@/generated/galasaapi';

const mockUsersApi = UsersAPIApi as jest.Mock;
const mockRbacApi = RoleBasedAccessControlAPIApi as jest.Mock;

jest.mock('@/generated/galasaapi');

describe('MyProfilePage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    render(<MyProfilePage />);

    // Assert that the loading spinner is shown initially
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  test('fetches and displays user data', async () => {
    const expectedLoginId = 'testuser';
    const expectedRoleName = 'tester';
    mockUsersApi.mockReturnValue({
      getUserByLoginId: jest.fn().mockResolvedValue([{
        loginId: expectedLoginId,
        role: '1',
      }]),
    });

    mockRbacApi.mockReturnValue({
      getRBACRole: jest.fn().mockResolvedValue({
        apiVersion: 'v1',
        kind: 'GalasaRole',
        metadata: {
          id: '1',
          name: expectedRoleName,
        },
        data: {},
      }),
    });
    render(<MyProfilePage />);

    // Wait for the data to be fetched and the loading spinner to disappear
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

    // Assert that the user's login ID is displayed correctly
    expect(screen.getByText(`Currently logged in as: ${expectedLoginId}`)).toBeInTheDocument();
    expect(screen.getByText(`Role: ${expectedRoleName}`)).toBeInTheDocument();
  });

  test('handles fetch failure gracefully', async () => {
    mockUsersApi.mockReturnValue({
      getUserByLoginId: jest.fn().mockRejectedValue(new Error('Something went wrong!')),
    });

    render(<MyProfilePage />);

    // Wait for the fetch operation to complete
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

    // Assert that no user data is displayed
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});
