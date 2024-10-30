/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { UsersAPIApi } from '@/generated/galasaapi';
import { DELETE, GET } from '../../app/users/route';
import { createAuthenticatedApiConfiguration } from '../../utils/api';
import * as Constants from "@/utils/constants";
import AuthCookies from '@/utils/authCookies';

jest.mock('../../utils/api');
jest.mock('@/generated/galasaapi');


// Define the type for the mocked function
const mockedCreateAuthenticatedApiConfiguration = createAuthenticatedApiConfiguration as jest.MockedFunction<typeof createAuthenticatedApiConfiguration>;
const mockedUsersAPIApi = UsersAPIApi as jest.MockedClass<typeof UsersAPIApi>;

const deleteMock = jest.fn();

// Mock out the cookies() functions in the "next/headers" module
jest.mock('next/headers', () => ({
  ...jest.requireActual('next/headers'),
  cookies: jest.fn(() => ({
    get: jest.fn().mockReturnValue('abc'),
    delete: deleteMock
  })),
}));

describe('GET function', () => {
  const mockBearerToken = 'mocked_bearer_token';
  const mockUserResponse = 'mocked_login_id';
  const mockApiConfiguration = {
    baseServer: { url: 'http://mock-server-url' }, // Mock the baseServer property
    httpApi: {}, // Mock the httpApi property (could be more detailed)
    middleware: [], // Mock the middleware array
    authMethods: {} // Mock the authMethods object
  };
  
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the API configuration creation
    mockedCreateAuthenticatedApiConfiguration.mockReturnValue(mockApiConfiguration as any);

    // Mock the getUserByLoginId method to return the mockUserResponse
    mockedUsersAPIApi.prototype.getUserByLoginId = jest.fn().mockResolvedValue([
      { loginId: mockUserResponse }
    ]);
  });
  
  
  it('should return the loginId with a 200 status code when successful', async () => {
    // Invoke the GET function without any arguments
    const result = await GET();

    // Access the response body correctly
    const bodyText = await result.text(); // Use .text() since the response is expected to be text

    // Assertions
    expect(mockedCreateAuthenticatedApiConfiguration).toHaveBeenCalled();
    expect(mockedUsersAPIApi.prototype.getUserByLoginId).toHaveBeenCalledWith(Constants.CLIENT_API_VERSION,"me");
    expect(mockedUsersAPIApi.prototype.getUserByLoginId).toHaveBeenCalledTimes(1); // Verify internal call
    expect(result.status).toBe(200); // Verify status code
    expect(bodyText).toBe(mockUserResponse); // Verify response body
  });
  
  it('should throw an error if getUserByLoginId fails', async () => {
    mockedUsersAPIApi.prototype.getUserByLoginId = jest.fn().mockRejectedValue(new Error('API Error'));
  
    await expect(GET()).rejects.toThrow('Failed to get login id of user');
  });
});

describe('DELETE /auth/tokens', () => {

  beforeEach(() => {
  
    jest.clearAllMocks();
  
  });
  
  it('Fetches cookies from headers, that are not null, GIVES 204 RESPONSE', async () => {
  
    const response = await DELETE();
  
    expect(deleteMock).toBeCalledWith(AuthCookies.ID_TOKEN);
    expect(deleteMock).toBeCalledWith(AuthCookies.SHOULD_REDIRECT_TO_SETTINGS);
    expect(deleteMock).toBeCalledTimes(2);
    expect(response.status).toBe(204);
  
  });
  
  
});