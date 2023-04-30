/**
 * The game object class. All components are contianed in game objects
 * Game objects are not abstract, you can directly create game objects
 * as needed.
 * See https://docs.unity3d.com/ScriptReference/GameObject.html
 */
class GameObject {
    /** The name of the game object */
    name = ''
    /** The list of components in the game object */
    components = []
    /** Whether the game object has been started. */
    started = false

    markedForDestroy = false

    markedDoNotDestroyOnLoad = false

    /**
     * The constructor. This assigns a name and creates and adds
     * a transform component.
     * @param {string} name The name of the new game object.
     */
    constructor(name) {
        this.name = name
        this.addComponent(new Transform())
    }

    /**
     * A property to get the trasform on this game object.
     * See https://docs.unity3d.com/ScriptReference/GameObject-transform.html
     * */
    get transform() {
        return this.components[0]
    }

    set transform(t) {
        if (!t instanceof Transform)
            throw 'Tried to set transform to a non-transform reference.'
        this.components[0] = t
    }

    /**
     * Add a component to the game obect and assign its parent
     * to be this game object.
     * See https://docs.unity3d.com/ScriptReference/GameObject.AddComponent.html
     * @param {Component} component The component to add to the game object.
     * @returns this game object (makes this a fluent interface)
     */
    addComponent(component) {
        this.components.push(component)
        component.parent = this
        return this
    }

    /**
     * Search the game objects in the active scene for the first one
     * with a given name.
     * @param {string} name The name to search for.
     * @returns The first game object with that name. Undefined otherwise.
     */
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

    /**
     * Search for a game object by name.
     * This maps to the find function in Unity.
     * See https://docs.unity3d.com/ScriptReference/GameObject.Find.html
     *
     * @param {string} name See getObjectByName
     * @returns See getObjectByName
     */
    static find(name) {
        return GameObject.getObjectByName(name)
    }

    /**
     * Find the first component with the specificed name.
     * See https://docs.unity3d.com/ScriptReference/GameObject.GetComponent.html
     *
     * Note that the Unity API takes a type as a generic argument. Since JS lacks this
     * functionality, we use the name instead.
     * @param {string} name
     * @returns The first game objecte with the name. Undefined if no
     * component is found.
     */
    getComponent(name) {
        return this.components.find((c) => c.name == name)
    }

    destroy() {
        this.markedForDestroy = true
    }

    // static lerp = (start, end, amount) => (1 - amount) * start + amount * end

    static instantiate(gameObject) {
        SceneManager.getActiveScene().gameObjects.push(gameObject)
        if (gameObject.start && !gameObject.started) {
            gameObject.started = true
            gameObject.start()
        }
    }
}

window.GameObject = GameObject
