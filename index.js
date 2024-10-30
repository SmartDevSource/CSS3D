const scene = document.getElementById('scene')
const scene_wrapper = document.getElementById('scene-wrapper')
const camera = document.getElementById('camera')
const tree = document.getElementById('tree')
const tree2 = document.getElementById('tree2')

const mouse = {
    x: 0,
    y: 0,
    sens: .01
}
const rotation = {
    x: 0,
    y: 0,
    z: 0
}
const position = {
    x: 0,
    y: 0,
    z: 10
}
const speeds = {
    rotate: .05,
    move: .1,
    max_move: 3,
    accel_move: .1,
    vertical: 1
}
const actions = {
    rotate_left: false,
    rotate_right: false,
    forward_move: false,
    backward_move: false,
    up_move: false,
    down_move: false
}

const initListeners = () => {
    window.addEventListener('click', () => {
        scene.requestPointerLock()
    })
    window.addEventListener('keydown', e => {
        switch(e.key.toLowerCase()){
            case 'q': actions.rotate_left = true; break
            case 'd': actions.rotate_right = true; break
            case 'z': actions.forward_move = true; break
            case 's': actions.backward_move = true; break
            case '+': actions.up_move = true; break
            case '-': actions.down_move = true; break
        }
    })
    window.addEventListener('keyup', e => {
        switch(e.key.toLowerCase()){
            case 'q': actions.rotate_left = false; break
            case 'd': actions.rotate_right = false; break
            case 'z': actions.forward_move = false; break
            case 's': actions.backward_move = false; break
            case '+': actions.up_move = false; break
            case '-': actions.down_move = false; break
        }
    })
    document.addEventListener('mousemove', e => {
        if (document.pointerLockElement === scene){
            const speed_x = e.movementX * mouse.sens
            const speed_y = e.movementY * mouse.sens
            rotation.z -= speed_x
            rotation.x -= speed_y
        }
    })
}

const move = () => {
    if (actions.rotate_left) rotation.z += speeds.rotate
    if (actions.rotate_right) rotation.z -= speeds.rotate
    if (actions.forward_move) speeds.move < speeds.max_move ? speeds.move += speeds.accel_move : speeds.max_move
    if (actions.backward_move) speeds.move > -speeds.max_move ? speeds.move -= speeds.accel_move : -speeds.max_move
    if (!actions.forward_move && !actions.backward_move){
        if (speeds.move > 0) speeds.move -= speeds.accel_move
        if (speeds.move < 0) speeds.move += speeds.accel_move
        if (Math.abs(speeds.move) <= speeds.accel_move) speeds.move = 0
    }
    if (actions.up_move) position.z -= speeds.vertical
    if (actions.down_move) position.z += speeds.vertical

    position.x += speeds.move * Math.sin(rotation.z)
    position.y += speeds.move * Math.cos(rotation.z)

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
}

const loop = () => {
    requestAnimationFrame(loop)
    move()
}

initListeners()
loop()