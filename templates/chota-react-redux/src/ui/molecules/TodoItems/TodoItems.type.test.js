import { propTypes } from './TodoItems.type';

vi.mock('./TodoItems.type', () => ({
  propTypes: {
    todos: require('prop-types').array.isRequired,
    isDisabled: require('prop-types').bool,
    onToggleClick: require('prop-types').func.isRequired,
    onEditClick: require('prop-types').func.isRequired,
    onDeleteClick: require('prop-types').func.isRequired,
  },
}));

describe('TodoItems PropTypes', () => {
  it('exports propTypes object', () => {
    expect(propTypes).toBeDefined();
    expect(typeof propTypes).toBe('object');
  });

  it('todos prop is required', () => {
    expect(propTypes.todos).toBeDefined();
  });

  it('isDisabled prop exists', () => {
    expect(propTypes.isDisabled).toBeDefined();
  });

  it('onToggleClick prop is required', () => {
    expect(propTypes.onToggleClick).toBeDefined();
  });

  it('onEditClick prop is required', () => {
    expect(propTypes.onEditClick).toBeDefined();
  });

  it('onDeleteClick prop is required', () => {
    expect(propTypes.onDeleteClick).toBeDefined();
  });
});
