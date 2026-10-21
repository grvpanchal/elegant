// Evidence for the state-selectors campaign's numbers, measured 2026-10-19: templates/chota-react-redux as it ships
// (React 19.2.5, React-Redux 9.2.0, Redux 5.0.1) under Vitest 4.1.4 + jsdom 29, Reselect 5.1.1 from
// templates/chota-react-rtk/node_modules. Results: selector-rerenders.json beside this file.
//
// To run it again: copy this file into templates/chota-react-redux/measure/, point the reselect import at
// ../../chota-react-rtk/node_modules/reselect/dist/reselect.mjs, and run `npx vitest run measure/`.
// Count the todo list's renders while only the theme changes: the template's container as it ships, the same selector
// under shallowEqual, and the same selector memoized with Reselect 5 on stable inputs.
import { writeFileSync, appendFileSync } from "node:fs";
import { act, render } from "@testing-library/react";
import { Profiler } from "react";
import { Provider, shallowEqual, useSelector } from "react-redux";
import { createStore } from "redux";
import { createSelector, lruMemoize } from "../../chota-react-rtk/node_modules/reselect/dist/reselect.mjs";
import TodoListContainer from "../src/containers/TodoListContainer";
import TodoList from "../src/ui/organisms/TodoList/TodoList.component";
import reducer from "../src/state/rootReducer";
import { getVisibleTodos } from "../src/state/todo/todo.selectors";
import { getSelectedFilter } from "../src/state/filters/filters.selectors";
import { updateConfig } from "../src/state/config/config.actions";
import { setVisibilityFilter } from "../src/state/filters/filters.action";
import { SHOW_ACTIVE, SHOW_ALL } from "../src/state/filters/filters.type";
import initialTodo from "../src/state/todo/todo.initial";

const todos = [{ id: 1, text: "write the selector", completed: false }, { id: 2, text: "write its test", completed: true }];
const events = {};

function Shallow() {
  const f = useSelector(getSelectedFilter);
  const todoData = useSelector((s) => getVisibleTodos(s.todo, f.id), shallowEqual);
  return <TodoList todoData={todoData} events={events} />;
}
const selectMemoTodoData = createSelector([(s) => s.todo, (s) => getSelectedFilter(s).id], getVisibleTodos);
function Memoized() {
  const todoData = useSelector(selectMemoTodoData);
  return <TodoList todoData={todoData} events={events} />;
}

function measure(Component, filter) {
  const store = createStore(reducer, { todo: { ...initialTodo, todoItems: todos } });
  if (filter !== SHOW_ALL) store.dispatch(setVisibilityFilter(filter));
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  let renders = 0;
  render(<Provider store={store}><Profiler id="list" onRender={() => { renders += 1; }}><Component /></Profiler></Provider>);
  const warnings = warn.mock.calls.map((c) => String(c[0]).split("\n")[0]);
  const steps = [renders];
  for (const theme of ["dark", "light", "dark"]) { act(() => { store.dispatch(updateConfig({ theme })); }); steps.push(renders); }
  warn.mockRestore();
  return { rerenders: renders - steps[0], steps: steps.join(" "), warnings: warnings.length };
}

test("theme toggles re-render the list", () => {
  const rows = {};
  for (const [name, C] of [["as shipped", TodoListContainer], ["shallowEqual", Shallow], ["createSelector", Memoized]])
    for (const filter of [SHOW_ALL, SHOW_ACTIVE]) rows[`${name} / ${filter}`] = measure(C, filter);
  writeFileSync("measure/out.json", JSON.stringify(rows, null, 1) + "\n");
});

test("Reselect 5's default cache against alternating ids", () => {
  const state = { todo: { todoItems: todos } };
  const byId = createSelector([(s) => s.todo.todoItems, (s, id) => id], (items, id) => items.find((t) => t.id === id));
  const lru1 = createSelector([(s) => s.todo.todoItems, (s, id) => id], (items, id) => items.find((t) => t.id === id), { memoize: lruMemoize, argsMemoize: lruMemoize });
  for (let i = 0; i < 5; i++) { byId(state, 1); byId(state, 2); lru1(state, 1); lru1(state, 2); }
  appendFileSync("measure/out.json", JSON.stringify({ "default (weakMapMemoize), 10 calls alternating ids 1 and 2": byId.recomputations(),
                               "lruMemoize on both layers (Reselect 4 default), the same 10 calls": lru1.recomputations() }) + "\n");
});

function warningsAfterSwitch(stabilityCheck) {
  const store = createStore(reducer, { todo: { ...initialTodo, todoItems: todos } });
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  let renders = 0;
  render(<Provider store={store} stabilityCheck={stabilityCheck}><Profiler id="l" onRender={() => { renders += 1; }}><Shallow /></Profiler></Provider>);
  const onAll = warn.mock.calls.length;
  act(() => { store.dispatch(setVisibilityFilter(SHOW_ACTIVE)); });
  const base = renders;
  for (const theme of ["dark", "light", "dark"]) act(() => { store.dispatch(updateConfig({ theme })); });
  const out = { stabilityCheck, warningsOnAll: onAll, warningsAfterActive: warn.mock.calls.length - onAll, rendersFrom3Toggles: renders - base };
  warn.mockRestore();
  return out;
}

const selectTodoData = (s) => getVisibleTodos(s.todo, getSelectedFilter(s).id);
function Named() { return <TodoList todoData={useSelector(selectTodoData)} events={events} />; }

test("once vs always, a named selector, and the reference gate", () => {
  const store = createStore(reducer, { todo: { ...initialTodo, todoItems: todos } });
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  render(<Provider store={store}><Named /></Provider>);
  const named = warn.mock.calls.map((c) => String(c[0]).split("\n")[0]);
  warn.mockRestore();
  const state = store.getState();
  const gate = createSelector([(s) => s.todo, (s) => getSelectedFilter(s).id], getVisibleTodos);
  const prev = gate(state);
  const next = { ...state, config: { ...state.config, theme: "dark" } };
  const plainPrev = selectTodoData(state), plainNext = selectTodoData(next);
  appendFileSync("measure/out.json", JSON.stringify({ once: warningsAfterSwitch("once"), always: warningsAfterSwitch("always"), named,
    gate: { memoizedToBe: gate(next) === prev, recomputations: gate.recomputations(), plainToBe: plainNext === plainPrev,
            plainToEqual: JSON.stringify(plainNext) === JSON.stringify(plainPrev) } }, null, 1) + "\n");
});
