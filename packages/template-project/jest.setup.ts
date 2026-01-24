// Mock import.meta for Jest
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      url: `file://${__dirname}/`
    }
  },
  configurable: true,
  writable: true
});
