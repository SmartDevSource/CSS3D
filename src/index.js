import { mouse, rotation, position, 
        velocities, actions, jump,
        scene_objects } from './vars.js'

import { Tree } from './objects/tree.js'

const scene = document.getElementById('scene')
const scene_wrapper = document.getElementById('scene-wrapper')
const hud = document.getElementById('hud')
const crosshair = document.getElementById('crosshair')

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
            case '+': actions.up_move = true; break
            case '-': actions.down_move = true; break
            case ' ': handleJumpEvent(); break
        }
    })
    window.addEventListener('keyup', e => {
        switch(e.key.toLowerCase()){
            case 'q': actions.left_move = false; break
            case 'd': actions.right_move = false; break
            case 'z': actions.forward_move = false; break
            case 's': actions.backward_move = false; break
            case '+': actions.up_move = false; break
            case '-': actions.down_move = false; break
            case ' ': jump.is_active = false; break
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

const handleJumpEvent = () => {
    if (jump.state === 'idle' && !jump.is_active){
        jump.state = 'ascending'
        jump.is_active = true
    } 
}

const updatePosition = () => {
    if (actions.forward_move) velocities.move < velocities.max_move ? velocities.move += velocities.accel : velocities.max_move
    if (actions.backward_move) velocities.move > -velocities.max_move ? velocities.move -= velocities.accel : -velocities.max_move
    if (actions.left_move) velocities.lateral < velocities.max_move ? velocities.lateral += velocities.accel : velocities.max_move
    if (actions.right_move) velocities.lateral > -velocities.max_move ? velocities.lateral -= velocities.accel : -velocities.max_move

    if (!actions.forward_move && !actions.backward_move){
        if (velocities.move > 0) velocities.move -= velocities.accel
        if (velocities.move < 0) velocities.move += velocities.accel
        if (Math.abs(velocities.move) <= velocities.accel) velocities.move = 0
    }
    if (!actions.left_move && !actions.right_move){
        if (velocities.lateral > 0) velocities.lateral -= velocities.accel
        if (velocities.lateral < 0) velocities.lateral += velocities.accel
        if (Math.abs(velocities.lateral) <= velocities.accel) velocities.lateral = 0
    }
    if (actions.up_move) position.z -= velocities.vertical
    if (actions.down_move) position.z += velocities.vertical

    ////////////////////// JUMPING //////////////////////
    switch(jump.state){
        case 'ascending':
            jump.velocity += jump.accel
            if (jump.velocity >= jump.max){
                jump.state = 'descending'
            }
        break
        case 'descending':
            jump.velocity -= jump.accel
            if (jump.velocity < 0){
                jump.state = 'idle'
            }
        break
    }

    position.x += velocities.move * Math.sin(rotation.z) + velocities.lateral * Math.cos(rotation.z)
    position.y += velocities.move * Math.cos(rotation.z) - velocities.lateral * Math.sin(rotation.z)
}

const applyTransforms = () => {
    scene.style.transform = `
        rotateX(${rotation.x}rad)
        rotateZ(${rotation.z}rad)
        translateX(${position.x}px)
        translateY(${position.y}px)
        translateZ(${position.z - jump.velocity}px)
    `

    scene_wrapper.style.transform = `rotateX(90deg)`

    const trees = scene.querySelectorAll('.tree')
    trees.forEach(tree => {
        tree.style.transform = `
            rotateZ(${-rotation.z}rad)
            rotateX(-90deg)
        `
    })

    hud.innerHTML = `
        <p>position.x : ${position.x.toFixed(3)}</p>
        <p>position.y : ${position.y.toFixed(3)}</p>
        <p>position.z : ${(position.z - jump.velocity).toFixed(3)}</p>
        <p>rotation.x : ${rotation.x.toFixed(3)}</p>
        <p>rotation.y : ${rotation.y.toFixed(3)}</p>
        <p>rotation.z : ${rotation.z.toFixed(3)}</p>
    `
}

const crosshairScan = (scene_objects) => {
    scene_objects.forEach(scene_object => {
        const object_coords = {
            x: scene_object.getBoundingClientRect().x,
            y: scene_object.getBoundingClientRect().y,
            w: scene_object.getBoundingClientRect().width,
            h: scene_object.getBoundingClientRect().height
        }
        const crosshair_coords = {
            x: crosshair.getBoundingClientRect().x,
            y: crosshair.getBoundingClientRect().y,
        }
        if (crosshair_coords.x >= object_coords.x && crosshair_coords.x <= object_coords.x + object_coords.h &&
            crosshair_coords.y >= object_coords.y && crosshair_coords.y <= object_coords.y + object_coords.h
        ){
            console.log('HIT !!!')
        }
        console.log("object_coords", object_coords)
        console.log("crosshair_coords", crosshair_coords)
    })
}

const tree_one = new Tree({position: {x: 100, y: -100, z: 20}})
// const tree_two = new Tree({position: {x: 200, y: -100, z: 20}})

scene_objects.push(tree_one.tree)
scene_objects.forEach(scene_object => {
    scene.appendChild(scene_object)
})

const loop = () => {
    requestAnimationFrame(loop)
    updatePosition()
    applyTransforms()
    crosshairScan(scene_objects)
}

initListeners()
loop()