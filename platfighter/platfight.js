// Basic logic for platforms and player inspired from https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript
//
// Educative (2023) "How to make a simple platformer using JavaScript" [Source code] https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript

// Lerp tutorial for sword movement from https://gamedevbeginner.com/the-right-way-to-lerp-in-unity-with-examples/

import '/engine/engine.js'

// =================================================== //
//                        Start                        //
// =================================================== //

class CheckpointComponent extends Component {
    name = 'CheckpointComponent'
    benchId = 0

    // Player 1 spawn
    spawn_x_1 = -150
    spawn_y_1 = 0

    // Player 2 spawn
    spawn_x_2 = 150
    spawn_y_2 = 0

    spawned = false
    equipedSword = true
    equipedShield = false
    doorSpawn = false
    doorSpawn_x
    doorSpawn_y
    start() {}

    // Bench logic
    updateId(id) {
        this.benchId = id
        // document.cookies = this.benchId
    }
    getId() {
        return this.benchId
    }
    getSpawnX(input) {
        if (input == 'WASD') return this.spawn_x_1
        return this.spawn_x_2
    }
    getSpawnY(input) {
        if (input == 'WASD') return this.spawn_y_1
        return this.spawn_y_2
    }

    // Door logic
    setDoorLocation(x, y) {
        this.doorSpawn_x = x
        this.doorSpawn_y = y
    }
    getDoorSpawnX() {
        return this.doorSpawn_x
    }
    getDoorSpawnY() {
        return this.doorSpawn_y
    }
    getDoor() {
        return this.doorSpawn
    }
    setDoor(door) {
        this.doorSpawn = door
    }

    // Equipment logic
    setSwordEquipment(sword = false) {
        this.equipedSword = sword
    }
    setShieldEquipment(shield = false) {
        this.equipedShield = shield
    }
    getSwordEquipment() {
        return this.equipedSword
    }
    getShieldEquipment() {
        return this.equipedShield
    }
}

// Modified momentum boundary tracker from https://github.com/CS2510/Spring2023.Day13Ender/blob/main/camera-tracking/camera-tracking.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day13Starter) [Source code]. https://github.com/CS2510/Spring2023.Day13Starter
class MainCameraComponent extends Component {
    start() {}
    update() {
        // this.transform.x = 600
        let playerGameObjects = GameObject.getObjectsByName('PlayerGameObject')
        if (playerGameObjects) {
            let player_1 = playerGameObjects[0].getComponent('PlayerComponent')
            let player_2 = playerGameObjects[1].getComponent('PlayerComponent')

            // Center the camera on the average x transform of the two players
            let maxDifference = 80
            let difference =
                (player_1.transform.x + player_2.transform.x) / 2 -
                this.transform.x
            if (difference > maxDifference) {
                //The player is to the right
                this.transform.x += 0.1 * (difference - maxDifference)
            } else if (difference < -maxDifference) {
                //The player is to the left
                this.transform.x += 0.1 * (difference + maxDifference)
            }

            // Center the camera on the average y transform of the two players
            maxDifference = 30
            difference =
                (player_1.transform.y +
                    player_2.transform.y +
                    player_1.player.height) /
                    2 -
                this.transform.y
            if (difference > maxDifference) {
                //The player is below
                this.transform.y += 0.1 * (difference - maxDifference)
            } else if (difference < -maxDifference) {
                //The player is above
                this.transform.y += 0.1 * (difference + maxDifference)
            }

            // Scale the camera based off how far away the players are from each other
            // Zoom in if they are close, zoom out if they are far away - 200 arbritarily chosen because 100 was too fast
            let scale =
                200 /
                Math.abs(
                    player_1.transform.x -
                        player_1.player.width / 2 -
                        player_2.transform.x -
                        player_1.player.width / 2
                )

            // Set a max and min scale so that the camera does not go crazy
            scale <= 1
                ? scale >= 0.5
                    ? (this.transform.sx = scale)
                    : (this.transform.sx = 0.5)
                : (this.transform.sx = 1)
        }
    }
}

class StartController extends Component {
    start() {
        GameObject.getObjectByName('CheckpointGameObject').doNotDestroyOnLoad()
    }
    update() {}
}

