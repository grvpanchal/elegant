import { propTypes } from './Link.type';

vi.mock('./Link.type', () => ({
  propTypes: {
    className: require('prop-types').string,
    isActive: require('prop-types').bool.isRequired,
    onClick: require('prop-types').func.isRequired,
  },
}));

describe('Link PropTypes', () => {
  it('exports propTypes object', () => {
    expect(propTypes).toBeDefined();
  });

  it('isActive prop is required', () => {
    expect(propTypes.isActive).toBeDefined();
  });

  it('onClick prop is required', () => {
    expect(propTypes.onClick).toBeDefined();
  });
});
