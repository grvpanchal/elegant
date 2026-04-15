import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFiltersStore } from './index'
import { getSelectedFilter } from './filters.selectors'

describe('filters store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default filters', () => {
    const store = useFiltersStore()
    expect(store.filters).toHaveLength(3)
    expect(store.filters[0].id).toBe('SHOW_ALL')
    expect(store.filters[0].selected).toBe(true)
  })

  describe('setVisibilityFilter', () => {
    it('sets the selected filter', () => {
      const store = useFiltersStore()
      store.setVisibilityFilter('SHOW_COMPLETED')
      expect(store.filters[0].selected).toBe(false)
      expect(store.filters[1].selected).toBe(true)
      expect(store.filters[2].selected).toBe(false)
    })

    it('sets SHOW_ACTIVE as selected', () => {
      const store = useFiltersStore()
      store.setVisibilityFilter('SHOW_ACTIVE')
      expect(store.filters[0].selected).toBe(false)
      expect(store.filters[1].selected).toBe(false)
      expect(store.filters[2].selected).toBe(true)
    })
  })
})

describe('filters selectors', () => {
  it('returns the selected filter', () => {
    const state = {
      filters: [
        { id: 'SHOW_ALL', selected: false },
        { id: 'SHOW_COMPLETED', selected: true },
        { id: 'SHOW_ACTIVE', selected: false },
      ],
    }
    const result = getSelectedFilter(state)
    expect(result.id).toBe('SHOW_COMPLETED')
  })
})
