import { ref, computed } from 'vue'
import * as THREE from 'three'

export interface TrainAnimationState {
  isHighlighted: boolean
  isAccelerated: boolean
  baseSpeed: number
  currentSpeed: number
}

export function useTrainAnimation(baseSpeed: number = 1) {
  const isHighlighted = ref(false)
  const isAccelerated = ref(false)
  const currentSpeed = computed(() => 
    isAccelerated.value ? baseSpeed * 2 : baseSpeed
  )

  const toggleHighlight = (value?: boolean) => {
    isHighlighted.value = value ?? !isHighlighted.value
  }

  const toggleSpeed = () => {
    isAccelerated.value = !isAccelerated.value
  }

  const resetState = () => {
    isHighlighted.value = false
    isAccelerated.value = false
  }

  return {
    isHighlighted,
    isAccelerated,
    currentSpeed,
    toggleHighlight,
    toggleSpeed,
    resetState
  }
}

export function useTrainMaterials() {
  const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>()
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff4400,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.8
  })

  const storeOriginalMaterials = (trainGroup: THREE.Group) => {
    trainGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        originalMaterials.set(child, child.material)
      }
    })
  }

  const applyHighlight = (trainGroup: THREE.Group, isHighlighted: boolean) => {
    trainGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (isHighlighted) {
          if (!originalMaterials.has(child)) {
            originalMaterials.set(child, child.material)
          }
          child.material = highlightMaterial
        } else {
          const original = originalMaterials.get(child)
          if (original) {
            child.material = original
          }
        }
      }
    })
  }

  const disposeMaterials = () => {
    highlightMaterial.dispose()
    originalMaterials.clear()
  }

  return {
    storeOriginalMaterials,
    applyHighlight,
    disposeMaterials
  }
}
