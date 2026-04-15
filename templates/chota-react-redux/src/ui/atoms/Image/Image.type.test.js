import { propTypes } from './Image.type';

jest.mock('./Image.type', () => ({
  propTypes: {
    className: require('prop-types').string,
    src: require('prop-types').string.isRequired,
    alt: require('prop-types').string.isRequired,
    onClick: require('prop-types').func,
  },
}));

describe('Image PropTypes', () => {
  it('exports propTypes object', () => {
    expect(propTypes).toBeDefined();
  });

  it('src prop is required', () => {
    expect(propTypes.src).toBeDefined();
  });

  it('alt prop is required', () => {
    expect(propTypes.alt).toBeDefined();
  });

  it('className prop exists', () => {
    expect(propTypes.className).toBeDefined();
  });
});
