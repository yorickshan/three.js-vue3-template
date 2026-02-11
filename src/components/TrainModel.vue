<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useTrainAnimation, useTrainMaterials } from '@/composables/useTrainAnimation'

interface Props {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
}

const props = defineProps<Props>()

const trainGroup = ref<THREE.Group | null>(null)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const animationId = ref<number>(0)
const trainPosition = ref(0)

const { isHighlighted, isAccelerated, currentSpeed, toggleHighlight, toggleSpeed, resetState } = useTrainAnimation(0.02)
const { storeOriginalMaterials, applyHighlight, disposeMaterials } = useTrainMaterials()

const createTrainModel = () => {
  const group = new THREE.Group()

  const bodyGeometry = new THREE.BoxGeometry(2, 1, 4)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4, metalness: 0.6 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.8
  body.castShadow = true
  group.add(body)

  const cabinGeometry = new THREE.BoxGeometry(1.6, 0.8, 2)
  const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.4, metalness: 0.6 })
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
  cabin.position.set(0, 1.6, -0.5)
  cabin.castShadow = true
  group.add(cabin)

  const chimneyGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.6)
  const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.6, metalness: 0.4 })
  const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial)
  chimney.position.set(0, 1.6, 1.2)
  chimney.castShadow = true
  group.add(chimney)

  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16)
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7, metalness: 0.3 })
  const wheelPositions = [[-0.8, 0.3, 1.2], [0.8, 0.3, 1.2], [-0.8, 0.3, -1.2], [0.8, 0.3, -1.2]]
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(pos[0], pos[1], pos[2])
    wheel.castShadow = true
    group.add(wheel)
  })

  const lightGeometry = new THREE.SphereGeometry(0.15)
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.5 })
  const headLight = new THREE.Mesh(lightGeometry, lightMaterial)
  headLight.position.set(0, 1, 2)
  group.add(headLight)

  group.userData.isTrain = true
  return group
}

const onMouseMove = (event: MouseEvent) => {
  const rect = props.renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, props.camera)
  if (trainGroup.value) {
    const intersects = raycaster.intersectObjects(trainGroup.value.children, true)
    const wasHighlighted = isHighlighted.value
    const nowHighlighted = intersects.length > 0
    if (wasHighlighted !== nowHighlighted) {
      toggleHighlight(nowHighlighted)
    }
  }
}

const onClick = () => {
  raycaster.setFromCamera(mouse, props.camera)
  if (trainGroup.value) {
    const intersects = raycaster.intersectObjects(trainGroup.value.children, true)
    if (intersects.length > 0) {
      toggleSpeed()
    }
  }
}

const animate = () => {
  animationId.value = requestAnimationFrame(animate)

  if (trainGroup.value) {
    trainPosition.value += currentSpeed.value
    const radius = 6
    trainGroup.value.position.x = Math.sin(trainPosition.value) * radius
    trainGroup.value.position.z = Math.cos(trainPosition.value) * radius
    trainGroup.value.rotation.y = trainPosition.value + Math.PI

    applyHighlight(trainGroup.value, isHighlighted.value)
  }
}

onMounted(() => {
  trainGroup.value = createTrainModel()
  storeOriginalMaterials(trainGroup.value)
  props.scene.add(trainGroup.value)

  props.renderer.domElement.addEventListener('mousemove', onMouseMove)
  props.renderer.domElement.addEventListener('click', onClick)

  animate()
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }

  props.renderer.domElement.removeEventListener('mousemove', onMouseMove)
  props.renderer.domElement.removeEventListener('click', onClick)

  if (trainGroup.value) {
    trainGroup.value.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
    props.scene.remove(trainGroup.value)
  }

  disposeMaterials()
  resetState()

  console.log('[TrainModel] 资源已释放')
})
</script>

<template>
  <div class="train-status">
    <div class="status-item">
      <span class="label">状态:</span>
      <span class="value" :class="{ active: isHighlighted }">{{ isHighlighted ? '高亮' : '正常' }}</span>
    </div>
    <div class="status-item">
      <span class="label">速度:</span>
      <span class="value" :class="{ active: isAccelerated }">{{ isAccelerated ? '加速 (2x)' : '正常' }}</span>
    </div>
  </div>
</template>

<style scoped>
.train-status {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 16px 20px;
  border-radius: 8px;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  z-index: 100;
}

.status-item {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 8px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #9ca3af;
  font-size: 14px;
}

.value {
  font-size: 14px;
  font-weight: 500;
  color: #d1d5db;
  transition: color 0.3s ease;
}

.value.active {
  color: #fbbf24;
}
</style>
