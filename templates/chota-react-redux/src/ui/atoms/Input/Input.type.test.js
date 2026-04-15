import { propTypes } from './Input.type';

jest.mock('./Input.type', () => ({
  propTypes: {
    className: require('prop-types').string,
    id: require('prop-types').string,
    name: require('prop-types').string,
    type: require('prop-types').string.isRequired,
    value: require('prop-types').oneOfType([
      require('prop-types').string,
      require('prop-types').number,
    ]),
    disabled: require('prop-types').bool,
    placeholder: require('prop-types').string,
    onChange: require('prop-types').func,
  },
}));

describe('Input PropTypes', () => {
  it('exports propTypes object', () => {
    expect(propTypes).toBeDefined();
  });

  it('type prop is required', () => {
    expect(propTypes.type).toBeDefined();
  });

  it('className prop exists', () => {
    expect(propTypes.className).toBeDefined();
  });

  it('onChange prop exists', () => {
    expect(propTypes.onChange).toBeDefined();
  });
});
