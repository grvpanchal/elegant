import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from './index'
import * as operations from './todo.operations'
import * as api from '../../utils/api'

vi.mock('../../utils/api', () => ({
  default: vi.fn(),
  getTodo: vi.fn(),
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  removeTodo: vi.fn(),
  modifyTodo: vi.fn(),
}))

describe('todo store actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('addTodos', () => {
    it('creates todo and succeeds', async () => {
      const store = useTodoStore()
      api.default.mockResolvedValue({})
      await store.addTodos('New todo')
      expect(store.isLoading).toBe(false)
      expect(store.isActionLoading).toBe(false)
      expect(store.todoItems).toHaveLength(1)
    })

    it('handles error', async () => {
      const store = useTodoStore()
      api.default.mockRejectedValue(new Error('Network error'))
      await store.addTodos('New todo')
      expect(store.isLoading).toBe(false)
      expect(store.isActionLoading).toBe(false)
      expect(store.error).toBe('Error: Network error')
    })
  })

  describe('getTodos', () => {
    it('fetches todos successfully', async () => {
      const store = useTodoStore()
      const mockTodos = [{ id: 1, text: 'Test', completed: false }]
      api.default.mockResolvedValue({ json: () => Promise.resolve(mockTodos) })
      await store.getTodos()
      await vi.advanceTimersByTimeAsync(600)
      expect(store.isLoading).toBe(false)
      expect(store.isContentLoading).toBe(false)
    })

    it('handles fetch error', async () => {
      const store = useTodoStore()
      api.default.mockRejectedValue(new Error('Failed'))
      await store.getTodos()
      await vi.advanceTimersByTimeAsync(600)
      expect(store.isLoading).toBe(false)
      expect(store.isContentLoading).toBe(false)
      expect(store.error).toBe('Error: Failed')
    })
  })

  describe('updateTodos', () => {
    it('updates todo successfully', async () => {
      const store = useTodoStore()
      store.todoItems = [{ id: 1, text: 'Old', completed: false }]
      api.default.mockResolvedValue({})
      await store.updateTodos({ id: 1, text: 'New' })
      expect(store.isActionLoading).toBe(false)
    })

    it('updates todo with multiple todos (non-matching branch)', async () => {
      const store = useTodoStore()
      store.todoItems = [
        { id: 1, text: 'Old', completed: false },
        { id: 2, text: 'Other', completed: true },
      ]
      api.default.mockResolvedValue({})
      await store.updateTodos({ id: 1, text: 'New' })
      expect(store.todoItems[0].text).toBe('New')
      expect(store.todoItems[1].text).toBe('Other')
    })

    it('handles update error', async () => {
      const store = useTodoStore()
      store.todoItems = [{ id: 1, text: 'Old', completed: false }]
      store.previousStateTodoItems = [{ id: 1, text: 'Old', completed: false }]
      api.default.mockRejectedValue(new Error('Failed'))
      await store.updateTodos({ id: 1, text: 'New' })
      expect(store.isActionLoading).toBe(false)
      expect(store.error).toBe('Error: Failed')
    })
  })

  describe('updateToggleTodos', () => {
    it('toggles todo successfully', async () => {
      const store = useTodoStore()
      store.todoItems = [{ id: 1, text: 'Test', completed: false }]
      api.default.mockResolvedValue({})
      await store.updateToggleTodos({ id: 1, text: 'Test', completed: false })
      expect(store.previousStateTodoItems).toBeUndefined()
      expect(store.isLoading).toBe(false)
    })

    it('toggles todo with multiple todos (non-matching branch)', async () => {
      const store = useTodoStore()
      store.todoItems = [
        { id: 1, text: 'Test', completed: false },
        { id: 2, text: 'Other', completed: true },
      ]
      api.default.mockResolvedValue({})
      await store.updateToggleTodos({ id: 1, text: 'Test', completed: false })
      expect(store.todoItems[0].completed).toBe(true)
      expect(store.todoItems[1].completed).toBe(true)
    })

    it('handles toggle error', async () => {
      const store = useTodoStore()
      store.todoItems = [{ id: 1, text: 'Test', completed: false }]
      store.previousStateTodoItems = [{ id: 1, text: 'Test', completed: false }]
      api.default.mockRejectedValue(new Error('Failed'))
      await store.updateToggleTodos({ id: 1, text: 'Test', completed: false })
      await vi.advanceTimersByTimeAsync(600)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Error: Failed')
    })
  })

  describe('deleteTodos', () => {
    it('deletes todo successfully', async () => {
      const store = useTodoStore()
      store.todoItems = [{ id: 1, text: 'Test', completed: false }]
      api.default.mockResolvedValue({})
      await store.deleteTodos(1)
      expect(store.previousStateTodoItems).toBeUndefined()
      expect(store.isLoading).toBe(false)
    })

    it('handles delete error', async () => {
      const store = useTodoStore()
      store.todoItems = [{ id: 1, text: 'Test', completed: false }]
      store.previousStateTodoItems = [{ id: 1, text: 'Test', completed: false }]
      api.default.mockRejectedValue(new Error('Failed'))
      await store.deleteTodos(1)
      await vi.advanceTimersByTimeAsync(600)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Error: Failed')
    })
  })
})

describe('todo operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getTodoApi', () => {
    it('calls fetchApi with /todos', () => {
      operations.getTodoApi()
      expect(api.default).toHaveBeenCalledWith('/todos')
    })
  })

  describe('addTodoApi', () => {
    it('calls fetchApi with POST', () => {
      operations.addTodoApi({ text: 'Test' })
      expect(api.default).toHaveBeenCalledWith('/todos', { method: 'POST', body: { text: 'Test' } })
    })
  })

  describe('updateTodoApi', () => {
    it('calls fetchApi with PUT', () => {
      operations.updateTodoApi({ id: 1, text: 'Updated' })
      expect(api.default).toHaveBeenCalledWith('/todos', { method: 'PUT', body: { id: 1, text: 'Updated' } })
    })
  })

  describe('deleteTodoApi', () => {
    it('calls fetchApi with DELETE', () => {
      operations.deleteTodoApi({ id: 1 })
      expect(api.default).toHaveBeenCalledWith('/todos', { method: 'DELETE', body: { id: 1 } })
    })
  })
})
