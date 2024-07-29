/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import HomePage from '@/app/page';
import PageHeader from '@/components/PageHeader';
import { act, render, screen } from '@testing-library/react';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn().mockReturnValue('')
  }))
}))


afterEach(() => {
    delete process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME
})

test('renders Galasa Service header title when env NEXT_PUBLIC_GALASA_SERVICE_NAME is null or blank string', () => {

    process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME = "";  //mocking environment variable
    render(<PageHeader />);
  
    const galasaServiceName = process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME?.trim() || "Galasa Service"
  
    const titleElement = screen.getByText("Galasa Service");
    expect(galasaServiceName).toBe("Galasa Service")
    expect(titleElement).toBeInTheDocument();

});

test('renders Galasa Service header title when env NEXT_PUBLIC_GALASA_SERVICE_NAME is a string with only spaces', () => {

    process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME = "        ";  //mocking environment variable
    render(<PageHeader />);
  
    const galasaServiceName = process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME?.trim() || "Galasa Service"
  
    const titleElement = screen.getByText("Galasa Service");
    expect(galasaServiceName).toBe("Galasa Service")
    expect(titleElement).toBeInTheDocument();

});

test('renders custom header when title when env NEXT_PUBLIC_GALASA_SERVICE_NAME is not present (not null or blank)', () => {

    process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME = 'Managers'; //mocking environment variable
    render(<PageHeader />);

    const galasaServiceName = process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME?.trim() || "Galasa Service"
  
    const titleElement = screen.getByText(galasaServiceName);
    expect(galasaServiceName).not.toBe("Galasa Service")
    expect(galasaServiceName).toBe(galasaServiceName)
    expect(titleElement).toBeInTheDocument();

});