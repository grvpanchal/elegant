import { TodoItemProps } from '../../atoms/TodoItem/TodoItem.type';

export interface TodoItemsProps {
  todos: TodoItemProps[];
  isDisabled?: boolean;
}
