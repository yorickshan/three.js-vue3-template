<script setup lang="ts">
import Base3d from '../utils/Base3d'
import { reactive, onMounted } from 'vue'
import Info from '@/components/Info.vue'

const data = reactive({
  base3d: {},
})

onMounted(() => {
  data.base3d = new Base3d('#three')
})
</script>

<template>
  <div class="relative">
    <div class="three" id="three"></div>
    <Info />
  </div>
</template>
