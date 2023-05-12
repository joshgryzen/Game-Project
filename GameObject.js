// Transcribed and modified from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/GameObject.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class GameObject {
    name = ''
    components = []
    started = false

    markedForDestroy = false

    markedDoNotDestroyOnLoad = false

    layer = 0

    constructor(name) {
        this.name = name
        this.addComponent(new Transform())
    }

    get transform() {
        return this.components[0]
    }
    set transform(t) {
        if (!t instanceof Transform)
            throw 'Tried to set transform to a non-transform reference.'
        this.components[0] = t
    }

    addComponent(component) {
        this.components.push(component)
        component.parent = this
        return this
    }

    static getObjectByName(name) {
        return SceneManager.getActiveScene().gameObjects.find(
            (gameObject) => gameObject.name == name
        )
    }

    static getObjectsByName(name) {
        return SceneManager.getActiveScene().gameObjects.filter(
            (gameObject) => gameObject.name == name
        )
    }

    static find(name) {
        return GameObject.getObjectByName(name)
    }

    getComponent(name) {
        return this.components.find((c) => c.name == name)
    }

    destroy() {
        this.markedForDestroy = true
    }

    doNotDestroyOnLoad() {
        this.markedDoNotDestroyOnLoad = true
    }

    static instantiate(gameObject) {
        SceneManager.getActiveScene().gameObjects.push(gameObject)
        if (gameObject.start && !gameObject.started) {
            gameObject.started = true
            gameObject.start()
        }
    }
}

window.GameObject = GameObject
