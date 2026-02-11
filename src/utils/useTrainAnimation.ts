import { ref, onUnmounted, Ref } from 'vue'
import * as THREE from 'three'
import { AnimationMixer } from 'three'

export const useTrainAnimation = () => {
  const isHighlighted = ref(false)
  const isAccelerated = ref(false)
  const baseSpeed = ref(1.0)
  const currentSpeed = ref(1.0)
  const mixer: Ref<AnimationMixer | null> = ref(null)
  const trainModel: Ref<THREE.Object3D | null> = ref(null)
  const originalMaterials: Ref<Record<string, THREE.Material>> = ref({})

  const highlightTrain = () => {
    isHighlighted.value = true
    if (trainModel.value) {
      trainModel.value.traverse((child: any) => {
        if (child.isMesh) {
          originalMaterials.value[child.uuid] = child.material
          child.material = child.material.clone()
          child.material.emissive.set(0xffffff)
          child.material.emissiveIntensity = 0.3
        }
      })
    }
  }

  const unhighlightTrain = () => {
    isHighlighted.value = false
    if (trainModel.value) {
      trainModel.value.traverse((child: any) => {
        if (child.isMesh && originalMaterials.value[child.uuid]) {
          child.material = originalMaterials.value[child.uuid]
        }
      })
    }
  }

  const toggleAcceleration = () => {
    isAccelerated.value = !isAccelerated.value
    currentSpeed.value = isAccelerated.value ? baseSpeed.value * 2 : baseSpeed.value
  }

  const setTrainModel = (model: THREE.Object3D) => {
    trainModel.value = model
  }

  const setMixer = (newMixer: AnimationMixer) => {
    mixer.value = newMixer
  }

  const update = (delta: number) => {
    if (mixer.value) {
      mixer.value.update(delta * currentSpeed.value)
    }
  }

  const dispose = () => {
    if (mixer.value) {
      mixer.value.stopAllAction()
      mixer.value = null
    }
    originalMaterials.value = {}
    isHighlighted.value = false
    isAccelerated.value = false
    currentSpeed.value = baseSpeed.value
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    isHighlighted,
    isAccelerated,
    currentSpeed,
    baseSpeed,
    highlightTrain,
    unhighlightTrain,
    toggleAcceleration,
    setTrainModel,
    setMixer,
    update,
    dispose
  }
}