import { SceneObject } from './objects/scene_object.js'
import { Camera } from './engine_classes/camera.js'
import { objects_data } from './data/objects_data.js'

const scene = document.getElementById('scene')
const scene_wrapper = document.getElementById('scene-wrapper')
const hud = document.getElementById('hud')

const scene_objects = {}
let is_render_loaded = false

const camera = new Camera({
    scene: scene, 
    position: {
        x: 0,
        y: 0,
        z: 0
    }
})

const initListeners = () => {
    window.addEventListener('click', () => {
        scene.requestPointerLock()
    })
}

const applyTransforms = () => {
    scene.style.transform = `
        rotateX(${camera.rotation.x}rad)
        rotateZ(${camera.rotation.z}rad)
        translateX(${camera.css_position.x}px)
        translateY(${camera.css_position.y}px)
        translateZ(${camera.css_position.z - camera.jump.velocity}px)
    `

    scene_wrapper.style.transform = `rotateX(90deg)`

    const trees = scene.querySelectorAll('.tree')
    trees.forEach(tree => {
        tree.style.transform = `
            rotateZ(${-camera.rotation.z}rad)
            rotateX(-90deg)
        `
    })

    hud.innerHTML = `
        <p>
            <span style="color: black">
                css_position [x / y / z] :
            </span>
            <span style="color: purple">
                ${camera.css_position.x.toFixed(3)} | 
                ${camera.css_position.y.toFixed(3)} | 
                ${(camera.css_position.z - camera.jump.velocity).toFixed(3)}
            </span>
        </p>
        <p>
            <span style="color: black">
                scene_position [x / y / z] : 
            </span>
            <span style="color: purple">
                ${camera.scene_position.x.toFixed(3)} | 
                ${camera.scene_position.y.toFixed(3)} | 
                ${(camera.scene_position.z - camera.jump.velocity).toFixed(3)}
            </span>
        </p>
        <p>
            <span style="color: black">
                rotation [x / y / z] : 
            </span>
            <span style="color: purple">
                ${camera.rotation.x.toFixed(3)} |  
                ${camera.rotation.y.toFixed(3)} | 
                ${camera.rotation.z.toFixed(3)}
            </span>
        </p>
    `
}

const loadObjects = async () => {
    console.log(objects_data)

    objects_data.forEach(object_data => {
        const scene_object = new SceneObject({
            position: object_data.position,
            size: object_data.size,
            object_type: object_data.type
        })
        scene.appendChild(scene_object.dom_element)
        scene_objects[scene_object.id] = scene_object
    })

    is_render_loaded = true
}

const loop = () => {
    if (is_render_loaded){
        requestAnimationFrame(loop)
        camera.update({scene_objects: scene_objects})
        applyTransforms()
    }
}

initListeners()
loadObjects()
loop()