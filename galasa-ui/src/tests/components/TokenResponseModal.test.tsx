/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import TokenResponseModal from '@/components/TokenResponseModal';
import { act, fireEvent, render, screen } from '@testing-library/react';


describe('Token response modal', () => {
  it('renders invisible token response modal if all properties are empty', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          refreshToken: '',
          clientId: '',
        }),
      })
    ) as jest.Mock;

    // Given...
    await act(async () => {
      return render(<TokenResponseModal />);
    });
    const responseModalElement = screen.getByRole('presentation');

    // Then...
    expect(responseModalElement).toBeInTheDocument();
    expect(responseModalElement).not.toHaveClass('is-visible');
  });

  it('renders invisible token response modal if the clientId property is empty', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          refreshToken: 'mcokRefreshToken',
          clientId: '',
        }),
      })
    ) as jest.Mock;

    // Given...
    await act(async () => {
      return render(<TokenResponseModal/>);
    });
    const responseModalElement = screen.getByRole('presentation');

    // Then...
    expect(responseModalElement).toBeInTheDocument();
    expect(responseModalElement).not.toHaveClass('is-visible');
  });

  it('renders invisible token response modal if the refreshToken property is empty', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          refreshToken: '',
          clientId: 'mockClientId',
        }),
      })
    ) as jest.Mock;

    // Given...
    await act(async () => {
      return render(<TokenResponseModal />);
    });
    const responseModalElement = screen.getByRole('presentation');

    // Then...
    expect(responseModalElement).toBeInTheDocument();
    expect(responseModalElement).not.toHaveClass('is-visible');
  });

  it('becomes visible when all required properties are provided', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          refreshToken: 'mockRefreshToken',
          clientId: 'mockClientId',
        }),
      })
    ) as jest.Mock;

    // Given...
    await act(async () => {
      return render(<TokenResponseModal />);
    });
    const responseModalElement = screen.getByRole('presentation');

    // Then...
    expect(responseModalElement).toBeInTheDocument();
    expect(responseModalElement).toHaveClass('is-visible');
  });

  it('becomes invisible when the "Close" button is clicked', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          refreshToken: 'mockRefreshToken',
          clientId: 'mockClientId',
        }),
      })
    ) as jest.Mock;

    // Given...
    await act(async () => {
      return render(<TokenResponseModal />);
    });
    const modalCloseButtonElement = screen.getByLabelText(/close/i);
    const responseModalElement = screen.getByRole('presentation');

    // When...
    expect(responseModalElement).toHaveClass('is-visible');

    fireEvent.click(modalCloseButtonElement);

    // Then...
    expect(responseModalElement).not.toHaveClass('is-visible');
  });
});
