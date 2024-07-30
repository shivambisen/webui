/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import RootLayout from '@/app/layout';
import PageHeader from '@/components/PageHeader';
import { act, render, screen } from '@testing-library/react';

describe('Layout', () => {
  it('renders the web UI layout', () => {
    const layout = render(<RootLayout>Hello, world!</RootLayout>);
    expect(layout).toMatchSnapshot();
  });
});

afterEach(() => {
  delete process.env.GALASA_SERVICE_NAME
})

test('renders Galasa Service title when env NEXT_PUBLIC_GALASA_SERVICE_NAME is null or blank string', () => {

  process.env.GALASA_SERVICE_NAME = "";  //mocking environment variable

  render(<RootLayout>
    Hello, world!
  </RootLayout>);

  const titleElement = document.querySelector('title')?.textContent
  expect(titleElement).toBe("Galasa Service")


});

test('renders custom title when env NEXT_PUBLIC_GALASA_SERVICE_NAME is not present (not null or blank)', () => {

  process.env.GALASA_SERVICE_NAME = 'Managers'; //mocking environment variable
  render(<RootLayout>Hello, world!</RootLayout>);

  const titleElement = document.querySelector('title')?.textContent


  expect(titleElement).not.toBe("Galasa Service")
  expect(titleElement).toBe("Managers")

});