// const config = {
//   apiEndpoint: "http://localhost:3000/api",
// };

const TODO = "todo";

if (!localStorage.getItem(TODO)) {
  localStorage.setItem(TODO, '[]');
}

export default function fetchApi(
  path = "",
  options = { method: "GET", body: {} }
) {
  // return fetch(config.apiEndpoint + path, options);
  if (path === "/todos" && options.method === "GET") {
    return getTodo();
  } else if (path === "/todos" && options.method === "POST") {
    return addTodo(options.body);
  } else if (path === "/todos" && options.method === "PUT") {
    return updateTodo(options.body);
  } else if (path === "/todos" && options.method === "DELETE") {
    return removeTodo(options.body);
  }
}

const wait = (callback, t) =>
  new Promise((resolve) => setTimeout(() => resolve(callback()), t));

export const getTodo = async (mockError) => {
  try {
    if (mockError) throw new Error();
    const todoResponse = await wait(() => localStorage.getItem(TODO), 500);
    return { json: async () => JSON.parse(todoResponse) };
  } catch (e) {
    const message = "Unable to get Items";
    console.error(message);
    throw message;
  }
};

export const modifyTodo = async (modifyAction, { todoItem, mockError }) => {
  try {
    if (mockError) throw new Error();
    const todoListResponse = await getTodo();
    const todoList = await todoListResponse.json();
    const newTodoListJson = modifyAction(todoList);
    await wait(() => localStorage.setItem(TODO, newTodoListJson), 200);
    return todoItem;
  } catch (e) {
    const message = "unable to modify Item";
    console.error(message, e);
    throw message;
  }
};

export const addTodo = async (todoItem, mockError) =>
  modifyTodo(
    (todoList) => {
      todoList.push(todoItem);
      return JSON.stringify(todoList);
    },
    { todoItem, mockError }
  );

export const updateTodo = async (todoItem, mockError) =>
  modifyTodo(
    (todoList) => {
      const newTodoList = todoList.map((td) =>
        td.id === todoItem.id ? { ...td, ...todoItem } : td
      );
      return JSON.stringify(newTodoList);
    },
    { todoItem, mockError }
  );

export const removeTodo = async (todoItem, mockError) =>
  modifyTodo(
    (todoList) => {
      const newTodoList = todoList.filter((td) => td.id !== todoItem.id);
      return JSON.stringify(newTodoList);
    },
    { todoItem, mockError }
  );
