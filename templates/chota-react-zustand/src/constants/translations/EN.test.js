import EN from '../../constants/translations/EN';

describe('EN translations', () => {
  it('should have buttonAdd translation', () => {
    expect(EN.buttonAdd).toBe('Add');
  });

  it('should have buttonSave translation', () => {
    expect(EN.buttonSave).toBe('Save');
  });
});
