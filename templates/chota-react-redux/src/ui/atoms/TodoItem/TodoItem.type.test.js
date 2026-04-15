import { propTypes } from './TodoItem.type';

jest.mock('./TodoItem.type', () => ({
  propTypes: {
    onToggleClick: require('prop-types').func.isRequired,
    completed: require('prop-types').bool.isRequired,
    text: require('prop-types').string.isRequired,
    id: require('prop-types').string.isRequired,
    onEditClick: require('prop-types').func.isRequired,
    onDeleteClick: require('prop-types').func.isRequired,
  },
}));

describe('TodoItem PropTypes', () => {
  it('exports propTypes object', () => {
    expect(propTypes).toBeDefined();
    expect(typeof propTypes).toBe('object');
  });

  it('onToggleClick prop is required', () => {
    expect(propTypes.onToggleClick).toBeDefined();
  });

  it('completed prop is required', () => {
    expect(propTypes.completed).toBeDefined();
  });

  it('text prop is required', () => {
    expect(propTypes.text).toBeDefined();
  });

  it('id prop is required', () => {
    expect(propTypes.id).toBeDefined();
  });

  it('onEditClick prop is required', () => {
    expect(propTypes.onEditClick).toBeDefined();
  });

  it('onDeleteClick prop is required', () => {
    expect(propTypes.onDeleteClick).toBeDefined();
  });
});
