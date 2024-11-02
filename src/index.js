import { scene_objects } from './vars.js'

import { Tree } from './objects/tree.js'
import { Camera } from './engine_classes/camera.js'

const scene = document.getElementById('scene')
const scene_wrapper = document.getElementById('scene-wrapper')
const hud = document.getElementById('hud')

const camera = new Camera({
    scene: scene, 
    position: {
        x: 250,
        y: -600,
        z: -35
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
        <p>css_position.x : ${camera.css_position.x.toFixed(3)}</p>
        <p>css_position.y : ${camera.css_position.y.toFixed(3)}</p>
        <p>css_position.z : ${(camera.css_position.z - camera.jump.velocity).toFixed(3)}</p>
        <p>scene_position.x : ${camera.scene_position.x.toFixed(3)}</p>
        <p>scene_position.y : ${camera.scene_position.y.toFixed(3)}</p>
        <p>scene_position.z : ${(camera.scene_position.z - camera.jump.velocity).toFixed(3)}</p>
        <p>rotation.x : ${camera.rotation.x.toFixed(3)}</p>
        <p>rotation.y : ${camera.rotation.y.toFixed(3)}</p>
        <p>rotation.z : ${camera.rotation.z.toFixed(3)}</p>
    `
}

const addObjects = () => {
    for (let i = 0 ; i < 10 ; i++){
        const tree = new Tree({
            position: {x: i*50, y: i*50, z: 40},
            size: 100
        })
        scene.appendChild(tree.dom_element)
        scene_objects[tree.id] = tree
    }
}

const loop = () => {
    requestAnimationFrame(loop)
    camera.update({scene_objects: scene_objects})
    applyTransforms()
}

initListeners()
addObjects()
loop()