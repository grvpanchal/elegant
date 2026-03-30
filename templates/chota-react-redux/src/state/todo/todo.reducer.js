import intialTodoState from "./todo.initial";
import { CREATE_TODO, DELETE_TODO, EDIT_TODO, TOGGLE_TODO, UPDATE_TODO } from "./todo.type";

const todo = (state = intialTodoState, action) => {
  let todoItems = [];

  switch (action.type) {
    case CREATE_TODO:
      return {
        ...state,
        todoItems: [
          ...state.todoItems,
          {
            id: action.payload.id,
            text: action.payload.text,
            completed: false,
          },
        ],
      };
    case EDIT_TODO:
      return {
        ...state,
        currentTodoItem: action.payload,
      };
    case UPDATE_TODO:
      todoItems = state.todoItems.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
      return {
        ...state,
        todoItems,
        currentTodoItem: intialTodoState.currentTodoItem,
      };
    case TOGGLE_TODO:
      todoItems = state.todoItems.map((todo) => {
        return todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      });
      return {
        ...state,
        todoItems,
      };
    case DELETE_TODO:
      todoItems = state.todoItems.filter(
        (todo) => todo.id !== action.payload.id
      );
      return {
        ...state,
        todoItems,
        currentTodoItem: intialTodoState.currentTodoItem,
      };
    default:
      return state;
  }
};

export default todo;
