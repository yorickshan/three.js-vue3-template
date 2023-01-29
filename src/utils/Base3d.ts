import * as THREE from 'three'
import { Clock, PerspectiveCamera, Scene, WebGLRenderer, AnimationMixer } from 'three'
import Stats from 'stats.js'
// 导入控制器，轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入模型解析器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

class Base3d {
  public container: HTMLElement
  public camera: PerspectiveCamera
  public scene: Scene
  public stats
  public clock: Clock
  public renderer: WebGLRenderer
  public controls: OrbitControls
  public mixer: AnimationMixer | null

  constructor(selector: string) {
    this.container = document.querySelector(selector) as HTMLElement
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100)
    this.scene = new THREE.Scene()
    this.stats = new Stats()
    this.clock = new THREE.Clock()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.mixer = null
    this.init()
  }

  init() {
    this.initStats()
    // 初始化渲染器
    this.initRenderer()
    // 初始化场景
    this.initScene()
    // 初始化相机
    this.initCamera()
    // 控制器
    this.initControls()
    // 添加物体
    this.setModel()
    // 监听场景大小改变，调整渲染尺寸
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  initStats() {
    this.container.appendChild(this.stats.dom)
  }

  initScene() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    this.scene.background = new THREE.Color(0xbfe3dd)
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
  }

  initCamera() {
    this.camera.position.set(5, 2, 8)
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0.5, 0)
    this.controls.update()
    this.controls.enablePan = false
    this.controls.enableDamping = true
  }

  initRenderer() {
    // 设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // 渲染的尺寸大小
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.container.appendChild(this.renderer.domElement)
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this))
    const delta = this.clock.getDelta()
    this.mixer?.update(delta)
    this.controls.update()
    this.stats.update()
    this.renderer.render(this.scene, this.camera)
  }

  setModel() {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/gltf/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load(
      './models/gltf/LittlestTokyo.glb',
      (gltf) => {
        const model = gltf.scene
        model.position.set(1, 1, 0)
        model.scale.set(0.01, 0.01, 0.01)
        this.scene.add(model)

        this.mixer = new THREE.AnimationMixer(model)
        this.mixer.clipAction(gltf.animations[0]).play()

        console.log('模型添加成功')
        this.animate()
      },
      (e) => {
        console.log('模型添加失败' + e)
      }
    )
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

export default Base3d
