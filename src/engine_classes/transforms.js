export const applyTransforms = (camera, scene, scene_wrapper, scene_objects) => {
    scene.style.transform = `
        rotateX(${camera.rotation.x}rad)
        rotateZ(${camera.rotation.z}rad)
        translateX(${camera.css_position.x}px)
        translateY(${camera.css_position.y}px)
        translateZ(${camera.css_position.z - camera.jump.velocity}px)
    `

    scene_wrapper.style.transform = `rotateX(90deg)`

    const object_types = [...new Set(Object.values(scene_objects).map(obj => obj.object_type))]

    object_types.forEach(object_type => {
        const objects = scene.querySelectorAll(`.${object_type}`)
        objects.forEach(object => {
            object.style.transform = `
                rotateZ(${-camera.rotation.z}rad)
                rotateX(-90deg)
            `
        })
    })

}

export const drawHud = (hud, camera) => {
    hud.innerHTML = `
    <p>
        <span style="color: black">
            css_position [x / y / z] :
        </span>
        <span style="color: purple">
            ${camera.css_position.x.toFixed(3)} | 
            ${camera.css_position.y.toFixed(3)} | 
            ${(camera.css_position.z - camera.jump.velocity).toFixed(3)}
        </span>
    </p>
    <p>
        <span style="color: black">
            scene_position [x / y / z] : 
        </span>
        <span style="color: purple">
            ${camera.scene_position.x.toFixed(3)} | 
            ${camera.scene_position.y.toFixed(3)} | 
            ${(camera.scene_position.z - camera.jump.velocity).toFixed(3)}
        </span>
    </p>
    <p>
        <span style="color: black">
            rotation [x / y / z] : 
        </span>
        <span style="color: purple">
            ${camera.rotation.x.toFixed(3)} |  
            ${camera.rotation.y.toFixed(3)} | 
            ${camera.rotation.z.toFixed(3)}
        </span>
    </p>
`
}