import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup mock server
export const server = setupServer(...handlers);
export default server;
