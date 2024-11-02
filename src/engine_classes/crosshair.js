export class Crosshair {
    constructor(){
        this.current_target = {id: null, type: ''}
        this.crosshair = document.getElementById('crosshair')
        this.crosshair_coords = {
            x: this.crosshair.getBoundingClientRect().left + this.crosshair.getBoundingClientRect().width / 2,
            y: this.crosshair.getBoundingClientRect().top + this.crosshair.getBoundingClientRect().height / 2,
        }
        
    }
    update({scene_objects, css_position, scene_position, rotation}){
        const objects = document.querySelectorAll('.scene-object')
        this.current_target.id = null
        this.current_target.type = ''
        
        objects.forEach((object, index) => {
            const object_coords = {
                left: object.getBoundingClientRect().left,
                right: object.getBoundingClientRect().right,
                top: object.getBoundingClientRect().top,
                bottom: object.getBoundingClientRect().bottom
            }
            const horizontal_angle_diff = Math.atan2(
                scene_objects[object.id].position.y - scene_position.y,
                scene_objects[object.id].position.x - scene_position.x
            ) - rotation.z
            const horizontal_angle_normalized = Math.atan2(
                Math.sin(horizontal_angle_diff),
                Math.cos(horizontal_angle_diff)
            )
            const vertical_angle_diff = Math.atan2(
                scene_objects[object.id].position.z - css_position.z,
                Math.sqrt(
                    Math.pow(scene_objects[object.id].position.x - scene_position.x, 2) +
                    Math.pow(scene_objects[object.id].position.y - scene_position.y, 2)
                )
            ) - rotation.x
            const vertical_angle_normalized = Math.atan2(
                Math.sin(vertical_angle_diff),
                Math.cos(vertical_angle_diff)
            )
            if (this.crosshair_coords.x >= object_coords.left &&
                this.crosshair_coords.x <= object_coords.right &&
                this.crosshair_coords.y >= object_coords.top &&
                this.crosshair_coords.y <= object_coords.bottom &&
                horizontal_angle_normalized > 0)
                // &&
                // vertical_angle_normalized > 0 && vertical_angle_normalized < .8
            {
                this.current_target.id = object.id
            }
        })
        // console.log(this.current_target)
        // if (this.current_target.id){
        //     this.crosshair.style.color = 'red'
        // } else {
        //     this.crosshair.style.color = 'blue'
        // }
    }
}