import '@testing-library/jest-dom/jest-globals';
import server from './test/mocks/node';
import { afterAll, afterEach, beforeAll } from '@jest/globals';

// https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollTo = () => {};
//HTMLDialogElement.prototype.showModal = () => {};
//HTMLDialogElement.prototype.close = () => {};


// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());
