import { beforeAll, afterAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import server from './__mocks__/server';

// Testing setup
beforeAll(() => {
  console.log("Start");
  server.listen()
});
afterEach(() => {
  server.resetHandlers()
  cleanup();
}
);
afterAll(() => server.close());

