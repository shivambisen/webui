/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { getClientApiVersion, getServiceHealthStatus } from '@/app/actions/healthActions';
import Footer from '@/components/Footer';
import { render, screen, waitFor } from '@testing-library/react';
import styles from "@/styles/Footer.module.css";

jest.mock('@/app/actions/healthActions', () => ({
  getServiceHealthStatus: jest.fn(),
  getClientApiVersion:     jest.fn(),
}));

test('renders the footer', () => {

  render(<Footer/>);

  const footer = screen.getByRole('footer');
  expect(footer).toBeInTheDocument();
  
});

test('renders the footer with matching client api version', async () => {
  (getServiceHealthStatus as jest.Mock).mockResolvedValue(true);
  (getClientApiVersion    as jest.Mock).mockResolvedValue("0.37.0");

  const {container} = render(<Footer/>);

  const version = await screen.findByText(/0\.37\.0/);
  expect(version).toBeInTheDocument();

  //Check the correct color div was rendered -> should render green dot
  expect(container.querySelector(`.${styles.healthy}`)).toBeInTheDocument();
  expect(container.querySelector(`.${styles.error}`)).not.toBeInTheDocument();

});

test('renders the footer with bad service health', async () => {
  (getServiceHealthStatus as jest.Mock).mockResolvedValue(false);
  (getClientApiVersion    as jest.Mock).mockResolvedValue("0.41.0");

  const {container} = render(<Footer/>);

  //Dont render version if the service is bad
  await waitFor(() => {
    expect(screen.queryByText(/Galasa Version/)).toBeNull();
  });

  //Check the correct color div was rendered -> should render red dot
  expect(container.querySelector(`.${styles.healthy}`)).not.toBeInTheDocument();
  expect(container.querySelector(`.${styles.error}`)).toBeInTheDocument();
});