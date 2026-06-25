import intialTodoState from "./todo.initial";
import { mapTodoData, toggleCheckedState } from "./todo.helper";
import fetchApi from "../../utils/api";

/*
API wrappers — kept as named exports (like the saga operations) so they can be
unit-tested and mocked independently of the store.
*/
export const getTodoApi = () => fetchApi("/todos");
export const addTodoApi = (payload) =>
  fetchApi("/todos", { method: "POST", body: payload });
export const updateTodoApi = (payload) =>
  fetchApi("/todos", { method: "PUT", body: payload });
export const deleteTodoApi = (payload) =>
  fetchApi("/todos", { method: "DELETE", body: payload });

/* Matches the saga `delay(500)` before a rollback, so the optimistic UI is visible. */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
The todo slice collapses the Redux action/reducer/saga triple into async store
actions. Each action applies the same optimistic update the reducer did, then
awaits the API and either confirms or rolls back — exactly like the saga
request/success/failure flow.
*/
export const createTodoSlice = (set, get) => ({
  todo: { ...intialTodoState },

  /* Internal helper: shallow-merge a patch into the `todo` namespace. */
  setTodo: (patch, name = "todo/set") =>
    set((state) => ({ todo: { ...state.todo, ...patch } }), false, name),

  // Standard Content Loading
  readTodo: async () => {
    get().setTodo(
      { isLoading: true, isContentLoading: true },
      "todo/readTodo"
    );
    try {
      const todoResponse = await getTodoApi();
      const todoData = await todoResponse.json();
      get().setTodo(
        {
          isLoading: false,
          isContentLoading: false,
          todoItems: mapTodoData(todoData),
        },
        "todo/readTodoSuccess"
      );
    } catch (error) {
      get().setTodo(
        { isLoading: false, isContentLoading: false, error: error.toString() },
        "todo/readTodoError"
      );
    }
  },

  // Standard Action Modification
  createTodo: async (text) => {
    get().setTodo(
      {
        isLoading: true,
        isActionLoading: true,
        currentTodoItem: { text, completed: false },
      },
      "todo/createTodo"
    );
    try {
      const payload = { text, completed: false, id: window.crypto.randomUUID() };
      await addTodoApi(payload);
      set(
        (state) => ({
          todo: {
            ...state.todo,
            isLoading: false,
            isActionLoading: false,
            todoItems: [
              ...state.todo.todoItems,
              { id: payload.id, text: payload.text, completed: false },
            ],
            currentTodoItem: intialTodoState.currentTodoItem,
          },
        }),
        false,
        "todo/createTodoSuccess"
      );
    } catch (error) {
      get().setTodo(
        {
          isLoading: false,
          isActionLoading: false,
          error: error.toString(),
          currentTodoItem: intialTodoState.currentTodoItem,
        },
        "todo/createTodoError"
      );
    }
  },

  // Selected Entity for Forms, tabs, page type
  editTodo: (payload) => {
    get().setTodo({ currentTodoItem: payload }, "todo/editTodo");
  },

  // Partial Action Modification
  updateTodo: async (payload) => {
    set(
      (state) => ({
        todo: {
          ...state.todo,
          isActionLoading: true,
          todoItems: state.todo.todoItems.map((todo) =>
            todo.id === payload.id ? { ...todo, text: payload.text } : todo
          ),
          currentTodoItem: payload,
        },
      }),
      false,
      "todo/updateTodo"
    );
    try {
      await updateTodoApi(payload);
      get().setTodo(
        {
          isActionLoading: false,
          currentTodoItem: intialTodoState.currentTodoItem,
        },
        "todo/updateTodoSuccess"
      );
    } catch (error) {
      get().setTodo(
        {
          isActionLoading: false,
          error: error.toString(),
          currentTodoItem: intialTodoState.currentTodoItem,
        },
        "todo/updateTodoError"
      );
    }
  },

  // Parallel Action Modification (optimistic toggle with rollback)
  toggleTodo: async (payload) => {
    set(
      (state) => ({
        todo: {
          ...state.todo,
          previousStateTodoItems: [...state.todo.todoItems],
          todoItems: state.todo.todoItems.map((todo) =>
            todo.id === payload.id ? toggleCheckedState(todo) : todo
          ),
        },
      }),
      false,
      "todo/toggleTodo"
    );
    try {
      await updateTodoApi(toggleCheckedState(payload));
      get().setTodo(
        { previousStateTodoItems: undefined, isLoading: false },
        "todo/toggleTodoSuccess"
      );
    } catch (error) {
      await delay(500);
      set(
        (state) => ({
          todo: {
            ...state.todo,
            previousStateTodoItems: undefined,
            isLoading: false,
            error: error.toString(),
            todoItems: state.todo.previousStateTodoItems,
          },
        }),
        false,
        "todo/toggleTodoError"
      );
    }
  },

  // Parallel Action Modification (optimistic delete with rollback)
  deleteTodo: async (id) => {
    const payload = { id };
    set(
      (state) => ({
        todo: {
          ...state.todo,
          previousStateTodoItems: [...state.todo.todoItems],
          todoItems: state.todo.todoItems.filter(
            (todo) => todo.id !== payload.id
          ),
          currentTodoItem: intialTodoState.currentTodoItem,
        },
      }),
      false,
      "todo/deleteTodo"
    );
    try {
      await deleteTodoApi(payload);
      get().setTodo(
        { previousStateTodoItems: undefined, isLoading: false },
        "todo/deleteTodoSuccess"
      );
    } catch (error) {
      await delay(500);
      set(
        (state) => ({
          todo: {
            ...state.todo,
            previousStateTodoItems: undefined,
            isLoading: false,
            error: error.toString(),
            todoItems: state.todo.previousStateTodoItems,
          },
        }),
        false,
        "todo/deleteTodoError"
      );
    }
  },
});

export default createTodoSlice;
