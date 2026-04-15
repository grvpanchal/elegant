import { expect } from '@open-wc/testing';
import emit from './events/emit.js';

describe('emit utility', () => {
  it('creates custom event', () => {
    const dispatched = [];
    const mockEl = {
      dispatchEvent: (event) => dispatched.push(event)
    };
    emit(mockEl, 'testEvent', { data: 'test' });
    expect(dispatched.length).to.equal(1);
    expect(dispatched[0].type).to.equal('testEvent');
    expect(dispatched[0].detail).to.deep.equal({ data: 'test' });
  });

  it('handles undefined data', () => {
    const dispatched = [];
    const mockEl = {
      dispatchEvent: (event) => dispatched.push(event)
    };
    emit(mockEl, 'click');
    expect(dispatched.length).to.equal(1);
    expect(dispatched[0].type).to.equal('click');
  });
});