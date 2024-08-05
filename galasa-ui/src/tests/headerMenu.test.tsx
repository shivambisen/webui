import { render, screen, fireEvent, waitFor, act, getByTestId } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PageHeaderMenu from '@/components/PageHeaderMenu';
import PageHeader from '@/components/PageHeader';
import React, { useState } from 'react';
import { ToastNotification } from '@carbon/react';

const fetchMock = jest.spyOn(global, 'fetch')

let setState : any;
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}))

const mockRouter = {
    refresh : jest.fn(() => useRouter().refresh),
};

jest.mock('next/navigation', () => ({

    useRouter: jest.fn(() => mockRouter),

}))

beforeEach(() => {
    setState = jest.fn();
    (React.useState as jest.Mock).mockImplementation((initialState) => [initialState, setState]);
})

afterEach(() => {
    jest.clearAllMocks()

})


test('renders the header containing the header menu', () => {

    render(<PageHeader galasaServiceName='Galasa Service'/>)

    const headerMenu = screen.getByTestId('header-menu')
    expect(headerMenu).toBeInTheDocument()

})

test('checking if the menu btn exists', () => {
    render(<PageHeaderMenu/>)

    const menuBtn = screen.getByTestId('menu-btn')
    expect(menuBtn).toBeInTheDocument()
})

test('renders logout btn when menu btn is pressed', async () => {

    render(<PageHeaderMenu/>)

    fireEvent.click(screen.getByTestId('menu-btn'))

    const logoutBtn = screen.getByTestId('logout-btn')

    expect(logoutBtn).toBeInTheDocument();
})

test('clicking log out button calls handleDeleteCookieApiOperation, RESPONSE OK', async () => {

    render(<PageHeaderMenu/>)

    const response = new Response(null, {
        status: 204,
        statusText: 'OK',
        headers: {
          'Content-type': 'application/json',
        },
    });

    fetchMock.mockResolvedValueOnce(response)

    fireEvent.click(screen.getByTestId('menu-btn'))  //expanding the menu items

    const logoutBtn = screen.getByTestId('logout-btn')

    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn)

    await waitFor(() => {

        
        expect(fetchMock).toBeCalledTimes(1)

        expect(mockRouter.refresh).toHaveBeenCalled()
        expect(mockRouter.refresh).toHaveBeenCalledTimes(1)

    })

    
})

it('displays an error message when DELETE request fails with STATUS 500', async () => {

    
    fetchMock.mockRejectedValueOnce(new Error('Fetch Error'));
    
    render(<PageHeaderMenu />);
    
    fireEvent.click(screen.getByTestId('menu-btn'))  //expanding the menu items
    
    const logoutBtn = screen.getByTestId('logout-btn')

    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn)
    
    await waitFor(() => {
        expect(setState).toBeCalledWith(true)
        expect(mockRouter.refresh).not.toBeCalled()
       
    });

});

