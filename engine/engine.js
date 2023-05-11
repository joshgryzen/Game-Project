// Transcribed and modified from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/engine.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

import './GameObject.js'
import './Component.js'

import './Camera.js'
import './GUITextCentered.js'
import './Input.js'
import './Line.js'
import './Rectangle.js'
import './Scene.js'
import './SceneManager.js'
import './Text.js'
import './Time.js'
import './Transform.js'
import './Vector2.js'

class EngineGlobals {
    static requestedAspectRatio = 16 / 9
    static logicalWidth = 1
}

window.EngineGlobals = EngineGlobals

let pause = false

// TODO later add a cool favicon thingy
// Lines 34 - 38 in bricks engine code

// =================================================== //
//                  Input Handling                     //
// =================================================== //

let canvas = document.querySelector('#canv')
let ctx = canvas.getContext('2d')

let keysDown = []
let mouseX
let mouseY

// Event handlers for keydown and keyup
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

function keyUp(event) {
    keysDown[event.key] = false

    // pausing the engine
    if (event.key == 'p' || event.key == 'P') {
        pause != pause
    }
}

function keyDown(event) {
    keysDown[event.key] = true

    // Prevent default actions
    // Space scrolls the window
    // Shift does something funky ---> TODO add later
    if (event.key == ' ') {
        event.preventDefault()
    }
}

// =================================================== //
//                      Game Loop                      //
// =================================================== //

function gameLoop() {
    update()
    draw()
}

// =================================================== //
//                        Update                       //
// =================================================== //

function update() {
    // Don't update anything if the game is paused
    if (pause) return

    Time.update()

    // Get active scene
    let scene = SceneManager.getActiveScene()
    if (SceneManager.changedSceneFlag && scene.start) {
        let camera = scene.gameObjects[0]
        scene.gameObjects = []
        scene.gameObjects.push(camera)

        let previousScene = SceneManager.getPreviousScene()
        if (previousScene) {
            for (let gameObject of previousScene.gameObjects) {
                if (gameObject.markedDoNotDestroyOnLoad) {
                    scene.gameObjects.push(gameObject)
                }
            }
        }

        scene.start(ctx)
        SceneManager.changedSceneFlag = false
    }

    // Start game objects that have a start function
    for (let gameObject of scene.gameObjects) {
        // make sure they have not already started
        if (gameObject.start && !gameObject.started) {
            gameObject.start(ctx)
            gameObject.started = true
        }
    }

    // Start components that have a start function
    for (let gameObject of scene.gameObjects) {
        for (let component of gameObject.components) {
            // make sure they have not already started
            if (component.start && !component.started) {
                component.start(ctx)
                component.started = true
            }
        }
    }

    // Destroy things
    let keptGameObjects = []
    for (let gameObject of scene.gameObjects) {
        if (!gameObject.markedForDestroy) {
            keptGameObjects.push(gameObject)
        }
    }
    scene.gameObjects = keptGameObjects

    // Updated components that have an updated function
    for (let gameObject of scene.gameObjects) {
        for (let component of gameObject.components) {
            if (component.update) {
                component.update(ctx)
            }
        }
    }

    Input.finishFrame()
}

let letterboxColor = 'grey'

// =================================================== //
//                        Draw                         //
// =================================================== //

