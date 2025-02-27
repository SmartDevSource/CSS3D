import { Crosshair } from "./crosshair.js"

const CAMERA_OFFSET = {x: 0, y: 960}

const getComputedPosition = (camera_position) => {
    return {
        x: CAMERA_OFFSET.x - camera_position.x,
        y: CAMERA_OFFSET.y - camera_position.y
    }
}

export class Camera {
    constructor({scene, camera_position}){
        const computed_position = getComputedPosition(camera_position)

        this.scene = scene
        this.css_position = camera_position
        this.scene_position = {x: computed_position.x, y: computed_position.y, z: 0}
        this.rotation = {x: 0, y: 0, z: 0, min_x: -1.3, max_x: .8}
        this.map_offset = {x: -390, y: 480, z: 35}
        this.velocities = {move: .1, lateral: .1, max_move: 2, accel: .1, vertical: 1}
        this.jump = {accel: 1, max: 12, state: 'idle', velocity: 0, is_active: false}
        this.mouse = {x: 0, y: 0, sens: .001}
        this.actions = {
            left_move: false,
            right_move: false,
            forward_move: false,
            backward_move: false,
            jump: false,
            up_move: false,
            down_move: false
        }
        this.crosshair = new Crosshair()
        this.toCSSCoords()
        this.initListeners()
    }

    initListeners(){
        window.addEventListener('keydown', e => {
            switch(e.key.toLowerCase()){
                case 'q': this.actions.left_move = true; break
                case 'd': this.actions.right_move = true; break
                case 'z': this.actions.forward_move = true; break
                case 's': this.actions.backward_move = true; break
                case '+': this.actions.up_move = true; break
                case '-': this.actions.down_move = true; break
                case ' ': this.handleJumpEvent(); break
            }
        })
        window.addEventListener('keyup', e => {
            switch(e.key.toLowerCase()){
                case 'q': this.actions.left_move = false; break
                case 'd': this.actions.right_move = false; break
                case 'z': this.actions.forward_move = false; break
                case 's': this.actions.backward_move = false; break
                case '+': this.actions.up_move = false; break
                case '-': this.actions.down_move = false; break
                case ' ': this.jump.is_active = false; break
            }
        })
        window.addEventListener('mousemove', e => {
            if (document.pointerLockElement === this.scene){
                const speed_x = e.movementX * this.mouse.sens
                const speed_y = e.movementY * this.mouse.sens
                this.rotation.z -= speed_x
                this.rotation.x -= speed_y
                if (this.rotation.x - speed_y < this.rotation.min_x){
                    this.rotation.x = this.rotation.min_x
                } else if (this.rotation.x - speed_y > this.rotation.max_x){
                    this.rotation.x = this.rotation.max_x
                }
                this.rotation.z = (this.rotation.z + Math.PI * 2) % (Math.PI * 2)
            }
        })
    }
    update(scene_objects){
        if (this.actions.forward_move) {
            this.velocities.move < this.velocities.max_move ? 
            this.velocities.move += this.velocities.accel : 
            this.velocities.max_move
        }
        if (this.actions.backward_move) {
            this.velocities.move > -this.velocities.max_move ? 
            this.velocities.move -= this.velocities.accel :
            -this.velocities.max_move
        }
        if (this.actions.left_move) {
            this.velocities.lateral < this.velocities.max_move ? 
            this.velocities.lateral += this.velocities.accel :
            this.velocities.max_move
        }
        if (this.actions.right_move) {
            this.velocities.lateral > -this.velocities.max_move ?
            this.velocities.lateral -= this.velocities.accel :
            -this.velocities.max_move
        }
        if (!this.actions.forward_move && !this.actions.backward_move){
            if (this.velocities.move > 0) this.velocities.move -= this.velocities.accel
            if (this.velocities.move < 0) this.velocities.move += this.velocities.accel
            if (Math.abs(this.velocities.move) <= this.velocities.accel) this.velocities.move = 0
        }
        if (!this.actions.left_move && !this.actions.right_move){
            if (this.velocities.lateral > 0) this.velocities.lateral -= this.velocities.accel
            if (this.velocities.lateral < 0) this.velocities.lateral += this.velocities.accel
            if (Math.abs(this.velocities.lateral) <= this.velocities.accel) this.velocities.lateral = 0
        }
        if (this.actions.up_move) this.css_position.z -= this.velocities.vertical
        if (this.actions.down_move) this.css_position.z += this.velocities.vertical

        ////////////////////// JUMPING //////////////////////
        switch(this.jump.state){
            case 'ascending':
                this.jump.velocity += this.jump.accel
                if (this.jump.velocity >= this.jump.max){
                    this.jump.state = 'descending'
                }
            break
            case 'descending':
                this.jump.velocity -= this.jump.accel
                if (this.jump.velocity < 0){
                    this.jump.state = 'idle'
                }
            break
        }

        this.css_position.x += this.velocities.move * Math.sin(this.rotation.z) + 
                                this.velocities.lateral * Math.cos(this.rotation.z)
        this.css_position.y += this.velocities.move * Math.cos(this.rotation.z) -
                                this.velocities.lateral * Math.sin(this.rotation.z)

        this.toSceneCoords()
        this.crosshair.update({
            scene_objects: scene_objects,
            css_position: this.css_position,
            scene_position: this.scene_position,
            rotation: this.rotation
        })
    }

    toSceneCoords(){
        this.scene_position.x = -(this.css_position.x + this.map_offset.x)
        this.scene_position.y = this.css_position.y + this.map_offset.y
        this.scene_position.z = this.css_position.z + this.map_offset.z
    }

    toCSSCoords(){
        this.css_position.x = (this.scene_position.x - this.map_offset.x)
        this.css_position.y = this.scene_position.y - this.map_offset.y
        this.css_position.z = this.scene_position.z - this.map_offset.z
    }

    handleJumpEvent = () => {
        if (this.jump.state === 'idle' && !this.jump.is_active){
            this.jump.state = 'ascending'
            this.jump.is_active = true
        } 
    }
}