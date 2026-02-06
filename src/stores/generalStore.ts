import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type {AccountItem} from "@/components/types.ts";

export const generalStore = defineStore('generalStore', () => {
  const items = reactive<AccountItem[]>([])
  return { items }
}, {
  persist: {
    storage: localStorage,
    pick: ['items'],
  },
})
