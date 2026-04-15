import { expect } from '@open-wc/testing';
import rootReducer from './rootReducer';
import { createTodoSuccess } from './todo/todo.actions';

describe('rootReducer', () => {
  it('combines all reducers', () => {
    const state = rootReducer(undefined, { type: 'INIT' });
    expect(state).to.have.property('todo');
    expect(state).to.have.property('filters');
    expect(state).to.have.property('config');
  });

  it('delegates actions to correct reducers', () => {
    const state = rootReducer(undefined, createTodoSuccess({ id: '1', text: 'Test', completed: false }));
    expect(state.todo.todoItems).to.have.lengthOf(1);
    expect(state.filters).to.be.an('array');
    expect(state.config).to.be.an('object');
  });
});
