import { html, useEffect, useState } from "haunted";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";

import style from './AddTodoForm.style';
import "../../atoms/Input/app-input";
import "../../atoms/Button/app-button";
import emit from "../../../utils/events/emit";

function AddTodoForm({ buttonInfo, placeholder, isLoading, todoValue }) {
  useComputedStyles(this, [style]);
  const [inputValue, setInputValue] = useState(todoValue || '');
  const { label, variant } = buttonInfo;

  const handleChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };

  useEffect(() => setInputValue(todoValue), [todoValue]);

  const handleFormSubmit = (e) => {
    if(e && e.preventDefault) e.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    if(todoValue) {
      emit(this, 'onTodoUpdate', inputValue);
    } else {
      emit(this, 'onTodoAdd', inputValue);
    }
    setInputValue('');
  }

  return html`
    <div>
      <form
        @submit=${handleFormSubmit}
      >
        <div class="grouped">
          <app-input .value=${inputValue} .disabled=${isLoading} .placeholder=${placeholder} @onChange=${(e) => handleChange(e.detail)} ></app-input>
          <app-button .classes=${`button ${variant}`} .isLoading=${isLoading} type="submit" @onClick=${() => handleFormSubmit(this)}>
            ${label}
          </app-button>
        </div>
      </form>
    </div>
  `;
};

export default AddTodoForm;
