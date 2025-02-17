/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UserRoleSection from '../../components/users/UserRoleSection';
import { UserData } from '@/generated/galasaapi';
import { updateUserRoleAction } from '@/app/actions/updateUserRoleAction';

// --- Mocks for Carbon Components --- //
jest.mock('@carbon/react', () => ({
  ButtonSet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: (props: any) => <button {...props}>{props.children}</button>,
  Dropdown: (props: any) => (
    // A simple select element that calls onChange with the selected item.
    <select
      data-testid="dropdown"
      onChange={(e) =>
        props.onChange({ selectedItem: props.items[Number(e.target.value)] })
      }
    >
      {props.items.map((item: any, index: number) => (
        <option key={item.id} value={index}>
          {item.name}
        </option>
      ))}
    </select>
  ),
  Loading: (props: any) => <div data-testid="loading">Loading...</div>,
  InlineNotification: (props: any) => (
    <div data-testid="notification">{props.title}</div>
  ),
}));

jest.mock('@/app/actions/updateUserRoleAction', () => ({
  updateUserRoleAction: jest.fn(),
}));

// --- Dummy Data --- //
const dummyProfile: UserData = {
  id: '123',
  loginId: 'testuser',
  synthetic: {
    role: {
      metadata: {
        id: '1',
        name: 'tester',
        description: 'Test developer and runner',
      },
    },
  },
};

describe('UserRoleSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading indicator while waiting for user profile', async () => {
    jest.useFakeTimers();

    const userProfilePromise = new Promise<UserData>((resolve) => {
      setTimeout(() => resolve(dummyProfile), 1000);
    });

    render(<UserRoleSection userProfilePromise={userProfilePromise} />);
    // Initially, the loading indicator should be visible.
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Fast-forward timers to resolve the promise.
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Wait for the user profile details to appear.
    await waitFor(() => {
      expect(screen.getByText(dummyProfile.loginId!)).toBeInTheDocument();
    });
    jest.useRealTimers();
  });

  test('displays error page if userProfilePromise rejects', async () => {
    // Suppress error logging.
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const errorPromise = Promise.reject('Error');

    render(<UserRoleSection userProfilePromise={errorPromise} />);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  test('renders user profile details after successful load', async () => {
    render(<UserRoleSection userProfilePromise={Promise.resolve(dummyProfile)} />);

    await waitFor(() => {
      expect(screen.getByText(dummyProfile.loginId!)).toBeInTheDocument();
    });
    // Also check for a header that is part of the component.
    expect(screen.getByText('User Role')).toBeInTheDocument();
  });

  test('enables reset and save buttons when role is changed', async () => {
    render(<UserRoleSection userProfilePromise={Promise.resolve(dummyProfile)} />);

    await waitFor(() => {
      expect(screen.getByText(dummyProfile.loginId!)).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Reset') as HTMLButtonElement;
    const saveButton = screen.getByText('Save') as HTMLButtonElement;
    // Initially, both buttons are disabled.
    expect(resetButton).toBeDisabled();
    expect(saveButton).toBeDisabled();

    // Change the dropdown selection to a different role.
    // In our mock, "tester" is at index 0 and "admin" is at index 1.
    const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
    fireEvent.change(dropdown, { target: { value: '1' } });

    // Now the buttons should be enabled.
    expect(resetButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
  });

  test('save button calls updateUserRoleAction and shows success notification on successful update', async () => {

    // Type-cast the mocked server action.
    const mockUpdateUserRoleAction = updateUserRoleAction as jest.Mock;
    // Simulate a successful response.
    mockUpdateUserRoleAction.mockResolvedValue({ status: 200, message: 'User role updated successfully' });
  
    render(<UserRoleSection userProfilePromise={Promise.resolve(dummyProfile)} />);
    
    // Wait for the component to display the user profile.
    await waitFor(() => {
      expect(screen.getByText(dummyProfile.loginId!)).toBeInTheDocument();
    });
  
    const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
    const saveButton = screen.getByText('Save') as HTMLButtonElement;
  
    // Change the dropdown selection to "admin" (index 1).
    // In the component's items array, index 1 corresponds to:
    // { id: "2", name: "admin", description: "Administrator access" }
    fireEvent.change(dropdown, { target: { value: '1' } });
  
    // Click the save button.
    fireEvent.click(saveButton);
  
    // Wait for the server action to be called with the expected payload.
    await waitFor(() => {
      expect(mockUpdateUserRoleAction).toHaveBeenCalledWith({
        userNumber: dummyProfile.id,
        roleDetails: { role: '2' },
      });
    });
  
    // Wait for the success notification to appear.
    await waitFor(() => {
      expect(screen.getByTestId('notification')).toBeInTheDocument();
      expect(screen.getByTestId('notification')).toHaveTextContent('Success');
    });
  
    // After a successful update, both buttons should be disabled.
    expect(saveButton).toBeDisabled();
    const resetButton = screen.getByText('Reset') as HTMLButtonElement;
    expect(resetButton).toBeDisabled();
  });

  test('resetRole resets the role state and disables reset and save buttons', async () => {
    render(<UserRoleSection userProfilePromise={Promise.resolve(dummyProfile)} />);
    
    await waitFor(() => expect(screen.getByText(dummyProfile.loginId!)).toBeInTheDocument());
    
    const resetButton = screen.getByText('Reset') as HTMLButtonElement;
    const saveButton = screen.getByText('Save') as HTMLButtonElement;
    const dropdown = screen.getByTestId('dropdown') as HTMLSelectElement;
  
    expect(resetButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  
    // Simulate changing the role via the dropdown.
    // In our Dropdown mock, changing the value to '1' selects the item at index 1.
    fireEvent.change(dropdown, { target: { value: '1' } });
    
    // After a change, the buttons should be enabled.
    expect(resetButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
  
    // Now simulate clicking the reset button.
    fireEvent.click(resetButton);
  
    // After resetting, both buttons should be disabled.
    expect(resetButton).toBeDisabled();
    expect(saveButton).toBeDisabled();

    // Verify if the role name was reverted to original value
    expect(screen.getByText(dummyProfile.synthetic?.role?.metadata?.name!)).toBeInTheDocument();
  });

  test('displays error page if updateUserRole fetch fails', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed'));
    (global.fetch as jest.Mock) = mockFetch;

    render(<UserRoleSection userProfilePromise={Promise.reject(dummyProfile)} />);
    
    // When the fetch fails, the component sets isError to true and renders the ErrorPage.
    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });
});
