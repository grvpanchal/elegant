import React, { useEffect, useState } from "react";
import Input from "../../atoms/Input/Input.component";
import Button from "../../atoms/Button/Button.component";

const AddTodoForm = ({ buttonInfo, placeholder, isLoading, onTodoAdd, onTodoUpdate, todoValue }) => {
  const [inputValue, setInputValue] = useState(todoValue || '');
  const { label, variant } = buttonInfo;

  const handleChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };

  useEffect(() => setInputValue(todoValue), [todoValue]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!inputValue.trim()) {
            return;
          }
          if(todoValue) {
            onTodoUpdate(inputValue);
          } else {
            onTodoAdd(inputValue);
          }
          setInputValue('');
        }}
      >
        <div className="grouped">
          <Input className="" value={inputValue} disabled={isLoading} placeholder={placeholder} onChange={handleChange} />
          <Button className={`button ${variant}`} isLoading={isLoading} type="submit">
            {label}
          </Button>
        </div>
      </form>
    </div>
  );
};

AddTodoForm.defaultProps = {
  buttonInfo: {
    label: 'Add',
    variant: 'primary'
  }
}

export default AddTodoForm;
