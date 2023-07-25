/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import TokenResponseModal from '@/components/TokenResponseModal';
import { act, fireEvent, render, screen } from '@testing-library/react';

describe('Token response modal', () => {
  it('renders invisible token response modal', async () => {
    // Given...
    await act(async () => {
      return render(<TokenResponseModal refreshToken='' />);
    });
    const responseModalElement = screen.getByRole('presentation');

    // Then...
    expect(responseModalElement).toBeInTheDocument();
    expect(responseModalElement).not.toHaveClass('is-visible');
  });

  it('becomes visible when a refresh token is provided', async () => {
    // Given...
    await act(async () => {
      return render(<TokenResponseModal refreshToken='dummytoken' />);
    });
    const responseModalElement = screen.getByRole('presentation');

    // Then...
    expect(responseModalElement).toBeInTheDocument();
    expect(responseModalElement).toHaveClass('is-visible');
  });

  it('becomes invisible when the "Close" button is clicked', async () => {
    // Given...
    await act(async () => {
      return render(<TokenResponseModal refreshToken='dummytoken' />);
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
