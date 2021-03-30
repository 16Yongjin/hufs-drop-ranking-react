import create from 'zustand'

export const useStore = create((set, get) => ({
  lectures: [],
  fetchLectures: async () => {
    if (get().lectures.length) return

    const response = await fetch('/lectureDrop.json')
    const lectures = await response.json()
    set({ lectures })
  },
}))
