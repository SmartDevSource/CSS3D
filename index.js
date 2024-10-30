const scene = document.getElementById('scene')
const camera = document.getElementById('camera')
const tree = document.getElementById('tree')

const euler = {x: 0, y: 0, z: 0}
const position = {x: 0, y: 0, z: 10}
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

const move = () => {
    if (actions.rotate_left) euler.z += speeds.rotate
    if (actions.rotate_right) euler.z -= speeds.rotate
    if (actions.forward_move) speeds.move < speeds.max_move ? speeds.move += speeds.accel_move : speeds.max_move
    if (actions.backward_move) speeds.move > -speeds.max_move ? speeds.move -= speeds.accel_move : -speeds.max_move
    if (!actions.forward_move && !actions.backward_move){
        if (speeds.move > 0) speeds.move -= speeds.accel_move
        if (speeds.move < 0) speeds.move += speeds.accel_move
        if (Math.abs(speeds.move) <= speeds.accel_move) speeds.move = 0
    }
    if (actions.up_move) position.z -= speeds.vertical
    if (actions.down_move) position.z += speeds.vertical

    position.x += speeds.move * Math.sin(euler.z)
    position.y += speeds.move * Math.cos(euler.z)

    scene.style.transform = `
        rotateZ(${euler.z}rad)
        translateX(${position.x}px)
        translateY(${position.y}px)
        translateZ(${position.z}px)
    `

    tree.style.transform = `
        rotateZ(${-euler.z}rad)
        rotateX(-90deg)
    `
}

const loop = () => {
    requestAnimationFrame(loop)
    move()
}

loop()