/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import React from 'react';
import { mount, MountOptions } from 'cypress/react18';

import { Provider } from 'react-redux';
import { setupStore } from '../../src/redux/store';
import type { AppStore, RootState } from '../../src/redux/store';

interface ExtendedMountOptions extends MountOptions {
  preloadedState?: Partial<RootState>
  store?: AppStore
};

declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: React.ReactNode, options: ExtendedMountOptions): Chainable<Element>
    }
  }
}

const mountWithProviders = (
  jsx: React.ReactNode,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...mountOptions
  }: ExtendedMountOptions = {}
) => {
  // Return an object with the store and all of RTL's query functions
  return cy.wrap({
    store,
    ...mount(<Provider store={store}>{jsx}</Provider>, mountOptions)
  });
};

Cypress.Commands.add("mount", mountWithProviders);

/*
Cypress.Commands.add("mount", (component: React.ReactNode, options: ExtendedMountOptions = {}) => {
  // Wrap any parent components needed
  // ie: return mount(<MyProvider>{component}</MyProvider>, options)
  return mountWithProviders(component, options)
});
*/