class StartScene extends Scene {
    constructor() {
        super('teal')
    }
    start() {
        this.addGameObject(
            new GameObject('StartConttrollerGameObject').addComponent(
                new StartController()
            )
        )
        this.addGameObject(
            new GameObject('CheckpointGameObject').addComponent(
                new CheckpointComponent()
            )
        )

        this.addGameObject(new PlayerGameObject('WASD'))
        this.addGameObject(new PlayerGameObject('Arrows'))

        this.addGameObject(new EnemyShieldGameObject(0, 0, -125))

        // Starting floor
        this.addGameObject(new FloorGameObject(-300, 100, 600, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-300, -100, 600, 15)).layer = 5

        // Right side floor
        this.addGameObject(new FloorGameObject(350, 50, 200, 15)).layer = 5
        this.addGameObject(new FloorGameObject(600, 0, 200, 15)).layer = 5
        this.addGameObject(new FloorGameObject(800, 15, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(825, 30, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(850, 45, 600, 15)).layer = 5

        // Left side floor
        this.addGameObject(new FloorGameObject(-550, 50, 200, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-800, 0, 200, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-825, 15, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-850, 30, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-1450, 45, 600, 15)).layer = 5

        Camera.main.parent.addComponent(new MainCameraComponent())
    }
}

class EnemyShieldComponent extends Component {
    name = 'EnemyShieldComponent'
    constructor(id, x, y) {
        super()
        this.id = id
        this.x = x
        this.y = y
    }
    start() {
        this.shield = {
            canBlock: true,
            isBlocking: true,
            height: 18,
            y_v: 0,
            x_v: 0,
            width: 10,
            lerpx: 0,
            lerpy: 0,
            stuck: false,
        }

        this.gravity = 0.3
        this.blockTime = 0
        this.maxTime = 2
        this.freezeTime = 1
        this.maxFreezeTime = 1
        this.transform.x = this.x
        this.transform.y = this.y
        this.parent.addComponent(new Rectangle('black'))
        this.parent.addComponent(new Rectangle('none', 'grey'))
    }
    update() {
        this.transform.sx = this.shield.width
        this.transform.sy = -this.shield.height

        this.shield.isBlocking = false
        if (!this.shield.stuck) {
            let platformGameObject =
                GameObject.getObjectByName('PlatformGameObject')

            let floorGameObjects =
                GameObject.getObjectsByName('FloorGameObject')

            // If the shield is in the air then apply the effect of gravity
            if (this.shield.y_v < 12) this.shield.y_v += this.gravity
            this.transform.y += this.shield.y_v

            if (platformGameObject) {
                let platformComponent =
                    platformGameObject.getComponent('PlatformComponent')
                // Check for collions with the platform
                for (let i = 0; i < platformComponent.platforms.length; i++) {
                    let plat = platformComponent.platforms[i]
                    if (
                        this.transform.y <= plat.y &&
                        this.transform.y + this.shield.height >= plat.y &&
                        this.transform.x >= plat.x &&
                        this.transform.x + this.shield.width <=
                            plat.x + plat.width
                    ) {
                        this.transform.y = plat.y
                        this.shield.stuck = true
                    }
                }
            }

            // Check for collisions with the floor
            for (let floorGameObject of floorGameObjects) {
                let floorComponent =
                    floorGameObject.getComponent('FloorComponent')
                let plat = floorComponent.floor

                if (
                    this.transform.y <= plat.y &&
                    this.transform.y + this.shield.height >= plat.y &&
                    this.transform.x >= plat.x &&
                    this.transform.x + this.shield.width <= plat.x + plat.width
                ) {
                    this.transform.y = plat.y
                    this.shield.stuck = true
                }
                if (this.transform.y >= plat.y + 1000) {
                    this.parent.destroy()
                }
            }
        }
        if (this.shield.stuck) {
            this.shield.y_v = 0
        }
        let playerGameObjects = GameObject.getObjectsByName('PlayerGameObject')
        for (let playerGameObject of playerGameObjects) {
            if (playerGameObject) {
                let playerComponent =
                    playerGameObject.getComponent('PlayerComponent')
                let checkpointGameObject = GameObject.getObjectByName(
                    'CheckpointGameObject'
                )
                let checkpointComponent = checkpointGameObject.getComponent(
                    'CheckpointComponent'
                )

                if (
                    Math.abs(this.transform.x - playerComponent.transform.x) <=
                        30 &&
                    Math.abs(this.transform.y - playerComponent.transform.y) <=
                        30
                ) {
                    // Player 1 picks up the shield
                    if (playerComponent.input == 'WASD') {
                        if (Input.keyUp['e']) {
                            GameObject.instantiate(
                                new ShieldGameObject(playerComponent.input)
                            )
                            // checkpointComponent.setShieldEquipment(true)
                            this.parent.destroy()
                        }
                    }

                    // Player 2 picks up the shield
                    else if (playerComponent.input == 'Arrows') {
                        if (Input.keyUp['/']) {
                            GameObject.instantiate(
                                new ShieldGameObject(playerComponent.input)
                            )
                            // checkpointComponent.setShieldEquipment(true)
                            this.parent.destroy()
                        }
                    }
                }
            }
        }
    }
}

class EnemyShieldGameObject extends GameObject {
    name = 'EnemyShieldGameObject'
    constructor(id, x, y) {
        super()
        this.id = id
        this.x = x
        this.y = y
    }
    start() {
        this.addComponent(
            new EnemyShieldComponent(this.id, this.x, this.y)
        ).layer = -1
    }
}

class PlayerComponent extends Component {
    name = 'PlayerComponent'
    constructor(input) {
        super()
        this.input = input
    }
    start() {
        // Player obj
        this.player = {
            x_v: 0,
            y_v: 0,
            canJump: false,
            height: 20,
            width: 20,
            sitting: false,
            blocked: false,
        }

        // get any checkpoints
        let checkpointGameObject = GameObject.getObjectByName(
            'CheckpointGameObject'
        )

        let checkpointComponent = checkpointGameObject.getComponent(
            'CheckpointComponent'
        )

        // Instantiate the sword
        if (checkpointComponent.getSwordEquipment()) {
            GameObject.instantiate(
                new SwordGameObject(this.input).addComponent(
                    new Line('black', 3)
                )
            )
        }

        // Instantiate the shield
        if (checkpointComponent.getShieldEquipment()) {
            GameObject.instantiate(new ShieldGameObject())
        }

        // First check if we traveled through a door
        if (checkpointComponent.getDoor()) {
            this.transform.x = checkpointComponent.getDoorSpawnX()
            this.transform.y = checkpointComponent.getDoorSpawnY()

            // Set the door condition to be false
            // so that if we die we respawn at our last bench pos instead of the door
            checkpointComponent.setDoor(false)
        }

        // If not, we died and need to respawn
        else {
            this.transform.x = checkpointComponent.getSpawnX(this.input)
            this.transform.y = checkpointComponent.getSpawnY(this.input)

            if (checkpointComponent.getId() != 0) {
                this.player.sitting = true
            }
        }

        this.transform.sx = this.player.width
        this.transform.sy = this.player.height

        // Gravity and Friction variables
        this.gravity = 0.3
        this.friction = 0.7

        // Pass through plats
        this.markForPass = false
    }
    update() {
        let fallen = false
        let platformGameObject =
            GameObject.getObjectByName('PlatformGameObject')

        let floorGameObjects = GameObject.getObjectsByName('FloorGameObject')

        if (!this.player.sitting) {
            this.parent.layer = this.input == 'WASD' ? 1 : -1

            // Check if the player is blocked
            if (this.player.blocked && this.player.canJump) {
                this.player.canJump = false
                this.transform.y -= 10
            } else {
                // check input
                if (this.input == 'Arrows') {
                    // Move Left
                    if (keysDown['ArrowLeft']) {
                        this.transform.x += -2.5
                        this.player.x_v = -2.5
                    }

                    // Move Right
                    if (keysDown['ArrowRight']) {
                        this.transform.x += 2.5
                        this.player.x_v = 2.5
                    }

                    // Jump
                    if (keysDown['ArrowUp']) {
                        if (this.player.canJump) {
                            this.player.y_v = -10
                            this.player.jumpDown = true
                        }
                    }
                    // Stop Jumping
                    if (this.player.jumpDown && !keysDown['ArrowUp']) {
                        if (this.player.y_v < -2) {
                            this.player.y_v = -2
                        }
                        this.player.jumpDown = false
                        this.player.canJump = false
                    }
                } else if ((this.input = 'WASD')) {
                    // Move Left
                    if (keysDown['a']) {
                        this.transform.x += -2.5
                        this.player.x_v = -2.5
                    }

                    // Move Right
                    if (keysDown['d']) {
                        this.transform.x += 2.5
                        this.player.x_v = 2.5
                    }

                    // Jump
                    if (keysDown['w']) {
                        if (this.player.canJump) {
                            this.player.y_v = -10
                            this.player.jumpDown = true
                        }
                    }
                    // Stop Jumping
                    if (this.player.jumpDown && !keysDown['w']) {
                        if (this.player.y_v < -2) {
                            this.player.y_v = -2
                        }
                        this.player.jumpDown = false
                        this.player.canJump = false
                    }
                }
            }

            if (this.player.canJump) {
                this.player.x_v *= this.friction
                this.player.canJump = false
            } else {
                // If the player is in the air then apply the effect of gravity
                // Set a terminal velocity
                // Arbritrarily set to 12
                if (this.player.y_v < 12) this.player.y_v += this.gravity
            }

            // Updating the y and x coordinates of the player
            this.transform.y += this.player.y_v
            // this.transform.x += this.player.x_v

            // Check for collions with the platform if there are any
            if (platformGameObject) {
                let platformComponent =
                    platformGameObject.getComponent('PlatformComponent')
                for (let i = 0; i < platformComponent.platforms.length; i++) {
                    let plat = platformComponent.platforms[i]
                    if (
                        plat.x < this.transform.x + this.player.width &&
                        this.transform.x < plat.x + plat.width &&
                        plat.y < this.transform.y + this.player.height &&
                        this.transform.y + this.player.height <
                            plat.y + plat.height
                    ) {
                        this.player.canJump = true
                        this.player.y_v = 0
                        this.transform.y = plat.y - this.player.height
                    }
                }
            }

            // Check for collisions with the floor
            for (let floorGameObject of floorGameObjects) {
                if (!this.player.canJump) {
                    let plat =
                        floorGameObject.getComponent('FloorComponent').floor

                    // Check for falling
                    if (
                        plat.y <= this.transform.y + this.player.height &&
                        this.transform.y + this.player.height <=
                            plat.y + plat.height &&
                        this.transform.x + this.player.width / 2 >= plat.x &&
                        this.transform.x <= plat.x + plat.width
                    ) {
                        this.player.canJump = true
                        this.player.y_v = 0
                        this.transform.y = plat.y - this.player.height
                    }
                    if (this.transform.y >= plat.y + 1000) {
                        fallen = true
                        // SceneManager.changeScene(2)
                    }
                }
            }

            // Check for collisions with the enemy sword
            // Get the shield to check if we are blocking
            let shieldGameObject =
                GameObject.getObjectByName('ShieldGameObject')
            // let shieldComponent =
            //     shieldGameObject.getComponent('ShieldComponent')

            let swordGameObjects =
                GameObject.getObjectsByName('SwordGameObject')

            let in_range = false
            let blocked = false

            let swordComponent

            if (this.input == 'WASD') {
                swordComponent =
                    swordGameObjects[1].getComponent('SwordComponent')
            } else
                swordComponent =
                    swordGameObjects[0].getComponent('SwordComponent')

            if (!in_range && !blocked) {
                // Get coordinates of sword
                let x_start = swordComponent.transform.x
                let y_start = swordComponent.transform.y
                let x_end = swordComponent.sword.lerpx
                let y_end = swordComponent.sword.lerpy

                // First check if the sword is swinging
                if (
                    swordComponent.sword.isSwinging &&
                    !swordComponent.sword.blocked
                ) {
                    // Check if the player is within the x-range of the sword
                    if (
                        (x_start >= this.transform.x &&
                            x_end <= this.transform.x + this.player.width) ||
                        (x_start <= this.transform.x &&
                            x_end >= this.transform.x)
                    ) {
                        // Check if the player is within the y-range of the sword
                        if (
                            (y_start >= this.transform.y &&
                                y_end <=
                                    this.transform.y + this.player.height) ||
                            (y_start <= this.transform.y &&
                                y_end >= this.transform.y + this.player.height)
                        ) {
                            in_range = true

                            // Check if we are blocking

                            if (shieldGameObject) {
                                let shieldComponent =
                                    shieldGameObject.getComponent(
                                        'ShieldComponent'
                                    )
                                if (shieldComponent.shield.isBlocking) {
                                    // Check if the shield is within the x-range of the sword
                                    if (
                                        (x_start >=
                                            shieldComponent.transform.x &&
                                            x_end <=
                                                shieldComponent.transform.x +
                                                    shieldComponent.shield
                                                        .width) ||
                                        (x_start <=
                                            shieldComponent.transform.x &&
                                            x_end >=
                                                shieldComponent.transform.x)
                                    ) {
                                        // Check if the shield is within the y-range of the sword
                                        if (
                                            (y_start >=
                                                shieldComponent.transform.y &&
                                                y_end <=
                                                    shieldComponent.transform
                                                        .y +
                                                        shieldComponent.shield
                                                            .height) ||
                                            (y_start <=
                                                shieldComponent.transform.y &&
                                                y_end <=
                                                    shieldComponent.transform
                                                        .y +
                                                        shieldComponent.shield
                                                            .height)
                                        ) {
                                            swordComponent.sword.blocked = true
                                            blocked = true
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // If we are not in range of the sword check if we are blocking
                    if (shieldGameObject) {
                        let shieldComponent =
                            shieldGameObject.getComponent('ShieldComponent')

                        if (shieldComponent.shield.isBlocking) {
                            // Check if the shield is within the x-range of the sword
                            if (
                                (x_start >= shieldComponent.transform.x &&
                                    x_end <=
                                        shieldComponent.transform.x +
                                            shieldComponent.shield.width) ||
                                (x_start <= shieldComponent.transform.x &&
                                    x_end >= shieldComponent.transform.x)
                            ) {
                                // Check if the shield is within the y-range of the sword
                                if (
                                    (y_start >= shieldComponent.transform.y &&
                                        y_end <=
                                            shieldComponent.transform.y +
                                                shieldComponent.shield
                                                    .height) ||
                                    (y_start <= shieldComponent.transform.y &&
                                        y_end <=
                                            shieldComponent.transform.y +
                                                shieldComponent.shield.height)
                                ) {
                                    swordComponent.sword.blocked = true
                                    blocked = true
                                }
                            }
                        }
                    }
                }
            }

            if ((in_range && !blocked) || fallen) {
                // SceneManager.changeScene(2)
                if (shieldGameObject) {
                    let shieldComponent =
                        shieldGameObject.getComponent('ShieldComponent')
                    if (shieldComponent.input == this.input) {
                        if (fallen) {
                            shieldGameObject.destroy()
                            GameObject.instantiate(
                                new EnemyShieldGameObject(0, 0, -125)
                            )
                        } else {
                            shieldGameObject.destroy()
                            GameObject.instantiate(
                                new EnemyShieldGameObject(
                                    0,
                                    shieldComponent.transform.x,
                                    shieldComponent.transform.y
                                )
                            )
                        }
                    }
                }
                this.transform.x = 0
                this.transform.y = 0
            }
        } else this.parent.layer = -1
    }
}

class PlayerGameObject extends GameObject {
    name = 'PlayerGameObject'
    constructor(input) {
        super()
        this.input = input
    }
    start() {
        if (this.input == 'WASD') {
            this.addComponent(new PlayerComponent(this.input)).addComponent(
                new Rectangle('#e6822c')
            )
        } else {
            this.addComponent(new PlayerComponent(this.input)).addComponent(
                new Rectangle('#3a2ffa')
            )
        }
    }
}

class SwordComponent extends Component {
    name = 'SwordComponent'
    constructor(input) {
        super()
        this.input = input
    }
    start() {
        this.sword = {
            canSwing: true,
            isSwinging: false,
            windUp: false,
            height: 40,
            width: 4,
            lerpx: 0,
            lerpy: 0,
            sitting: false,
            blocked: false,
        }
        this.swingTime = 0
        this.maxTime = 1
        this.blockedTime = 0
        this.maxBlockedTime = 1
        this.windUpTime = 0
        this.maxWindUpTime = 0.5
        this.freezeTime = 0
        this.maxFreezeTime = 1
        this.found = false
    }
    update() {
        this.transform.sx = this.sword.lerpx
        this.transform.sy = this.sword.lerpy
        let playerGameObjects = GameObject.getObjectsByName('PlayerGameObject')

        this.found = false
        // find the correct player
        for (let playerGameObject of playerGameObjects) {
            let playerComponent =
                playerGameObject.getComponent('PlayerComponent')

            //found the player!
            if (playerComponent.input == this.input) {
                this.found = true
                let shieldGameObject =
                    GameObject.getObjectByName('ShieldGameObject')

                this.sword.sitting = playerComponent.player.sitting
                if (!this.sword.sitting) {
                    playerComponent.player.blocked = this.sword.blocked
                    this.parent.layer = this.input == 'WASD' ? 1 : 0
                    // this.parent.layer = 1
                    if (playerComponent.player.x_v >= 0) {
                        this.transform.x =
                            playerComponent.transform.x +
                            playerComponent.player.width / 3
                        this.transform.y =
                            playerComponent.transform.y +
                            playerComponent.player.height / 1.5
                    } else {
                        this.transform.x =
                            playerComponent.transform.x +
                            (2 * playerComponent.player.width) / 3
                        this.transform.y =
                            playerComponent.transform.y +
                            playerComponent.player.height / 1.5
                    }

                    // swing sword
                    // 1. Check if canSwing and not currently swinging
                    // 2. If currently swinging, progress swinging animation
                    // 3. When swing doine set back to original pos

                    // first pull back on the sword to telegraph a swing
                    if (
                        this.sword.windUp &&
                        this.swingTime == 0 &&
                        this.windUpTime <= this.maxWindUpTime
                    ) {
                        // facing to the right
                        if (playerComponent.player.x_v >= 0) {
                            this.windUpTime += 20 / 1000
                            this.sword.lerpx = SwordComponent.lerp(
                                this.sword.lerpx,
                                this.transform.x - this.sword.height / 3,
                                this.windUpTime / this.maxTime
                            )
                        }
                        // facing to the left
                        else {
                            this.windUpTime += 20 / 1000
                            this.sword.lerpx = SwordComponent.lerp(
                                this.sword.lerpx,
                                this.transform.x + this.sword.height / 3,
                                this.windUpTime / this.maxTime
                            )
                        }
                        this.sword.lerpy = this.transform.y - this.sword.height
                    } else if (
                        this.sword.windUp &&
                        this.swingTime == 0 &&
                        this.windUpTime >= this.maxWindUpTime
                    ) {
                        this.sword.isSwinging = true
                        this.sword.windUp = false
                    } else {
                        // if player is facing to the right
                        if (playerComponent.player.x_v >= 0) {
                            if (this.sword.isSwinging) {
                                this.swingTime += 60 / 1000
                                this.sword.lerpx = SwordComponent.lerp(
                                    this.sword.lerpx,
                                    this.transform.x + this.sword.height,
                                    this.swingTime / this.maxTime
                                )
                                this.sword.lerpy = SwordComponent.lerp(
                                    this.sword.lerpy,
                                    playerComponent.transform.y +
                                        playerComponent.player.height / 1.5,
                                    this.swingTime / this.maxTime
                                )
                            } else {
                                this.sword.lerpx = SwordComponent.lerp(
                                    this.sword.lerpx,
                                    this.transform.x,
                                    300 / 1000
                                )
                                this.sword.lerpy =
                                    this.transform.y - this.sword.height
                            }
                        }
                        // if player is facing to the left
                        else {
                            if (this.sword.isSwinging) {
                                this.swingTime += 60 / 1000
                                this.sword.lerpx = SwordComponent.lerp(
                                    this.sword.lerpx,
                                    this.transform.x - this.sword.height,
                                    this.swingTime / this.maxTime
                                )
                                this.sword.lerpy = SwordComponent.lerp(
                                    this.sword.lerpy,
                                    playerComponent.transform.y +
                                        playerComponent.player.height / 1.5,
                                    this.swingTime / this.maxTime
                                )
                            } else {
                                this.sword.lerpx = SwordComponent.lerp(
                                    this.sword.lerpx,
                                    this.transform.x,
                                    300 / 1000
                                )
                                this.sword.lerpy =
                                    this.transform.y - this.sword.height
                            }
                        }
                    }

                    // Check is space is pressed and wether or not the sword can swing
                    // If the shield is blocking then the sword cannot swing
                    // There is a small timer so that the player cannot simply spam space

                    // Check if the player blocked
                    if (
                        this.sword.blocked &&
                        this.blockedTime <= this.maxBlockedTime
                    ) {
                        this.sword.isSwinging = false
                        this.sword.canSwing = false
                        this.blockedTime += Time.deltaTime
                    } else if (
                        this.sword.blocked &&
                        this.blockedTime >= this.maxBlockedTime
                    ) {
                        this.sword.canSwing = true
                        this.sword.blocked = false
                    }

                    this.freezeTime += Time.deltaTime
                    // let shieldComponent
                    // if (shieldGameObject) {
                    //     shieldGameObject.getComponent('ShieldComponent')
                    //         .input == this.input
                    //         ? (shieldComponent =
                    //               shieldGameObject.getComponent(
                    //                   'ShieldComponent'
                    //               ))
                    //         : (shieldComponent = null)
                    // }

                    // if (shieldComponent)
                    //     console.log(
                    //         `this input: ${this.input}, shield input: ${shieldComponent.input}`
                    //     )
                    if (
                        ((this.input == 'WASD' && keysDown['s']) ||
                            (this.input == 'Arrows' &&
                                keysDown['ArrowDown'])) &&
                        this.sword.canSwing &&
                        !this.sword.isSwinging &&
                        this.freezeTime >= this.maxFreezeTime &&
                        (!shieldGameObject ||
                            !shieldGameObject.getComponent('ShieldComponent')
                                .isBlocking)
                    ) {
                        this.freezeTime = 0
                        this.swingTime = 0
                        this.windUpTime = 0
                        this.blockedTime = 0
                        this.sword.windUp = true
                        // this.sword.isSwinging = true
                        this.sword.canSwing = false
                    }
                    if (
                        this.sword.isSwinging &&
                        this.swingTime >= this.maxTime
                    ) {
                        this.freezeTime = 0
                        this.swingTime = 0
                        this.windUpTime = 0
                        this.blockedTime = 0
                        this.sword.isSwinging = false
                        this.sword.canSwing = true
                        this.sword.windUp = false
                    }
                } else {
                    this.parent.layer = -2
                    this.transform.x =
                        playerComponent.transform.x - this.sword.height / 4
                    this.transform.y = playerComponent.transform.y
                    this.transform.sx =
                        playerComponent.transform.x +
                        (3 * this.sword.height) / 4
                    this.transform.sy =
                        playerComponent.transform.y + this.sword.height / 2
                }
            }
        }
    }
}

class SwordGameObject extends GameObject {
    name = 'SwordGameObject'
    constructor(input) {
        super()
        this.input = input
    }
    start() {
        this.addComponent(new SwordComponent(this.input)).layer = 1
    }
}

class ShieldComponent extends Component {
    name = 'ShieldComponent'
    constructor(input) {
        super()
        this.input = input
    }
    start() {
        this.shield = {
            canBlock: true,
            isBlocking: false,
            height: 18,
            width: 10,
            lerpx: 0,
            lerpy: 0,
            sitting: false,
        }

        this.blockTime = 0
        this.maxTime = 2
        this.freezeTime = 1
        this.maxFreezeTime = 1
        this.found = false
        this.parent.addComponent(new Rectangle('black'))
        this.parent.addComponent(new Rectangle('none', 'grey'))

        this.transform.sx = this.shield.width
        this.transform.sy = -this.shield.height
    }
    update() {
        let playerGameObjects = GameObject.getObjectsByName('PlayerGameObject')
        // let playerComponent = playerGameObject.getComponent('PlayerComponent')
        let swordGameObjects = GameObject.getObjectsByName('SwordGameObject')

        this.found = false
        for (let playerGameObject of playerGameObjects) {
            let playerComponent =
                playerGameObject.getComponent('PlayerComponent')
            // console.log(`shield input: ${this.input}, player`)
            if (this.input == playerComponent.input) {
                this.found = true

                // Make sure the player is not sitting
                this.shield.sitting = playerComponent.player.sitting
                if (!this.shield.sitting) {
                    this.parent.layer = this.input == 'WASD' ? 1 : 0
                    if (playerComponent.player.x_v < 0) {
                        this.transform.x =
                            playerComponent.transform.x -
                            playerComponent.player.width / 6
                        this.transform.y =
                            playerComponent.transform.y +
                            playerComponent.player.height / 1.2
                    } else {
                        this.transform.x =
                            playerComponent.transform.x +
                            (2 * playerComponent.player.width) / 3
                        this.transform.y =
                            playerComponent.transform.y +
                            playerComponent.player.height / 1.2
                    }

                    // if shield is blocking
                    if (this.shield.isBlocking) {
                        this.blockTime += 90 / 1000
                        // if the player is facing to the right
                        if (playerComponent.player.x_v >= 0) {
                            let partialTime
                            this.blockTime * 3 <= this.maxTime
                                ? (partialTime = this.blockTime * 3)
                                : (partialTime = this.blockTime)
                            this.shield.lerpx = ShieldComponent.lerp(
                                this.shield.lerpx,
                                this.transform.x + this.shield.width,
                                partialTime / this.maxTime
                            )
                        }
                        // if the player is facing to the left
                        else {
                            let partialTime
                            this.blockTime * 3 <= this.maxTime
                                ? (partialTime = this.blockTime * 3)
                                : (partialTime = this.blockTime)
                            this.shield.lerpx = ShieldComponent.lerp(
                                this.shield.lerpx,
                                this.transform.x - this.shield.width,
                                partialTime / this.maxTime
                            )
                        }

                        this.shield.lerpy = ShieldComponent.lerp(
                            this.shield.lerpy,
                            this.transform.y - this.shield.height / 2,
                            this.blockTime / this.maxTime
                        )
                        this.transform.x = this.shield.lerpx
                        this.transform.y = this.shield.lerpy
                    }
                    // if the shield is not blocking
                    else {
                        this.shield.lerpx = ShieldComponent.lerp(
                            this.shield.lerpx,
                            this.transform.x,
                            500 / 1000
                        )
                        this.transform.x = this.shield.lerpx
                    }

                    // Make sure shield can block, is not currently blocking, and the sword is not swinging
                    // There is a small timer so that the player cannot spam block
                    this.freezeTime += Time.deltaTime
                    if (
                        this.shield.canBlock &&
                        !this.shield.isBlocking &&
                        this.freezeTime >= this.maxFreezeTime &&
                        ((this.input == 'WASD' && keysDown['f']) ||
                            (this.input == 'Arrows' && keysDown[' ']))
                    ) {
                        let swing = false
                        for (let swordGameObject of swordGameObjects) {
                            let swordComponent =
                                swordGameObject.getComponent('SwordComponent')
                            if (
                                !swordComponent.sword.isSwinging &&
                                swordComponent.input == this.input
                            ) {
                                this.shield.lerpx = this.transform.x
                                this.shield.lerpy = this.transform.y
                                this.blockTime = 0
                                this.shield.isBlocking = true
                                this.shield.canBlock = false
                                swing = true
                            }
                        }
                        if (!swing) {
                            this.shield.lerpx = this.transform.x
                            this.shield.lerpy = this.transform.y
                            this.blockTime = 0
                            this.shield.isBlocking = true
                            this.shield.canBlock = false
                        }
                    }
                    if (
                        this.shield.isBlocking &&
                        this.blockTime >= this.maxTime
                    ) {
                        this.freezeTime = 0
                        this.blockTime = 0
                        this.shield.isBlocking = false
                        this.shield.canBlock = true
                    }
                }
                // If this player is sitting then move the shield to the player's back
                else {
                    this.parent.layer = -2
                    this.transform.x =
                        playerComponent.transform.x +
                        (2 * playerComponent.player.width) / 3
                    this.transform.y =
                        playerComponent.transform.y +
                        playerComponent.player.height / 1.2
                }
            }
        }
    }
}

class ShieldGameObject extends GameObject {
    name = 'ShieldGameObject'
    constructor(input) {
        super()
        this.input = input
    }
    start() {
        this.addComponent(new ShieldComponent(this.input)).layer = 1
    }
}

class FloorComponent extends Component {
    name = 'FloorComponent'
    constructor(x, y, width, height) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    start() {
        this.floor = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            passable: false,
        }
        this.transform.x = this.floor.x
        this.transform.y = this.floor.y
        this.transform.sx = this.floor.width
        this.transform.sy = this.floor.height
    }
}

class FloorGameObject extends GameObject {
    name = 'FloorGameObject'
    constructor(x, y, width, height) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    start() {
        this.addComponent(
            new FloorComponent(this.x, this.y, this.width, this.height)
        ).addComponent(new Rectangle('#19183d'))
    }
}

let startScene = new StartScene()
window.allScenes = [startScene]
