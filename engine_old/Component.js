/**
 * The Component class.
 * Components are where the majority of the game code goes.
 * This class should be treated as though it were abstract.
 * (You should extend this class instead of called new Component.)
 */
class Component {
    /** The name of the component */
    name = this.constructor.name
    /**
     * The game object that acts holds this component
     * To assure that this is set properly,
     * always add components to game objects by using the
     * addComponent function.
     * */
    parent

    /**
     * Used by the engine to call start if it hasn't been called.
     * You should never have to alter this value directly
     */
    started = false

    listeners = []

    addListener(listener) {
        this.listeners.push(listener)
    }

    updateListeners(eventName) {
        for (let listener of this.listeners) {
            if (listener.handleUpdate) {
                listener.handleUpdate(this, eventName)
            }
        }
    }

    /**
     * To emulate the API of unity, tranform is a read-only property
     * that retrieves the the transform component on the parent
     * game object
     */
    get transform() {
        return this.parent.components[0]
    }
    //Since we do not have "set transform(newTransform)"
    //transform is read-only

    // linear interpolation
    static lerp = (start, end, amount) => (1 - amount) * start + amount * end
}

window.Component = Component
