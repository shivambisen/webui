/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import MySettings from '@/app/mysettings/page';
import { UsersAPIApi } from '@/generated/galasaapi';
import { render, screen } from '@testing-library/react';
import { cookies } from 'next/headers';

// --- Mocks ---

jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn((name: string) => {
      if (name === 'CLIENT_ID') return { value: 'dummyClientId' };
      if (name === 'REFRESH_TOKEN') return { value: 'dummyRefreshToken' };
      return null;
    }),
    delete: jest.fn(),
  }),
}));


jest.mock('@/generated/galasaapi', () => {
  return {
    UsersAPIApi: jest.fn(),
  };
});

jest.mock('@/utils/api', () => ({
  createAuthenticatedApiConfiguration: () => ({}),
}));

jest.mock('@/app/actions/getUserAccessTokens', () => ({
  fetchAccessTokens: jest.fn().mockResolvedValue({ tokens: [] }),
}));

describe('MySettings Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ErrorPage when user login id is not found', async () => {
    const mockedGetUserByLoginId = jest.fn().mockResolvedValue([]);
    (UsersAPIApi as jest.Mock).mockImplementation(() => ({
      getUserByLoginId: mockedGetUserByLoginId,
    }));
  
    const Component = await MySettings();
    render(Component);

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });
  

  test('renders correctly when user login id is found', async () => {

    const fakeUser = { loginId: 'user123' };
    const mockedGetUserByLoginId = jest.fn().mockResolvedValue([fakeUser]);
    (UsersAPIApi as jest.Mock).mockImplementation(() => ({
      getUserByLoginId: mockedGetUserByLoginId,
    }));

    const result = await MySettings();
    expect(result).toMatchSnapshot();
  });
});
