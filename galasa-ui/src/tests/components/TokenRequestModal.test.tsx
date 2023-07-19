/*
 * Copyright contributors to the Galasa project
 */
import TokenRequestModal from '@/components/TokenRequestModal';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

describe('Token request modal', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: { replace: jest.fn() },
    });
  });

  it('renders invisible token request modal', async () => {
    // Given...
    await act(async () => {
      return render(<TokenRequestModal />);
    });
    const buttonElement = screen.getByText(/Request Access Token/i);
    const requestModalElement = screen.getByRole('presentation');

    // Then...
    expect(requestModalElement).not.toHaveClass('is-visible');
    expect(buttonElement).toBeInTheDocument();
    expect(requestModalElement).toBeInTheDocument();
  });

  it('becomes visible when the "Request Access Token" button is clicked', async () => {
    // Given...
    await act(async () => {
      return render(<TokenRequestModal />);
    });
    const buttonElement = screen.getByText(/Request Access Token/i);
    const requestModalElement = screen.getByRole('presentation');

    // When...
    fireEvent.click(buttonElement);

    // Then...
    expect(requestModalElement).toHaveClass('is-visible');
  });

  it('becomes invisible when the "Cancel" button is clicked', async () => {
    // Given...
    await act(async () => {
      return render(<TokenRequestModal />);
    });
    const openModalButtonElement = screen.getByText(/Request Access Token/i);
    const modalCancelButtonElement = screen.getByText(/Cancel/i);
    const requestModalElement = screen.getByRole('presentation');

    // When...
    fireEvent.click(openModalButtonElement);
    expect(requestModalElement).toHaveClass('is-visible');

    fireEvent.click(modalCancelButtonElement);

    // Then...
    expect(requestModalElement).not.toHaveClass('is-visible');
  });

  it('sends request for a new personal access token on submit', async () => {
    // Given...
    // Mock out the fetch function and its json() method
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ url: '/auth/token' }),
      })
    ) as jest.Mock;

    await act(async () => {
      return render(<TokenRequestModal />);
    });
    const openModalButtonElement = screen.getByText(/Request Access Token/i);
    const modalSubmitButtonElement = screen.getByText(/Submit/i);
    const modalNameInputElement = screen.getByLabelText(/Token Name/i);
    const modalSecretInputElement = screen.getByLabelText(/Secret/i);

    // When...
    fireEvent.click(openModalButtonElement);
    fireEvent.input(modalNameInputElement, { target: { value: 'dummy' } });
    fireEvent.input(modalSecretInputElement, { target: { value: 'shhh' } });
    fireEvent.click(modalSubmitButtonElement);

    // Then...
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(window.location.replace).toHaveBeenCalledWith('/auth/token');
    jest.clearAllMocks();
  });

  it('renders an error notification when a token request returns an error', async () => {
    // Given...
    // Mock out the fetch function and its json() method
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ url: '/', error: 'this is an error!' }),
      })
    ) as jest.Mock;

    await act(async () => {
      render(<TokenRequestModal />);
    });
    const openModalButtonElement = screen.getByText(/Request Access Token/i);
    const modalSubmitButtonElement = screen.getByText(/Submit/i);
    const modalNameInputElement = screen.getByLabelText(/Token Name/i);
    const modalSecretInputElement = screen.getByLabelText(/Secret/i);

    // The error notification should not exist yet
    const errorMessage = /error requesting access token/i
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    // When...
    await act(async () => {
      fireEvent.click(openModalButtonElement);
      fireEvent.input(modalNameInputElement, { target: { value: 'dummy' } });
      fireEvent.input(modalSecretInputElement, { target: { value: 'shhh' } });
      fireEvent.click(modalSubmitButtonElement);
    })

    // Then...
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const errorNotificationElement = screen.getByText(errorMessage);
    expect(errorNotificationElement).toBeInTheDocument();

    jest.clearAllMocks();
  });

  it('closes the error notification when the user clicks the close icon on the notification', async () => {
    // Given...
    // Mock out the fetch function and its json() method
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ url: '/', error: 'this is an error!' }),
      })
    ) as jest.Mock;

    await act(async () => {
      render(<TokenRequestModal />);
    });
    const openModalButtonElement = screen.getByText(/Request Access Token/i);
    const modalSubmitButtonElement = screen.getByText(/Submit/i);
    const modalNameInputElement = screen.getByLabelText(/Token Name/i);
    const modalSecretInputElement = screen.getByLabelText(/Secret/i);

    // The error notification should not exist yet
    const errorMessage = /error requesting access token/i
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    // When...
    await act(async () => {
      fireEvent.click(openModalButtonElement);
      fireEvent.input(modalNameInputElement, { target: { value: 'dummy' } });
      fireEvent.input(modalSecretInputElement, { target: { value: 'shhh' } });
      fireEvent.click(modalSubmitButtonElement);
    })

    // Then...
    // The error notification should be visible
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const errorNotificationElement = screen.getByText(errorMessage);
    expect(errorNotificationElement).toBeInTheDocument();

    // Clicking the close notification button should remove the error notification
    const errorNotificationCloseButtonElement = screen.getByLabelText(/close notification/i);
    fireEvent.click(errorNotificationCloseButtonElement);
    expect(errorNotificationElement).not.toBeInTheDocument();

    jest.clearAllMocks();
  });
});
