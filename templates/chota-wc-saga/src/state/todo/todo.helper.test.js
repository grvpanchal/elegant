import { expect } from '@open-wc/testing';
import { mapTodoData, toggleCheckedState } from './todo.helper';

describe('todo helpers', () => {
  it('mapTodoData returns data as-is', () => {
    const data = [{ id: 1, text: 'Test' }];
    expect(mapTodoData(data)).to.deep.equal(data);
  });

  it('toggleCheckedState toggles completed status', () => {
    expect(toggleCheckedState({ id: 1, completed: false })).to.deep.equal({ id: 1, completed: true });
    expect(toggleCheckedState({ id: 1, completed: true })).to.deep.equal({ id: 1, completed: false });
  });
});
