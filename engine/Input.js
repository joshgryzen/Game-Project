// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Input.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Input {
    static mouseX = 0
    static mouseY = 0

    // Previous x location
    static lastMouseX = 0

    // Previous y location
    static lastMouseY = 0

    // Last mouse wheel
    static lastWheel = 0

    static mouseDown = false
    static mouseUp = false

    static keyUp = []
    static keyDown = []

    static finishFrame() {
        Input.lastWheel = 0
        Input.lastMouseX = Input.mouseX
        Input.lastMouseY = Input.mouseY
        Input.tick = 0
        Input.mouseUp = false
    }

    static start() {
        let canvas = document.querySelector('#canv')

        // Mousemove event to canvas -> See https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
        canvas.addEventListener('mousemove', (e) => {
            Input.mouseX = e.clientX
            Input.mouseY = e.clientY
        })

        // Mousedown event to canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event
        canvas.addEventListener('mousedown', (e) => {
            Input.lastMouseX = Input.mouseX
            Input.lastMouseY = Input.mouseY

            Input.mouseX = e.clientX
            Input.mouseY = e.clientY
            Input.mouseDown = true
        })

        // Mouseup event to canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event
        canvas.addEventListener('mouseup', (e) => {
            Input.lastMouseX = Input.mouseX
            Input.lastMouseY = Input.mouseY
            Input.mouseX = e.clientX
            Input.mouseY = e.clientY
            Input.mouseDown = false
            Input.mouseUp = true
        })

        // Wheel event to canvas (mousewheel event is deprecated) -> https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
        canvas.addEventListener('wheel', (e) => {
            Input.lastWheel = e.deltaY
        })

        // Keyup event to canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
        document.addEventListener('keyup', (e) => {})

        // Keydown event to the canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
        document.addEventListener('keydown', (e) => {})

        // Keypress event to the canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
        document.addEventListener('keypress', (e) => {})

        // Touchstart event to the canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event
        canvas.addEventListener('touchstart', (e) => {})

        // Touchend event to the canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event
        canvas.addEventListener('touchend', (e) => {})

        // Touchmove event to the canvas -> https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event
        canvas.addEventListener('touchmove', (e) => {
            for (let touchEvent of e.touches) {
                console.log(touchEvent.clientX + ', ' + touchEvent.clientX)
            }
            e.preventDefault()
        })
    }
}

//Attach Input to the global window variable
window.Input = Input
export default Input
