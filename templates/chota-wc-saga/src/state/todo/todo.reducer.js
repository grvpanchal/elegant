import { toggleCheckedState } from "./todo.helper";
import intialTodoState from "./todo.initial";
import {
  CREATE_TODO,
  CREATE_TODO_ERROR,
  CREATE_TODO_SUCCESS,
  DELETE_TODO,
  DELETE_TODO_ERROR,
  DELETE_TODO_SUCCESS,
  EDIT_TODO,
  READ_TODO,
  READ_TODO_ERROR,
  READ_TODO_SUCCESS,
  TOGGLE_TODO,
  TOGGLE_TODO_ERROR,
  TOGGLE_TODO_SUCCESS,
  UPDATE_TODO,
  UPDATE_TODO_ERROR,
  UPDATE_TODO_SUCCESS,
} from "./todo.type";

const todo = (state = intialTodoState, action) => {
  let todoItems = [];

  switch (action.type) {
    // Standard Content Loading
    case READ_TODO:
      return {
        ...state,
        isLoading: true,
        isContentLoading: true,
      };
    case READ_TODO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isContentLoading: false,
        todoItems: action.payload,
      };
    case READ_TODO_ERROR:
      return {
        ...state,
        isLoading: false,
        isContentLoading: false,
        error: action.error,
      };
    // Standard Action Modification
    case CREATE_TODO:
      return {
        ...state,
        isLoading: true,
        isActionLoading: true,
        currentTodoItem: action.payload,
      };
    case CREATE_TODO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isActionLoading: false,
        todoItems: [
          ...state.todoItems,
          {
            id: action.payload.id,
            text: action.payload.text,
            completed: false,
          },
        ],
        currentTodoItem: intialTodoState.currentTodoItem,
      };
    case CREATE_TODO_ERROR:
      return {
        ...state,
        isLoading: false,
        isActionLoading: false,
        error: action.error,
        currentTodoItem: intialTodoState.currentTodoItem,
      };
    // Selected Entity for Forms, tabs, page type
    case EDIT_TODO:
      return {
        ...state,
        currentTodoItem: action.payload,
      };
    // Partial Action Modification 
    case UPDATE_TODO:
      todoItems = state.todoItems.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
      return {
        ...state,
        isActionLoading: true,
        todoItems,
        currentTodoItem: action.payload,
      };
    case UPDATE_TODO_SUCCESS:
      return {
        ...state,
        isActionLoading: false,
        currentTodoItem: intialTodoState.currentTodoItem,
      }
    case UPDATE_TODO_ERROR:
      return {
        ...state,
        error: action.error,
        isActionLoading: false,
        currentTodoItem: intialTodoState.currentTodoItem,
      }
    // Parallel Action Modification
    case TOGGLE_TODO:
      todoItems = state.todoItems.map((todo) =>
        todo.id === action.payload.id
          ? toggleCheckedState(todo)
          : todo
      );
      return {
        ...state,
        previousStateTodoItems: [...state.todoItems],
        todoItems,
      };
    // Parallel Action Modification
    case DELETE_TODO:
      todoItems = state.todoItems.filter(
        (todo) => todo.id !== action.payload.id
      );
      return {
        ...state,
        previousStateTodoItems: [...state.todoItems],
        todoItems,
        currentTodoItem: intialTodoState.currentTodoItem,
      };
    case TOGGLE_TODO_SUCCESS:
    case DELETE_TODO_SUCCESS:
      return {
        ...state,
        previousStateTodoItems: undefined,
        isLoading: false,
      };
    case TOGGLE_TODO_ERROR:
    case DELETE_TODO_ERROR:
      return {
        ...state,
        previousStateTodoItems: undefined,
        isLoading: false,
        error: action.error,
        todoItems: action.payload,
      };
    default:
      return state;
  }
};

export default todo;
