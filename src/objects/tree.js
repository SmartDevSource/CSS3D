export class Tree{
    constructor({position}){
        this.tree = this.createElement(position)
    }
    createElement(position){
        const tree_wrapper = document.createElement('div')
        tree_wrapper.style.position = 'absolute'
        tree_wrapper.style.transform = `
            translateX(${position.x}px)
            translateY(${position.y}px)
            translateZ(${position.z}px)
        `
        const tree = document.createElement('img')
        tree.setAttribute('src', `../../assets/gfx/tree.png`)
        tree.setAttribute('class', 'tree')

        tree_wrapper.appendChild(tree)
        return tree_wrapper
    }
}