import { loadObjects } from './utils/loadresources.js'
import { Camera } from './engine_classes/camera.js'
import { applyTransforms, drawHud } from './engine_classes/transforms.js'

const scene = document.getElementById('scene')
const scene_wrapper = document.getElementById('scene-wrapper')
const hud = document.getElementById('hud')

const scene_objects = {}
const scene_status = {loaded: false}
const camera = new Camera({scene: scene, position: {x: 0, y: 0, z: 0}})

const initialize = async () => {
    window.addEventListener('click', () => {
        scene.requestPointerLock()
    })
    loadObjects(scene, scene_objects)
        .then(res => {
            console.log(res)
            scene_status.loaded = true
            loop()
        }).catch(err => {
            console.error(err)
        })
}

const loop = () => {
    requestAnimationFrame(loop)
    camera.update({scene_objects: scene_objects})
    applyTransforms(camera, scene, scene_wrapper)
    drawHud(hud, camera)
}

initialize()
