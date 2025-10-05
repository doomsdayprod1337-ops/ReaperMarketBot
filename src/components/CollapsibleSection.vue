<template>
  <div class="space-y-2">
    <button
      @click="$emit('toggle')"
      class="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-reaper-red/10 rounded-lg transition-all duration-200"
    >
      <span>{{ title }}</span>
      <ChevronDown 
        :class="`w-4 h-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`"
      />
    </button>
    
    <div 
      v-if="isOpen"
      class="space-y-1 ml-2"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.hover\:bg-reaper-red\/10:hover {
  background-color: rgba(229, 62, 62, 0.1);
}
</style>
