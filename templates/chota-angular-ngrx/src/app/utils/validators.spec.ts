import { CustomValidators } from './validators';
import { FormControl } from '@angular/forms';

describe('CustomValidators', () => {
  describe('isBlank', () => {
    it('should return null for a valid non-empty string', () => {
      const control = new FormControl('hello');
      const result = CustomValidators.isBlank(control);
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = new FormControl(null);
      const result = CustomValidators.isBlank(control);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const control = new FormControl('');
      const result = CustomValidators.isBlank(control);
      expect(result).toBeNull();
    });

    it('should return is_blank error for whitespace-only string', () => {
      const control = new FormControl('   ');
      const result = CustomValidators.isBlank(control);
      expect(result).toEqual({ is_blank: true });
    });

    it('should return is_blank error for tab and newline only string', () => {
      const control = new FormControl('\t\n');
      const result = CustomValidators.isBlank(control);
      expect(result).toEqual({ is_blank: true });
    });

    it('should return null for string with leading/trailing spaces but content', () => {
      const control = new FormControl('  hello  ');
      const result = CustomValidators.isBlank(control);
      expect(result).toBeNull();
    });

    it('should return null for a single character', () => {
      const control = new FormControl('a');
      const result = CustomValidators.isBlank(control);
      expect(result).toBeNull();
    });
  });
});
