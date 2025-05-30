// stores/comment.js
import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    showComment: false
  }),
  actions: {
    openComment() {
      this.showComment = true
    },
    closeComment() {
      this.showComment = false
    }
  }
})