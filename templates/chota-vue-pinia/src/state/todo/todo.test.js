import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from './index'
import { getVisibleTodos } from './todo.selectors'
import { toggleCheckedState, mapTodoData } from './todo.helper'

describe('todo store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useTodoStore()
    expect(store.isLoading).toBe(false)
    expect(store.isActionLoading).toBe(false)
    expect(store.isContentLoading).toBe(false)
    expect(store.error).toBe('')
    expect(store.todoItems).toEqual([])
    expect(store.currentTodoItem).toEqual({ text: '', id: '' })
  })

  describe('createTodo', () => {
    it('sets loading states and currentTodoItem', () => {
      const store = useTodoStore()
      store.addTodos('Test todo')
      expect(store.isLoading).toBe(true)
      expect(store.isActionLoading).toBe(true)
      expect(store.currentTodoItem.text).toBe('Test todo')
      expect(store.currentTodoItem.completed).toBe(false)
    })
  })

  describe('editTodo', () => {
    it('sets currentTodoItem', () => {
      const store = useTodoStore()
      store.editTodo({ id: 1, text: 'Editing' })
      expect(store.currentTodoItem.id).toBe(1)
      expect(store.currentTodoItem.text).toBe('Editing')
    })
  })

  describe('readTodo', () => {
    it('sets loading states', () => {
      const store = useTodoStore()
      store.getTodos()
      expect(store.isLoading).toBe(true)
      expect(store.isContentLoading).toBe(true)
      expect(store.isActionLoading).toBe(true)
    })
  })
})

describe('todo selectors', () => {
  it('returns all todos for SHOW_ALL', () => {
    const state = { todoItems: [{ id: 1 }, { id: 2 }] }
    const result = getVisibleTodos(state, 'SHOW_ALL')
    expect(result.todoItems).toHaveLength(2)
  })

  it('returns only completed todos for SHOW_COMPLETED', () => {
    const state = {
      todoItems: [
        { id: 1, completed: false },
        { id: 2, completed: true },
      ],
    }
    const result = getVisibleTodos(state, 'SHOW_COMPLETED')
    expect(result.todoItems).toHaveLength(1)
    expect(result.todoItems[0].completed).toBe(true)
  })

  it('returns only active todos for SHOW_ACTIVE', () => {
    const state = {
      todoItems: [
        { id: 1, completed: false },
        { id: 2, completed: true },
      ],
    }
    const result = getVisibleTodos(state, 'SHOW_ACTIVE')
    expect(result.todoItems).toHaveLength(1)
    expect(result.todoItems[0].completed).toBe(false)
  })

  it('throws error for unknown filter', () => {
    expect(() => getVisibleTodos({}, 'UNKNOWN')).toThrow('Unknown filter: UNKNOWN')
  })
})

describe('todo helpers', () => {
  it('mapTodoData returns data as-is', () => {
    const data = [{ id: 1 }]
    expect(mapTodoData(data)).toEqual(data)
  })

  it('toggleCheckedState toggles completed status', () => {
    expect(toggleCheckedState({ id: 1, completed: false })).toEqual({ id: 1, completed: true })
    expect(toggleCheckedState({ id: 1, completed: true })).toEqual({ id: 1, completed: false })
  })
})
