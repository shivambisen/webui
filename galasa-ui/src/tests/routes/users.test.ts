/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { UsersAPIApi } from '@/generated/galasaapi';
import { GET } from '../../app/users/route';
import { createAuthenticatedApiConfiguration } from '../../utils/api';

jest.mock('../../utils/api');
jest.mock('@/generated/galasaapi');


// Define the type for the mocked function
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
  
      mockedCreateAuthenticatedApiConfiguration.mockReturnValue(mockApiConfiguration as any);
      mockedUsersAPIApi.prototype.getUserByLoginId = jest.fn().mockResolvedValue(mockUserResponse);
      
    });
  
    it('should return the loginId with a 200 status code when successful', async () => {
      const result = await GET();
  
  
      expect(mockedCreateAuthenticatedApiConfiguration).toHaveBeenCalled();
      expect(mockedUsersAPIApi).toHaveBeenCalledWith(mockApiConfiguration);
      expect(result.status).toBe(200);
    });
  
    it('should throw an error if getUserByLoginId fails', async () => {
      mockedUsersAPIApi.prototype.getUserByLoginId = jest.fn().mockRejectedValue(new Error('API Error'));
  
      await expect(GET()).rejects.toThrow('Failed to get login id of user');
    });
  });