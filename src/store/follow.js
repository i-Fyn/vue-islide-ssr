import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFollowStore = defineStore('follow', () => {
  // Use an object instead of Set for better reactivity
  const followedUsers = ref({})
  
  const isFollowed = (userId) => !!followedUsers.value[userId]

  const toggleFollow = (userId) => {
    if (isFollowed(userId)) {
      delete followedUsers.value[userId]
    } else {
      followedUsers.value[userId] = true
    }
  }

  const setFollowStatus = (userId, status) => {
    if (status) {
      followedUsers.value[userId] = true
    } else {
      delete followedUsers.value[userId]
    }
  }

  return {
    followedUsers,
    isFollowed,
    toggleFollow,
    setFollowStatus
  }
})