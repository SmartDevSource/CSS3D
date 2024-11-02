export class SceneObject{
    constructor({position, size, object_type}){
        this.object_type = object_type
        this.id = this.generateId()
        this.dom_element = this.createElement(position, size)
        this.position = position
        this.size = size
    }
    createElement(position, size){
        const object_wrapper = document.createElement('div')
        object_wrapper.style.position = 'absolute'
        object_wrapper.style.transform = `
            translateX(${position.x}px)
            translateY(${-position.y - size}px)
            translateZ(${position.z}px)
        `
        const object = document.createElement('img')
        object.style.width = `${size}px`
        object.setAttribute('class', `${this.object_type} scene-object`)
        object.setAttribute('id', this.id)
        object.setAttribute('src', `../../assets/gfx/${this.object_type}.png`)

        object_wrapper.appendChild(object)
        return object_wrapper
    }
    generateId(){
        const id = ((Math.random() * (999_999 - 100_000) + 100_000).toString() +
                    new Date().getTime().toString() +
                    (Math.random() * (999_999 - 100_000) + 100_000).toString()).replaceAll('.', '')
        return id
    }
    
}