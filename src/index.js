import { mouse, rotation, position, speeds, actions } from './vars.js'

const scene = document.getElementById('scene')
const scene_wrapper = document.getElementById('scene-wrapper')
const hud = document.getElementById('hud')
const tree = document.getElementById('tree')
const tree2 = document.getElementById('tree2')

const initListeners = () => {
    window.addEventListener('click', () => {
        scene.requestPointerLock()
    })
    window.addEventListener('keydown', e => {
        switch(e.key.toLowerCase()){
            case 'q': actions.left_move = true; break
            case 'd': actions.right_move = true; break
            case 'z': actions.forward_move = true; break
            case 's': actions.backward_move = true; break
            case ' ': actions.up_move = true; break
            case 'control': actions.down_move = true; break
        }
    })
    window.addEventListener('keyup', e => {
        switch(e.key.toLowerCase()){
            case 'q': actions.left_move = false; break
            case 'd': actions.right_move = false; break
            case 'z': actions.forward_move = false; break
            case 's': actions.backward_move = false; break
            case ' ': actions.up_move = false; break
            case 'control': actions.down_move = false; break
        }
    })
    document.addEventListener('mousemove', e => {
        if (document.pointerLockElement === scene){
            const speed_x = e.movementX * mouse.sens
            const speed_y = e.movementY * mouse.sens
            rotation.z -= speed_x
            rotation.x -= speed_y
            if (rotation.x - speed_y < rotation.min_x){
                rotation.x = rotation.min_x
            } else if (rotation.x - speed_y > rotation.max_x){
                rotation.x = rotation.max_x
            }
        }
    })
}

const updatePosition = () => {
    if (actions.forward_move) speeds.move < speeds.max_move ? speeds.move += speeds.accel_move : speeds.max_move
    if (actions.backward_move) speeds.move > -speeds.max_move ? speeds.move -= speeds.accel_move : -speeds.max_move
    if (actions.left_move) speeds.lateral < speeds.max_move ? speeds.lateral += speeds.accel_move : speeds.max_move
    if (actions.right_move) speeds.lateral > -speeds.max_move ? speeds.lateral -= speeds.accel_move : -speeds.max_move

    if (!actions.forward_move && !actions.backward_move){
        if (speeds.move > 0) speeds.move -= speeds.accel_move
        if (speeds.move < 0) speeds.move += speeds.accel_move
        if (Math.abs(speeds.move) <= speeds.accel_move) speeds.move = 0
    }
    if (!actions.left_move && !actions.right_move){
        if (speeds.lateral > 0) speeds.lateral -= speeds.accel_move
        if (speeds.lateral < 0) speeds.lateral += speeds.accel_move
        if (Math.abs(speeds.lateral) <= speeds.accel_move) speeds.lateral = 0
    }

    if (actions.up_move) position.z -= speeds.vertical
    if (actions.down_move) position.z += speeds.vertical

    position.x += speeds.move * Math.sin(rotation.z) + speeds.lateral * Math.cos(rotation.z)
    position.y += speeds.move * Math.cos(rotation.z) - speeds.lateral * Math.sin(rotation.z)
}

const applyTransforms = () => {
    scene.style.transform = `
    rotateX(${rotation.x}rad)
    rotateZ(${rotation.z}rad)
    translateX(${position.x}px)
    translateY(${position.y}px)
    translateZ(${position.z}px)
    `

    scene_wrapper.style.transform = `
        rotateX(90deg)
    `

    tree.style.transform = `
        rotateZ(${-rotation.z}rad)
        rotateX(-90deg)
    `

    tree2.style.transform = `
        rotateZ(${-rotation.z}rad)
        rotateX(-90deg)
    `

    hud.innerHTML = `
        <p>position.x : ${position.x.toFixed(3)}</p>
        <p>position.y : ${position.y.toFixed(3)}</p>
        <p>position.z : ${position.z.toFixed(3)}</p>
        <p>rotation.x : ${rotation.x.toFixed(3)}</p>
        <p>rotation.y : ${rotation.y.toFixed(3)}</p>
        <p>rotation.z : ${rotation.z.toFixed(3)}</p>
    `
}

const loop = () => {
    requestAnimationFrame(loop)
    updatePosition()
    applyTransforms()
}

initListeners()
loop()