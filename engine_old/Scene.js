/**
 * The scene class.
 *
 * Scenes are containers for game objects.
 * See https://docs.unity3d.com/Manual/CreatingScenes.html
 */
class Scene {
    /** List of game objects in the scene */
    gameObjects = []

    constructor(fillStyle) {
        this.addGameObject(
            new GameObject('CameraGameObject').addComponent(
                new Camera(fillStyle)
            )
        )
    }

    /**
     * Add a game object to a scene.
     * Eventually we will switch to using Instantiate
     * See https://docs.unity3d.com/ScriptReference/Object.Instantiate.html
     *
     * @param {GameObject} gameObject The game object to add
     */
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
