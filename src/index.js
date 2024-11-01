import { mouse, rotation, camera_position, 
        velocities, actions, jump,
        scene_objects, absolute_position,
        map_offset } from './vars.js'

import { Tree } from './objects/tree.js'

const scene = document.getElementById('scene')
const scene_wrapper = document.getElementById('scene-wrapper')
const hud = document.getElementById('hud')
const crosshair = document.getElementById('crosshair')

const crosshair_coords = {
    x: crosshair.getBoundingClientRect().left + crosshair.getBoundingClientRect().width / 2,
    y: crosshair.getBoundingClientRect().top + crosshair.getBoundingClientRect().height / 2,
}

const tree_1 = new Tree({
    position: {x: 0, y: 0, z: 40},
    // position: {x: 250, y: 800, z: 40},
    size: 100
})

scene_objects.push(tree_1.tree)
scene_objects.forEach(scene_object => {
    scene.appendChild(scene_object)
})

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
            if (rotation.z > Math.PI * 2) rotation.z = 0
            if (rotation.z < 0) rotation.z = Math.PI * 2
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
    if (actions.up_move) camera_position.z -= velocities.vertical
    if (actions.down_move) camera_position.z += velocities.vertical

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

    camera_position.x += velocities.move * Math.sin(rotation.z) + velocities.lateral * Math.cos(rotation.z)
    camera_position.y += velocities.move * Math.cos(rotation.z) - velocities.lateral * Math.sin(rotation.z)

    absolute_position.x = -(camera_position.x + map_offset.x)
    absolute_position.y = camera_position.y + map_offset.y
    absolute_position.z = camera_position.z + map_offset.z
}

const applyTransforms = () => {
    scene.style.transform = `
        rotateX(${rotation.x}rad)
        rotateZ(${rotation.z}rad)
        translateX(${camera_position.x}px)
        translateY(${camera_position.y}px)
        translateZ(${camera_position.z - jump.velocity}px)
    `

    scene_wrapper.style.transform = `rotateX(90deg)`

    const trees = scene.querySelectorAll('.tree')
    trees.forEach(tree => {
        tree.style.transform = `
            rotateZ(${-rotation.z}rad)
            rotateX(-90deg)
        `
        crosshairScan(tree)

    })

    hud.innerHTML = `
        <p>camera_position.x : ${camera_position.x.toFixed(3)}</p>
        <p>camera_position.y : ${camera_position.y.toFixed(3)}</p>
        <p>camera_position.z : ${(camera_position.z - jump.velocity).toFixed(3)}</p>
        <p>absolute_position.x : ${absolute_position.x.toFixed(3)}</p>
        <p>absolute_position.y : ${absolute_position.y.toFixed(3)}</p>
        <p>absolute_position.z : ${(absolute_position.z - jump.velocity).toFixed(3)}</p>
        <p>rotation.x : ${rotation.x.toFixed(3)}</p>
        <p>rotation.y : ${rotation.y.toFixed(3)}</p>
        <p>rotation.z : ${rotation.z.toFixed(3)}</p>
    `
}

const crosshairScan = (scene_object) => {
    const object_coords = {
        left: scene_object.getBoundingClientRect().left,
        right: scene_object.getBoundingClientRect().right,
        top: scene_object.getBoundingClientRect().top,
        bottom: scene_object.getBoundingClientRect().bottom
    }

    const ang = Math.atan2(
        camera_position.y - tree_1.position.y,
        camera_position.x - tree_1.position.x
    )
    console.log(ang)

    if (crosshair_coords.x >= object_coords.left && 
        crosshair_coords.x <= object_coords.right &&
        crosshair_coords.y >= object_coords.top && 
        crosshair_coords.y <= object_coords.bottom
    ){
        console.log('HIT !!!')
    }
}

const loop = () => {
    requestAnimationFrame(loop)
    updatePosition()
    applyTransforms()
}

initListeners()
loop()