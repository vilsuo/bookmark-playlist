import '@testing-library/jest-dom/jest-globals';

// https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollTo = () => {};

HTMLDialogElement.prototype.showModal = () => {};
HTMLDialogElement.prototype.close = () => {};