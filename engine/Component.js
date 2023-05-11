// Transcribed and modified from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Component.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Component {
    name = this.constructor.name
    parent

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

    get transform() {
        return this.parent.components[0]
    }

    // linear interpolation formula Jonathan showed me
    // Unity docs -> https://docs.unity3d.com/ScriptReference/Vector3.Lerp.html
    static lerp = (start, end, amount) => (1 - amount) * start + amount * end
    // static dist_x = (comp1, comp2) => comp1.transform.x - comp2.transform.x
}

window.Component = Component
