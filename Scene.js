// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Scene.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Scene {
    gameObjects = []

    constructor(fillStyle) {
        this.addGameObject(
            new GameObject('CameraGameObject').addComponent(
                new Camera(fillStyle)
            )
        )
    }

    addGameObject(
        gameObject,
        translate = Vector2.zero,
        scale = Vector2.one,
        rotation = 0
    ) {
        this.gameObjects.push(gameObject)
        gameObject.transform.x = translate.x
        gameObject.transform.y = translate.y
        gameObject.transform.sx = scale.x
        gameObject.transform.sy = scale.y
        gameObject.transform.r = rotation

        if (gameObject.start && !gameObject.started) {
            gameObject.started = true
            gameObject.start()
        }

        return gameObject
    }

    addGameObjectTransform(gameObject, transform = new Transform()) {
        this.gameObjects.push(gameObject)
        gameObject.transform = transform
    }
}

window.Scene = Scene
