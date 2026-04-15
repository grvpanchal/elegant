import { defaultProps } from './Button.type';

describe('Button PropTypes', () => {
  it('exports empty defaultProps object', () => {
    expect(defaultProps).toEqual({});
  });

  it('defaultProps is a plain object', () => {
    expect(typeof defaultProps).toBe('object');
    expect(defaultProps.constructor.name).toBe('Object');
  });
});
