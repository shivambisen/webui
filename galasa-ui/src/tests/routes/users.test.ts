/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import * as UsersRoute from "@/app/users/route"
import { NextResponse } from 'next/server';
import { getUserApiClientWithAuthHeader } from '@/utils/user';


// Mock the dependencies
jest.mock('@/utils/user', () => ({
    getUserApiClientWithAuthHeader: jest.fn(),
}));

describe('GET /users', () => {

    it('should return the loginId of the user with status 200', async () => {
        // Arrange
        const mockLoginId = 'mockUser';
        const mockResponse = [{ loginId: mockLoginId }];
        const mockUserApiClient = {
            getUserByLoginId: jest.fn().mockResolvedValue(mockResponse),
        };

        // Mock the getUserApiClientWithAuthHeader to return the mockUserApiClient
        (getUserApiClientWithAuthHeader as jest.Mock).mockReturnValue(mockUserApiClient);

        // Act
        const result = await UsersRoute.GET();

        // Assert
        expect(getUserApiClientWithAuthHeader).toHaveBeenCalled();
        expect(mockUserApiClient.getUserByLoginId).toHaveBeenCalledWith('me');
        expect(result).toEqual(new NextResponse(mockLoginId, { status: 200 }));
    });

    it('should throw an error if the userApiClient fails', async () => {
        // Arrange
        const mockError = new Error('Failed to get login id of user');
        const mockUserApiClient = {
            getUserByLoginId: jest.fn().mockRejectedValue(mockError),
        };

        // Mock the getUserApiClientWithAuthHeader to return the mockUserApiClient
        (getUserApiClientWithAuthHeader as jest.Mock).mockReturnValue(mockUserApiClient);

        // Act & Assert
        await expect(UsersRoute.GET()).rejects.toThrow('Failed to get login id of user');
    });

})