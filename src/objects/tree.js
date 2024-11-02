export class Tree{
    constructor({position, size}){
        this.id = this.generateId()
        this.dom_element = this.createElement(position, size)
        this.position = position
        this.size = size
    }
    createElement(position, size){
        const tree_wrapper = document.createElement('div')
        tree_wrapper.style.position = 'absolute'
        tree_wrapper.style.transform = `
            translateX(${position.x}px)
            translateY(${-position.y - size}px)
            translateZ(${position.z}px)
        `
        const tree = document.createElement('img')
        tree.style.width = `${size}px`
        tree.setAttribute('class', 'tree scene-object')
        tree.setAttribute('id', this.id)
        tree.setAttribute('src', `../../assets/gfx/tree.png`)

        tree_wrapper.appendChild(tree)
        return tree_wrapper
    }
    generateId(){
        const id = ((Math.random() * (999_999 - 100_000) + 100_000).toString() +
                    new Date().getTime().toString() +
                    (Math.random() * (999_999 - 100_000) + 100_000).toString()).replaceAll('.', '')
        return id
    }
}