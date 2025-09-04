import { defineStore } from 'pinia'
import router from '@/router'

export const useTitleStore = defineStore('title', {
  state: () => ({
    customTitle: '' as string,
  }),
  getters: {
    title(state): string {
      if (state.customTitle) return state.customTitle
      const routeTitle = router.currentRoute.value.meta.title as string | undefined
      return routeTitle ?? 'Fictive Shop'
    },
  },
  actions: {
    setTitle(newTitle: string) {
      this.customTitle = newTitle
      document.title = `Fictive Shop - ${newTitle}`
    },
    resetTitle() {
      this.customTitle = ''
      document.title = `Fictive Shop - ${this.title}`
    },
  },
})