function draw() {
    // Getting the correct canvas dimensions from browser
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = Camera.main.fillStyle
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    let browserAspectRatio = canvas.width / canvas.height
    let offsetX = 0
    let offsetY = 0
    let browserWidth = canvas.width
    if (EngineGlobals.requestedAspectRatio > browserAspectRatio) {
        let desiredHeight = canvas.width / EngineGlobals.requestedAspectRatio
        let amount = (canvas.height - desiredHeight) / 2
        offsetY = amount
    } else {
        let desiredWidth = canvas.height * EngineGlobals.requestedAspectRatio
        let amount = (canvas.width - desiredWidth) / 2
        offsetX = amount
        browserWidth -= 2 * amount
    }

    let scene = SceneManager.getActiveScene()

    ctx.save()

    let logicalScaling = Camera.getLogicalScaleZoomable(ctx)
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    ctx.scale(logicalScaling, logicalScaling)

    ctx.translate(-Camera.main.transform.x, -Camera.main.transform.y)

    // Draw components
    // Layer shenanigans first
    let min = scene.gameObjects
        .filter((go) => go.components.some((c) => c.draw))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.min(previous, current), 0)

    let max = scene.gameObjects
        .filter((go) => go.components.some((c) => c.draw))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.max(previous, current), 0)

    for (let i = min; i <= max; i++) {
        let gameObjects = scene.gameObjects.filter((go) => go.layer == i)

        for (let gameObject of gameObjects) {
            for (let component of gameObject.components) {
                if (component.draw) {
                    component.draw(ctx)
                }
            }
        }
    }

    ctx.restore()

    // Letterboxing
    let zeroX = 0
    let zeroY = 0
    if (EngineGlobals.requestedAspectRatio > browserAspectRatio) {
        let desiredHeight = canvas.width / EngineGlobals.requestedAspectRatio
        let amount = (canvas.height - desiredHeight) / 2
        zeroY = amount
        ctx.fillStyle = letterboxColor
        ctx.fillRect(0, 0, canvas.width, amount)
        ctx.fillRect(0, canvas.height - amount, canvas.width, amount)
    } else {
        let desiredWidth = canvas.height * EngineGlobals.requestedAspectRatio
        let amount = (canvas.width - desiredWidth) / 2
        zeroX = amount
        ctx.fillStyle = letterboxColor
        ctx.fillRect(0, 0, amount, canvas.height)
        ctx.fillRect(canvas.width - amount, 0, amount, canvas.height)
    }

    // Draw UI
    // Layer shenanigans first
    logicalScaling = Camera.getLogicalScale(ctx)
    min = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawGUI))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.min(previous, current), 0)

    max = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawGUI))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.max(previous, current), 0)

    ctx.save()
    ctx.translate(zeroX, zeroY)
    ctx.scale(logicalScaling, logicalScaling)
    for (let i = min; i <= max; i++) {
        let gameObjects = scene.gameObjects.filter((go) => go.layer == i)

        for (let gameObject of gameObjects) {
            for (let component of gameObject.components) {
                if (component.drawGUI) {
                    component.drawGUI(ctx)
                }
            }
        }
    }

    ctx.restore()
    ctx.save()

    // Draw anything directly onto the screen last
    // Layer shenanigans as per usual
    min = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawScreen))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.min(previous, current), 0)

    max = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawScreen))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.max(previous, current), 0)

    ctx.save()
    for (let i = min; i <= max; i++) {
        let gameObjects = scene.gameObjects.filter((go) => go.layer == i)

        for (let gameObject of gameObjects) {
            for (let component of gameObject.components) {
                if (component.drawScreen) {
                    component.drawScreen(ctx)
                }
            }
        }
    }

    ctx.restore()

    // Draw debugging stuff
    let debug = false
    if (debug) {
        let y = 50
        for (let gameObject of scene.gameObjects) {
            ctx.fillStyle = 'white'
            ctx.font = '20px Courier'
            let string =
                gameObject.name +
                ' (' +
                gameObject.transform.x +
                ',' +
                gameObject.transform.y +
                ')'
            ctx.fillText(string, 0, y)
            y += 20
        }
    }
}

// =================================================== //
//                        Start                        //
// =================================================== //

function start(title, settings = {}) {
    Input.start()

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    document.title = title
    if (settings) {
        EngineGlobals.requestedAspectRatio = settings.aspectRatio
            ? settings.aspectRatio
            : 16 / 9
        letterboxColor = settings.letterboxColor
            ? settings.letterboxColor
            : 'black'
        EngineGlobals.logicalWidth = settings.logicalWidth
            ? settings.logicalWidth
            : 100
    }

    setInterval(gameLoop, 1000 * Time.deltaTime)
}

window.start = start
window.engineUpdate = update
window.engineDraw = draw
window.keysDown = keysDown
