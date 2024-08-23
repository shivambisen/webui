/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { UsersAPIApi } from '@/generated/galasaapi';
import { GET } from '../../app/users/route';
import { getApiClientWithAuthHeader, createAuthenticatedApiConfiguration } from '../../utils/api';

jest.mock('../../utils/api');
jest.mock('@/generated/galasaapi');


// Define the type for the mocked function
const mockedGetApiClientWithAuthHeader = getApiClientWithAuthHeader as jest.MockedFunction<typeof getApiClientWithAuthHeader>;
const mockedCreateAuthenticatedApiConfiguration = createAuthenticatedApiConfiguration as jest.MockedFunction<typeof createAuthenticatedApiConfiguration>;
const mockedUsersAPIApi = UsersAPIApi as jest.MockedClass<typeof UsersAPIApi>;

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
      mockedGetApiClientWithAuthHeader.mockReturnValue(mockBearerToken);
      mockedCreateAuthenticatedApiConfiguration.mockReturnValue(mockApiConfiguration as any);
      mockedUsersAPIApi.prototype.getUserByLoginId = jest.fn().mockResolvedValue(mockUserResponse);
      
    });
  
    it('should return the loginId with a 200 status code when successful', async () => {
      const result = await GET();
  
      expect(mockedGetApiClientWithAuthHeader).toHaveBeenCalledTimes(1);
      expect(mockedCreateAuthenticatedApiConfiguration).toHaveBeenCalledWith(
        process.env.GALASA_API_SERVER_URL,
        mockBearerToken
      );
      expect(mockedUsersAPIApi).toHaveBeenCalledWith(mockApiConfiguration);
      expect(result.status).toBe(200);
    });
  
    it('should throw an error if getUserByLoginId fails', async () => {
      mockedUsersAPIApi.prototype.getUserByLoginId = jest.fn().mockRejectedValue(new Error('API Error'));
  
      await expect(GET()).rejects.toThrow('Failed to get login id of user');
    });
  
    it('should throw an error if getApiClientWithAuthHeader fails', async () => {
      mockedGetApiClientWithAuthHeader.mockImplementation(() => {
        throw new Error('Failed to get login id of user');
      });
  
      await expect(GET()).rejects.toThrow('Failed to get login id of user');
    });
  });