import { propTypes } from './IconButton.type';

vi.mock('./IconButton.type', () => ({
  propTypes: {
    className: require('prop-types').string,
    alt: require('prop-types').string.isRequired,
    iconName: require('prop-types').string.isRequired,
    size: require('prop-types').string,
    onClick: require('prop-types').func.isRequired,
  },
}));

describe('IconButton PropTypes', () => {
  it('exports propTypes object', () => {
    expect(propTypes).toBeDefined();
  });

  it('alt prop is required', () => {
    expect(propTypes.alt).toBeDefined();
  });

  it('iconName prop is required', () => {
    expect(propTypes.iconName).toBeDefined();
  });

  it('onClick prop is required', () => {
    expect(propTypes.onClick).toBeDefined();
  });
});
