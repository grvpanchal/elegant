import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fetchApi, { getTodo, addTodo, updateTodo, removeTodo, modifyTodo } from './api'

describe('api', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('todo', '[]')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('fetchApi', () => {
    it('should call getTodo for GET /todos', () => {
      const result = fetchApi('/todos', { method: 'GET' })
      expect(result).toBeInstanceOf(Promise)
    })

    it('should call addTodo for POST /todos', () => {
      const result = fetchApi('/todos', { method: 'POST', body: { text: 'Test' } })
      expect(result).toBeInstanceOf(Promise)
    })

    it('should call updateTodo for PUT /todos', () => {
      const result = fetchApi('/todos', { method: 'PUT', body: { id: 1, text: 'Updated' } })
      expect(result).toBeInstanceOf(Promise)
    })

    it('should call removeTodo for DELETE /todos', () => {
      const result = fetchApi('/todos', { method: 'DELETE', body: { id: 1 } })
      expect(result).toBeInstanceOf(Promise)
    })

    it('should use default parameters', () => {
      const result = fetchApi()
      expect(result).toBeUndefined()
    })
  })

  describe('getTodo', () => {
    it('should return todo items from localStorage', async () => {
      const todoItems = [{ id: 1, text: 'Test', completed: false }]
      localStorage.setItem('todo', JSON.stringify(todoItems))
      const promise = getTodo()
      await vi.advanceTimersByTimeAsync(600)
      const result = await promise
      const json = await result.json()
      expect(json).toEqual(todoItems)
    })

    it('should throw error when mockError is true', async () => {
      await expect(getTodo(true)).rejects.toBe('Unable to get Items')
    })
  })

  describe('addTodo', () => {
    it('should add a todo item to localStorage', async () => {
      const todoItem = { id: 1, text: 'New Todo', completed: false }
      const promise = addTodo(todoItem)
      await vi.advanceTimersByTimeAsync(1000)
      const result = await promise
      expect(result).toEqual(todoItem)
      const stored = JSON.parse(localStorage.getItem('todo'))
      expect(stored).toHaveLength(1)
      expect(stored[0]).toEqual(todoItem)
    })

    it('should throw error when mockError is true', async () => {
      const todoItem = { id: 1, text: 'New Todo' }
      await expect(addTodo(todoItem, true)).rejects.toBe('unable to modify Item')
    })
  })

  describe('updateTodo', () => {
    it('should update a todo item in localStorage', async () => {
      const initialTodos = [{ id: 1, text: 'Old', completed: false }]
      localStorage.setItem('todo', JSON.stringify(initialTodos))
      const todoItem = { id: 1, text: 'Updated', completed: false }
      const promise = updateTodo(todoItem)
      await vi.advanceTimersByTimeAsync(1000)
      const result = await promise
      expect(result).toEqual(todoItem)
      const stored = JSON.parse(localStorage.getItem('todo'))
      expect(stored[0].text).toBe('Updated')
    })

    it('should preserve other todos when updating one', async () => {
      const initialTodos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ]
      localStorage.setItem('todo', JSON.stringify(initialTodos))
      const todoItem = { id: 1, text: 'Updated', completed: false }
      const promise = updateTodo(todoItem)
      await vi.advanceTimersByTimeAsync(1000)
      await promise
      const stored = JSON.parse(localStorage.getItem('todo'))
      expect(stored[0].text).toBe('Updated')
      expect(stored[1].text).toBe('Todo 2')
      expect(stored[1].completed).toBe(true)
    })

    it('should throw error when mockError is true', async () => {
      const todoItem = { id: 1, text: 'Updated' }
      await expect(updateTodo(todoItem, true)).rejects.toBe('unable to modify Item')
    })
  })

  describe('removeTodo', () => {
    it('should remove a todo item from localStorage', async () => {
      const initialTodos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ]
      localStorage.setItem('todo', JSON.stringify(initialTodos))
      const todoItem = { id: 1 }
      const promise = removeTodo(todoItem)
      await vi.advanceTimersByTimeAsync(1000)
      const result = await promise
      expect(result).toEqual(todoItem)
      const stored = JSON.parse(localStorage.getItem('todo'))
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe(2)
    })

    it('should throw error when mockError is true', async () => {
      const todoItem = { id: 1 }
      await expect(removeTodo(todoItem, true)).rejects.toBe('unable to modify Item')
    })
  })

  describe('modifyTodo', () => {
    it('should call modifyAction and save result', async () => {
      const initialTodos = [{ id: 1, text: 'Test', completed: false }]
      localStorage.setItem('todo', JSON.stringify(initialTodos))
      const modifyAction = (list) => JSON.stringify([{ ...list[0], text: 'Modified' }])
      const promise = modifyTodo(modifyAction, { todoItem: { id: 1 } })
      await vi.advanceTimersByTimeAsync(1000)
      const result = await promise
      expect(result).toEqual({ id: 1 })
      const stored = JSON.parse(localStorage.getItem('todo'))
      expect(stored[0].text).toBe('Modified')
    })

    it('should throw error when mockError is true', async () => {
      const modifyAction = (list) => JSON.stringify(list)
      await expect(modifyTodo(modifyAction, { todoItem: { id: 1 }, mockError: true })).rejects.toBe('unable to modify Item')
    })
  })
})
