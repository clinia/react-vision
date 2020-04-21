/**
 * @jest-environment node
 */

describe('MapboxLoader', () => {
  it('expect to require the file in a Node environment', () => {
    expect(() => require('../MapboxLoader')).not.toThrow();
  });
});
