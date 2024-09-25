/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { cookies } from 'next/headers';
import { GET, DELETE } from '../../app/cookies/route';
import AuthCookies from '@/utils/authCookies';

jest.mock('../../utils/api');
jest.mock('@/generated/galasaapi');

const deleteMock = jest.fn();

// Mock out the cookies() functions in the "next/headers" module
jest.mock('next/headers', () => ({
    ...jest.requireActual('next/headers'),
    cookies: jest.fn(() => ({
        get: jest.fn().mockReturnValue('abc'),
        delete: deleteMock
    })),
}));



describe('/cookies route tests', () => {

    it('should successfully delete the cookies and return 200', async () => {

        const response = await DELETE()

        expect(deleteMock).toBeCalledWith(AuthCookies.CLIENT_ID);
        expect(deleteMock).toBeCalledWith(AuthCookies.REFRESH_TOKEN)
        expect(deleteMock).toBeCalledTimes(2)

        expect(response.status).toBe(200);

    })

    it('should successfully get the cookies and return 200', async () => {

        jest.mock('next/server', () => ({
            NextResponse: {
                json: jest.fn().mockReturnValue({
                    status: 200,
                    json: () => ({ clientId: 'mockClientId', refreshToken: 'mockRefreshToken' })
                })
            }
        }));

        const response = await GET()

        expect(response.status).toBe(200);

    })

})