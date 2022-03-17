import { defineStore } from 'pinia'

interface IHome {
  text: string
  num: number
}

export const useHomeStore = defineStore({
  id: 'home',

  state: (): IHome => ({
    text: '123',
    num: 1,
  }),

  getters: {
    doubleNum(): number {
      return this.num * 2
    },
  },

  actions: {
    async numAdd() {
      setInterval(() => {
        this.num += 1
      }, 1000)
    },
  },
})
