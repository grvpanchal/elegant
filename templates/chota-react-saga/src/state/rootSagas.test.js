import rootSaga from './rootSagas';

describe('rootSaga', () => {
  it('should be a generator function', () => {
    const generator = rootSaga();
    expect(typeof generator.next).toBe('function');
  });

  it('should yield all effect with watchTodos', () => {
    const generator = rootSaga();
    const { value } = generator.next();
    expect(value).toBeDefined();
    expect(value).toHaveProperty('combinator');
    expect(value.combinator).toBe(true);
  });
});
