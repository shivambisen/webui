/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import RootLayoutInner from '@/app/layout-inner';
import { act, render } from '@testing-library/react';
import { useRouter } from 'next/navigation';

const mockRouter = {
  refresh: jest.fn(() => useRouter().refresh),
};

const mockGetBootstrapFunc = jest.fn().mockReturnValue(Promise.resolve('dummy bootstrap'));

const mockGetOpenApiSpecFunc = jest.fn().mockReturnValue(
  Promise.resolve({
    info: {
      version: "my-galasa-version",
    }
  })
);

jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string, vars?: Record<string, any>) => {
    switch (key) {
    case 'profile': return 'My Profile';
    case 'settings': return 'My Settings';
    case 'logout': return 'Log out';
    case 'users': return 'Users';
    case 'testRuns': return 'Test runs';
    case 'versionText': return `Galasa version ${vars?.version ?? ''}`;
    case 'health': return 'Service health';
    default: return `Translated ${key}`;
    }
  }),
}));


jest.mock('next/navigation', () => ({

  useRouter: jest.fn(() => mockRouter),

}));

jest.mock('@/generated/galasaapi', () => ({
  ...jest.requireActual('@/generated/galasaapi'),
  BootstrapAPIApi: jest.fn(() => ({
    getEcosystemBootstrap: mockGetBootstrapFunc,
  })),

  OpenAPIAPIApi: jest.fn(() => ({
    getOpenApiSpec: mockGetOpenApiSpecFunc,
  }))
}));

describe('Layout', () => {

  afterEach(() => {
    delete process.env.GALASA_SERVICE_NAME;
  });

  it('renders the web UI layout', async () => {
    const layout = await act(async () => {
      return render(<RootLayoutInner galasaServiceName="Galasa Service" featureFlagsCookie="">
        Hello, world!
      </RootLayoutInner>);
    });
    expect(layout).toMatchSnapshot();
  });

  it('renders Galasa Service title when env GALASA_SERVICE_NAME is null or blank string', async () => {

    process.env.GALASA_SERVICE_NAME = "";

    await act(async () => {
      return render(<RootLayoutInner galasaServiceName="Galasa Service" featureFlagsCookie="">
        Hello, world!
      </RootLayoutInner>);
    });

    const titleElement = document.querySelector('title')?.textContent;
    expect(titleElement).toBe("Galasa Service");
  });

  it('renders custom title when env GALASA_SERVICE_NAME is not present (not null or blank)', async () => {

    process.env.GALASA_SERVICE_NAME = 'Managers';
    await act(async () => {
      return render(<RootLayoutInner galasaServiceName="Managers" featureFlagsCookie="">
        Hello, world!
      </RootLayoutInner>);
    });

    const titleElement = document.querySelector('title')?.textContent;

    expect(titleElement).not.toBe("Galasa Service");
    expect(titleElement).toBe("Managers");
  });
});
