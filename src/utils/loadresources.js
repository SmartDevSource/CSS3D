import { objects_data } from '../data/objects_data.js'
import { SceneObject } from '../objects/scene_object.js'

export const loadObjects = async (scene, scene_objects) => {
    return new Promise((resolve, reject) => {
        try {
            objects_data.forEach(object_data => {
                const scene_object = new SceneObject({
                    position: object_data.position,
                    size: object_data.size,
                    object_type: object_data.type
                })
                scene.appendChild(scene_object.dom_element)
                scene_objects[scene_object.id] = scene_object
            })
            resolve(`Scene objects loaded successfully`)
        } catch (err) {
            reject(`Error while loading scene objects : ${err}`)
        }
    })
}
