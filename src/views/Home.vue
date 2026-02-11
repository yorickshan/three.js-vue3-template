<script setup lang="ts">
import Base3d from '../utils/Base3d'
import { reactive, onMounted, onUnmounted } from 'vue'
import Info from '@/components/Info.vue'

const data = reactive({
  base3d: null as Base3d | null,
})

onMounted(() => {
  data.base3d = new Base3d('#three')
})

onUnmounted(() => {
  if (data.base3d) {
    data.base3d.dispose()
    data.base3d = null
  }
})
</script>

<template>
  <div class="relative">
    <div class="three" id="three"></div>
    <Info />
  </div>
</template>
