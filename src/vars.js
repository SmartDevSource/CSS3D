export const scene_objects = {}
export const current_target = {
    id: null,
    type: ''
}
export const map_offset = {
    x: -390,
    y: 480,
    z: 35
}
export const mouse = {
    x: 0,
    y: 0,
    sens: .001
}
export const rotation = {
    x: 0,
    y: 0,
    z: 0,
    min_x: -1.3,
    max_x: .8
}
export const camera_position = {
    x: 0,
    y: 0,
    z: -35
}
export const absolute_position = {
    x: 0, y: 0, z: 0
}
export const velocities = {
    move: .1,
    lateral: .1,
    max_move: 2,
    accel: .1,
    vertical: 1
}
export const jump = {
    accel: 1,
    max: 12,
    state: 'idle',
    velocity: 0,
    is_active: false
}
export const actions = {
    rotate_left: false,
    rotate_right: false,
    left_move: false,
    right_move: false,
    forward_move: false,
    backward_move: false,
    jump: false,
    up_move: false,
    down_move: false
}