import '/engine/engine.js'

//-----------------------------------------------------
//Start

class CheckpointComponent extends Component {
    name = 'CheckpointComponent'
    benchId = 0
    spawn_x = 100
    spawn_y = 200
    start() {}
    updateId(id) {
        this.benchId = id
        // document.cookies = this.benchId
    }
    getId() {
        return this.benchId
    }
    setSpawnLocation(x, y) {
        this.spawn_x = x
        this.spawn_y = y
    }
    getSpawnX() {
        return this.spawn_x
    }
    getSpawnY() {
        return this.spawn_y
    }
}
class StartController extends Component {
    start() {
        this.freezeTime = 0
        this.maxFreezeTime = 0.5
        GameObject.getObjectByName('CheckpointGameObject').doNotDestroyOnLoad()
    }
    update() {
        this.freezeTime += Time.deltaTime
        if (keysDown['a'] && this.freezeTime >= this.maxFreezeTime) {
            SceneManager.changeScene(1)
        }
    }
}

class StartCameraComponent extends Component {
    start() {}
    update() {}
}

class StartScene extends Scene {
    constructor() {
        super('black')
    }
    start() {
        this.addGameObject(
            new GameObject('StartConttrollerGameObject').addComponent(
                new StartController()
            )
        )
        // this.addGameObject(
        //     new GameObject('WelcomeToPlatformerGameObject').addComponent(
        //         new Text('Welcome to the Game!', 'white')
        //     ),
        //     new Vector2(-125, 20)
        // )
        this.addGameObject(
            new GameObject('CheckpointGameObject').addComponent(
                new CheckpointComponent()
            )
        )
        Camera.main.parent.addComponent(new StartCameraComponent())
    }
}

//-----------------------------------------------------
//Main

// Modified momentum boundary tracker
class MainCameraComponent extends Component {
    start() {}
    update() {
        // this.transform.x = 600
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let maxDifference = 80
        let difference = playerGameObject.transform.x - this.transform.x
        if (difference > maxDifference) {
            //The player is to the right
            this.transform.x += 0.1 * (difference - maxDifference)
        } else if (difference < -maxDifference) {
            //The player is to the left
            this.transform.x += 0.1 * (difference + maxDifference)
        }

        maxDifference = 50
        difference = playerGameObject.transform.y - this.transform.y
        if (difference > maxDifference) {
            //The player is to the right
            this.transform.y += 0.1 * (difference - maxDifference)
        } else if (difference < -maxDifference) {
            //The player is to the left
            this.transform.y += 0.1 * (difference + maxDifference)
        }
    }
}

class MainController extends Component {
    name = 'MainController'
    enemy_count = 3
    start() {
        // this.enemy_count = 3
    }
    update() {
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')
        if (playerComponent.player.sitting) {
            let enemySwordGameObjects = GameObject.getObjectsByName(
                'EnemySwordGameObject'
            )
            let enemyGamesObjects =
                GameObject.getObjectsByName('EnemyGameObject')
            if (enemyGamesObjects.length != this.enemy_count) {
                let total_ids = []
                let ids = []
                for (let i = 1; i <= this.enemy_count; i++) {
                    total_ids.push(i)
                }
                // if all enemies are dead
                if (enemyGamesObjects.length == 0) {
                    for (let enemySwordGameObject of enemySwordGameObjects) {
                        enemySwordGameObject.destroy()
                    }
                    for (let id of total_ids) {
                        GameObject.instantiate(new EnemyGameObject(id))
                    }
                }
                // if some or none are dead
                else {
                    for (let enemyGameObject of enemyGamesObjects) {
                        let enemyComponent =
                            enemyGameObject.getComponent('EnemyComponent')
                        ids.push(enemyComponent.id)
                    }
                    for (let id of total_ids) {
                        if (!ids.includes(id)) {
                            for (let enemySwordGameObject of enemySwordGameObjects) {
                                let enemySwordComponent =
                                    enemySwordGameObject.getComponent(
                                        'EnemySwordComponent'
                                    )
                                if (enemySwordComponent.id == id)
                                    enemySwordGameObject.destroy()
                            }
                            GameObject.instantiate(new EnemyGameObject(id))
                        }
                    }
                }
            }
        }
    }
}

class PlayerComponent extends Component {
    name = 'PlayerComponent'
    start() {
        // Instantiate the sword
        GameObject.instantiate(
            new SwordGameObject().addComponent(new Line('black', 3))
        )

        // Instantiate the shield
        GameObject.instantiate(new ShieldGameObject())

        // Player obj
        this.player = {
            x_v: 0,
            y_v: 0,
            canJump: false,
            jumpDown: false,
            height: 20,
            width: 20,
            sitting: false,
        }

        // get any checkpoints
        let checkpointGameObject = GameObject.getObjectByName(
            'CheckpointGameObject'
        )

        let checkpointComponent = checkpointGameObject.getComponent(
            'CheckpointComponent'
        )

        this.transform.x = checkpointComponent.getSpawnX()
        this.transform.y = checkpointComponent.getSpawnY()
        this.transform.sx = this.player.width
        this.transform.sy = this.player.height

        if (checkpointComponent.getId() != 0) {
            this.player.sitting = true
        }
        // Gravity and Friction variables
        this.gravity = 0.3
        this.friction = 0.7

        // Pass through plats
        this.markForPass = false
    }
    update() {
        let platformGameObject =
            GameObject.getObjectByName('PlatformGameObject')
        let platformComponent =
            platformGameObject.getComponent('PlatformComponent')

        let floorGameObject = GameObject.getObjectByName('FloorGameObject')
        let floorComponent = floorGameObject.getComponent('FloorComponent')

        if (!this.player.sitting) {
            this.parent.layer = 0
            // Move Left
            if (keysDown['ArrowLeft'] || keysDown['a']) {
                this.transform.x += -2.5
                this.player.x_v = -2.5
            }

            // Move Right
            if (keysDown['ArrowRight'] || keysDown['d']) {
                this.transform.x += 2.5
                this.player.x_v = 2.5
            }

            // Jump
            if (keysDown['ArrowUp'] || keysDown['w']) {
                if (this.player.canJump) {
                    this.player.y_v = -10
                    this.player.jumpDown = true
                }
            }

            // Stop Jumping
            if (
                this.player.jumpDown &&
                !keysDown['ArrowUp'] &&
                !keysDown['w']
            ) {
                if (this.player.y_v < -2) {
                    this.player.y_v = -2
                }
                this.player.jumpDown = false
                this.player.canJump = false
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

            // Check for collions with the platform
            for (let i = 0; i < platformComponent.platforms.length; i++) {
                let plat = platformComponent.platforms[i]
                if (
                    plat.x < this.transform.x + this.player.width &&
                    this.transform.x < plat.x + plat.width &&
                    plat.y < this.transform.y + this.player.height &&
                    this.transform.y + this.player.height < plat.y + plat.height
                ) {
                    // Move Down through Plat
                    if (!(keysDown['ArrowDown'] || keysDown['s'])) {
                        this.player.canJump = true
                        this.transform.y = plat.y - this.player.height
                    }
                }
            }

            // Check for collisions with the floor
            let plat = floorComponent.floor
            if (
                plat.y <= this.transform.y + this.player.height &&
                this.transform.y + this.player.height <= plat.y + plat.height &&
                this.transform.x + this.player.width >= plat.x &&
                this.transform.x <= plat.x + plat.width
            ) {
                this.player.canJump = true
                this.transform.y = plat.y - this.player.height
            }
            // if (this.transform.y >= plat.y + 400) {
            //     this.parent.destroy()
            //     SceneManager.changeScene(2)
            // }

            // Check for collisions with the enemy sword
            // Get the shield to check if we are blocking
            let shieldGameObject =
                GameObject.getObjectByName('ShieldGameObject')
            let shieldComponent =
                shieldGameObject.getComponent('ShieldComponent')

            let swordGameObjects = GameObject.getObjectsByName(
                'EnemySwordGameObject'
            )

            let in_range = false
            let blocked = false

            for (let swordGameObject of swordGameObjects) {
                if (!in_range && !blocked) {
                    let swordComponent = swordGameObject.getComponent(
                        'EnemySwordComponent'
                    )

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
                                x_end <=
                                    this.transform.x + this.player.width) ||
                            (x_start <= this.transform.x &&
                                x_end >= this.transform.x)
                        ) {
                            // Check if the player is within the y-range of the sword
                            if (
                                (y_start >= this.transform.y &&
                                    y_end <=
                                        this.transform.y +
                                            this.player.height) ||
                                (y_start <= this.transform.y &&
                                    y_end >=
                                        this.transform.y + this.player.height)
                            ) {
                                in_range = true

                                // Check if we are blocking
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
                                                y_end >=
                                                    shieldComponent.transform
                                                        .y +
                                                        shieldComponent.shield
                                                            .height)
                                        ) {
                                            console.log('blocked!')
                                            swordComponent.sword.blocked = true
                                            blocked = true
                                        }
                                    }
                                }
                            }
                        }

                        // If we are not in range of the sword check if we are blocking
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
                                        y_end >=
                                            shieldComponent.transform.y +
                                                shieldComponent.shield.height)
                                ) {
                                    console.log('blocked from a distance!')
                                    swordComponent.sword.blocked = true
                                    blocked = true
                                }
                            }
                        }
                    }
                }
            }
            console.log(`in range: ${in_range}, blocked: ${blocked}`)
            if (in_range && !blocked) {
                this.parent.destroy()
                SceneManager.changeScene(2)
            }
        } else this.parent.layer = -1
    }
    // draw(ctx) {
    //     ctx.fillStyle = '#de0d3a'
    //     ctx.fillRect(
    //         this.transform.x,
    //         this.transform.y,
    //         this.player.width,
    //         this.player.height
    //     )
    // }
}

class SwordComponent extends Component {
    name = 'SwordComponent'
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
        }
        this.swingTime = 0
        this.maxTime = 1
        this.windUpTime = 0
        this.maxWindUpTime = 0.5
        this.freezeTime = 0
        this.maxFreezeTime = 1
    }
    update() {
        this.transform.sx = this.sword.lerpx
        this.transform.sy = this.sword.lerpy
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')
        let shieldGameObject = GameObject.getObjectByName('ShieldGameObject')
        let shieldComponent = shieldGameObject.getComponent('ShieldComponent')

        this.sword.sitting = playerComponent.player.sitting
        if (!this.sword.sitting) {
            this.parent.layer = 1
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
                        this.sword.lerpy = this.transform.y - this.sword.height
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
                        this.sword.lerpy = this.transform.y - this.sword.height
                    }
                }
            }

            // Check is space is pressed and wether or not the sword can swing
            // If the shield is blocking then the sword cannot swing
            // There is a small timer so that the player cannot simply spam space
            this.freezeTime += Time.deltaTime
            if (
                keysDown[' '] &&
                this.sword.canSwing &&
                !this.sword.isSwinging &&
                this.freezeTime >= this.maxFreezeTime &&
                !shieldComponent.shield.isBlocking
            ) {
                this.freezeTime = 0
                this.swingTime = 0
                this.windUpTime = 0
                this.sword.windUp = true
                // this.sword.isSwinging = true
                this.sword.canSwing = false
            }
            if (this.sword.isSwinging && this.swingTime >= this.maxTime) {
                this.freezeTime = 0
                this.swingTime = 0
                this.windUpTime = 0
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
                playerComponent.transform.x + (3 * this.sword.height) / 4
            this.transform.sy =
                playerComponent.transform.y + this.sword.height / 2
        }
    }
    // draw(ctx) {
    //     if (!this.sword.sitting) {
    //         ctx.strokeStyle = 'black'
    //         ctx.lineWidth = 3
    //         ctx.beginPath()
    //         ctx.moveTo(this.transform.x, this.transform.y)
    //         ctx.lineTo(this.sword.lerpx, this.sword.lerpy)
    //         ctx.stroke()
    //     }
    // }
}

class SwordGameObject extends GameObject {
    name = 'SwordGameObject'
    start() {
        this.addComponent(new SwordComponent()).layer = 1
    }
}

class ShieldComponent extends Component {
    name = 'ShieldComponent'
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
    }
    update() {
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')
        let swordGameObject = GameObject.getObjectByName('SwordGameObject')
        let swordComponent = swordGameObject.getComponent('SwordComponent')

        // Make sure the player is not sitting
        this.shield.sitting = playerComponent.player.sitting
        if (!this.shield.sitting) {
            this.parent.layer = 1
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
                !swordComponent.sword.isSwinging &&
                this.freezeTime >= this.maxFreezeTime &&
                (keysDown['f'] || keysDown['F'])
            ) {
                // do something
                this.shield.lerpx = this.transform.x
                this.shield.lerpy = this.transform.y
                this.blockTime = 0
                this.shield.isBlocking = true
                this.shield.canBlock = false
            }
            if (this.shield.isBlocking && this.blockTime >= this.maxTime) {
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
    draw(ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(
            this.transform.x,
            this.transform.y - 5,
            this.shield.width,
            -(this.shield.height - 5)
        )
        ctx.strokeStyle = 'black'
        ctx.beginPath()
        ctx.moveTo(this.transform.x + 1, this.transform.y - 7)
        ctx.lineTo(
            this.transform.x + this.shield.width / 2,
            this.transform.y - 2
        )
        ctx.lineTo(
            this.transform.x + this.shield.width / 2,
            this.transform.y - 2
        )
        ctx.lineTo(
            this.transform.x + this.shield.width - 1,
            this.transform.y - 7
        )
        ctx.stroke()
    }
}

class ShieldGameObject extends GameObject {
    name = 'ShieldGameObject'
    start() {
        this.addComponent(new ShieldComponent()).layer = 1
    }
}

class EnemyComponent extends Component {
    name = 'EnemyComponent'
    constructor(walking, x_start, y_start, id) {
        super()
        this.walking = walking
        this.x_start = x_start
        this.y_start = y_start
        this.id = id
    }

    start() {
        // Instantiate a sword
        GameObject.instantiate(
            new EnemySwordGameObject(this.id).addComponent(new Line('black', 3))
        )

        // Player obj
        this.player = {
            x_v: 1,
            y_v: 0,
            canJump: false,
            height: 20,
            width: 20,
            // 0 is facing right, 1 is facing left
            direction: 0,
            nearPlayer: false,
            blocked: false,
        }

        this.transform.x = this.x_start
        this.transform.y = this.y_start
        this.transform.sx = this.player.width
        this.transform.sy = this.player.height

        // Gravity and Friction variables
        this.gravity = 0.6
        this.friction = 0.7
    }
    update() {
        // if (!this.parent.markedForDestroy) {
        // }
        let platformGameObject =
            GameObject.getObjectByName('PlatformGameObject')
        let platformComponent =
            platformGameObject.getComponent('PlatformComponent')

        let floorGameObject = GameObject.getObjectByName('FloorGameObject')
        let floorComponent = floorGameObject.getComponent('FloorComponent')
        // If the player is in the air then apply the effect of gravity
        if (!this.player.canJump && this.player.y_v <= 12)
            this.player.y_v += this.gravity
        if (this.player.blocked && this.player.canJump) {
            this.player.canJump = false
            this.transform.y -= 30
            if (this.player.direction == 0) {
                this.transform.x -= 0.5
            } else this.transform.x += 0.5
        }

        // Updating the y and x coordinates of the player
        this.transform.y += this.player.y_v
        // this.transform.x += this.player.x_v

        // Check for collisions with the platform
        for (let i = 0; i < platformComponent.platforms.length; i++) {
            let plat = platformComponent.platforms[i]
            if (
                plat.x < this.transform.x + this.player.width &&
                this.transform.x < plat.x + plat.width &&
                plat.y < this.transform.y + this.player.height &&
                this.transform.y + this.player.height < plat.y + plat.height
            ) {
                this.player.canJump = true
                this.transform.y = plat.y - this.player.height
                if (this.walking) {
                    if (this.player.direction == 0) {
                        if (
                            this.transform.x + this.player.width <=
                            plat.x + plat.width - this.player.width
                        ) {
                            this.transform.x += this.player.x_v
                        } else this.player.direction = 1
                    }
                    if (this.player.direction == 1) {
                        if (this.transform.x >= plat.x + this.player.width) {
                            this.transform.x -= this.player.x_v
                        } else this.player.direction = 0
                    }
                }
            }
        }

        // Check for collisions with the floor
        let plat = floorComponent.floor
        if (
            plat.x < this.transform.x + this.player.width &&
            this.transform.x < plat.x + plat.width &&
            plat.y < this.transform.y + this.player.height &&
            this.transform.y + this.player.height < plat.y + plat.height
        ) {
            this.player.canJump = true
            this.transform.y = plat.y - this.player.height
            if (this.walking) {
                if (this.player.direction == 0) {
                    if (
                        this.transform.x + this.player.width <=
                        plat.x + plat.width - this.player.width
                    ) {
                        this.transform.x += this.player.x_v
                    } else this.player.direction = 1
                }
                if (this.player.direction == 1) {
                    if (this.transform.x >= plat.x + this.player.width) {
                        this.transform.x -= this.player.x_v
                    } else this.player.direction = 0
                }
            }
        }

        // Get information from player component
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')

        if (!playerComponent.player.sitting) {
            // Check direction to face
            let dist_x = this.transform.x - playerComponent.transform.x

            let dist_y = this.transform.y - playerComponent.transform.y
            if (Math.abs(dist_y) <= 50 && Math.abs(dist_x) <= 100) {
                this.player.nearPlayer = true
                dist_x <= 0
                    ? (this.player.direction = 0)
                    : (this.player.direction = 1)
            } else this.player.nearPlayer = false

            // Check for collisions with the player sword
            let swordGameObject = GameObject.getObjectByName('SwordGameObject')
            let swordComponent = swordGameObject.getComponent('SwordComponent')

            // Get coordinates of sword
            let x_start = swordComponent.transform.x
            let y_start = swordComponent.transform.y
            let x_end = swordComponent.sword.lerpx
            let y_end = swordComponent.sword.lerpy

            // First check if the sword is swinging
            if (swordComponent.sword.isSwinging) {
                // Check if the enemy is within the x-range of the sword
                if (
                    (x_start >= this.transform.x &&
                        x_end <= this.transform.x + this.player.width) ||
                    (x_start <= this.transform.x && x_end >= this.transform.x)
                ) {
                    // Check if the enemy is within the y-range of the sword
                    if (
                        (y_start >= this.transform.y &&
                            y_end <= this.transform.y + this.player.height) ||
                        (y_start <= this.transform.y &&
                            y_end >= this.transform.y + this.player.height)
                    ) {
                        this.parent.destroy()
                    }
                }
            }
        } else this.player.nearPlayer = false
    }
    // draw(ctx) {
    //     if (!this.walking) ctx.fillStyle = '#9e34eb'
    //     else if (this.walking) ctx.fillStyle = '#d6d64b'
    //     ctx.fillRect(
    //         this.transform.x,
    //         this.transform.y,
    //         this.player.width,
    //         this.player.height
    //     )
    // }
}

class EnemyGameObject extends GameObject {
    name = 'EnemyGameObject'
    constructor(id) {
        super()
        this.id = id
        if (this.id == 1) {
            this.walking = false
            this.x_start = 195
            this.y_start = 200
            this.addComponent(new Rectangle('#9e34eb'))
        } else if (this.id == 2) {
            this.walking = true
            this.x_start = -40
            this.y_start = 60
            this.addComponent(new Rectangle('#d6d64b'))
        } else if (this.id == 3) {
            this.walking = true
            this.x_start = 900
            this.y_start = 0
            this.addComponent(new Rectangle('#d6d64b'))
        }
    }
    start() {
        // let mainControllerObject = GameObject.getObjectByName(
        //     'MainControllerObject'
        // )
        // let mainControllerComponent =
        //     mainControllerObject.getComponent('MainController')
        // mainControllerComponent.enemy_count += 1
        this.addComponent(
            new EnemyComponent(
                this.walking,
                this.x_start,
                this.y_start,
                this.id
            )
        ).layer = -1
    }
}

class EnemySwordComponent extends Component {
    name = 'EnemySwordComponent'
    constructor(id) {
        super()
        this.id = id
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
            y_v: 0,
            x_v: 0,
            stuck: false,
            blocked: false,
        }
        this.swingTime = 0
        this.maxTime = 1
        this.windUpTime = 0
        this.maxWindUpTime = 0.5
        this.blockedTime = 0
        this.maxBlockedTime = 2
        this.gravity = 0.3
        this.freezeTime = 0
        this.maxFreezeTime = 2
        this.found = false
    }
    update() {
        this.transform.sx = this.sword.lerpx
        this.transform.sy = this.sword.lerpy
        // If the enemy is alive
        this.found = false
        let enemies = GameObject.getObjectsByName('EnemyGameObject')
        for (let enemy of enemies) {
            let enemyComponent = enemy.getComponent('EnemyComponent')
            // find matching id
            if (enemyComponent.id == this.id) {
                this.found = true
                let playerComponent = enemyComponent
                playerComponent.player.blocked = this.sword.blocked
                // Change sides based off where the player is
                // Don't let it change while swinging
                if (!this.isSwinging) {
                    if (playerComponent.player.direction == 0) {
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
                }

                // swing sword
                // 1. Check if canSwing and not currently swinging
                // 2. If currently swinging, progress swinging animation
                // 3. When swing doine set back to original pos

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

                // first pull back on the sword to telegraph a swing
                if (
                    this.sword.windUp &&
                    this.swingTime == 0 &&
                    this.windUpTime <= this.maxWindUpTime
                ) {
                    // facing to the right
                    if (playerComponent.player.direction == 0) {
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
                    this.sword.lerpy = SwordComponent.lerp(
                        this.sword.lerpy,
                        this.transform.y - this.sword.height,
                        this.windUpTime / 3 / this.maxTime
                    )
                } else if (
                    this.sword.windUp &&
                    this.swingTime == 0 &&
                    this.windUpTime >= this.maxWindUpTime
                ) {
                    this.sword.windUp = false
                    this.sword.isSwinging = true
                } else {
                    // Actual swing
                    if (playerComponent.player.direction == 0) {
                        // if player is facing to the right
                        if (this.sword.isSwinging) {
                            this.swingTime += 20 / 1000
                            this.sword.lerpx = SwordComponent.lerp(
                                this.sword.lerpx,
                                this.transform.x + this.sword.height,
                                this.swingTime / this.maxTime
                            )
                            this.sword.lerpy = SwordComponent.lerp(
                                this.sword.lerpy,
                                playerComponent.transform.y +
                                    playerComponent.player.height / 1.5,
                                this.swingTime / 3 / this.maxTime
                            )
                        }
                        // if the player is not swinging
                        else {
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
                            this.swingTime += 20 / 1000
                            this.sword.lerpx = SwordComponent.lerp(
                                this.sword.lerpx,
                                this.transform.x - this.sword.height,
                                this.swingTime / this.maxTime
                            )
                            this.sword.lerpy = SwordComponent.lerp(
                                this.sword.lerpy,
                                playerComponent.transform.y +
                                    playerComponent.player.height / 1.5,
                                this.swingTime / 3 / this.maxTime
                            )
                        }
                        // If the player is not swinging
                        else {
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

                let prob = Math.random()
                this.freezeTime += Time.deltaTime
                if (playerComponent.player.nearPlayer) {
                    if (
                        prob >= 0.97 &&
                        this.freezeTime >= this.maxFreezeTime &&
                        this.sword.canSwing &&
                        !this.sword.isSwinging
                    ) {
                        this.freezeTime = 0
                        this.swingTime = 0
                        this.windUpTime = 0
                        this.blockedTime = 0
                        this.sword.windUp = true
                        this.sword.canSwing = false
                    }
                }
                if (this.sword.isSwinging && this.swingTime >= this.maxTime) {
                    this.swingTime = 0
                    this.windUpTime = 0
                    this.blockedTime = 0
                    this.sword.isSwinging = false
                    this.sword.canSwing = true
                    this.sword.windUp = false
                }
                break
            }
            this.found = false
        }
        // If the enemy dies let the sword fall to the floor
        if (!this.found) {
            this.sword.isSwinging = false
            if (!this.sword.stuck) {
                let platformGameObject =
                    GameObject.getObjectByName('PlatformGameObject')
                let platformComponent =
                    platformGameObject.getComponent('PlatformComponent')

                let floorGameObject =
                    GameObject.getObjectByName('FloorGameObject')
                let floorComponent =
                    floorGameObject.getComponent('FloorComponent')

                // If the sword is in the air then apply the effect of gravity
                if (this.sword.y_v < 12) this.sword.y_v += this.gravity

                // Updating the y and x coordinates of the player
                this.transform.y += this.sword.y_v
                // Check for collions with the platform
                for (let i = 0; i < platformComponent.platforms.length; i++) {
                    let plat = platformComponent.platforms[i]
                    if (
                        plat.x < this.transform.x + this.sword.width &&
                        this.transform.x < plat.x + plat.width &&
                        plat.y < this.transform.y &&
                        this.transform.y < plat.y + plat.height
                    ) {
                        this.transform.y = plat.y
                        this.sword.stuck = true
                    }
                }

                // Check for collisions with the floor
                let plat = floorComponent.floor
                if (
                    plat.x < this.transform.x + this.sword.width &&
                    this.transform.x < plat.x + plat.width &&
                    plat.y < this.transform.y &&
                    this.transform.y < plat.y + plat.height
                ) {
                    this.transform.y = plat.y
                    this.sword.stuck = true
                }
                if (this.transform.y >= plat.y + 400) {
                    this.parent.destroy()
                }

                this.sword.lerpx = SwordComponent.lerp(
                    this.sword.lerpx,
                    this.transform.x,
                    300 / 1000
                )
                this.sword.lerpy = this.transform.y - this.sword.height
            } else {
                // check if the sword is not laying flat
                if (this.swingTime < this.maxTime) {
                    // tilted to the left
                    if (this.transform.x > this.sword.lerpx) {
                        this.swingTime += 60 / 1000
                        this.sword.lerpx = SwordComponent.lerp(
                            this.sword.lerpx,
                            this.transform.x - this.sword.height,
                            this.swingTime / this.maxTime
                        )
                        this.sword.lerpy = SwordComponent.lerp(
                            this.sword.lerpy,
                            this.transform.y,
                            this.swingTime / this.maxTime
                        )
                    }
                    // tilted to the right
                    else if (this.transform.x < this.sword.lerpx) {
                        this.swingTime += 60 / 1000
                        this.sword.lerpx = SwordComponent.lerp(
                            this.sword.lerpx,
                            this.transform.x + this.sword.height,
                            this.swingTime / this.maxTime
                        )
                        this.sword.lerpy = SwordComponent.lerp(
                            this.sword.lerpy,
                            this.transform.y,
                            this.swingTime / this.maxTime
                        )
                    }
                }
            }
        }
    }
    // draw(ctx) {
    //     ctx.strokeStyle = 'black'
    //     ctx.lineWidth = 3
    //     ctx.beginPath()
    //     ctx.moveTo(this.transform.x, this.transform.y)
    //     ctx.lineTo(this.sword.lerpx, this.sword.lerpy)
    //     ctx.stroke()
    // }
}

class EnemySwordGameObject extends GameObject {
    name = 'EnemySwordGameObject'
    constructor(id) {
        super()
        this.id = id
    }
    start() {
        this.addComponent(new EnemySwordComponent(this.id)).layer = -1
    }
}

class PlatformComponent extends Component {
    name = 'PlatformComponent'
    start() {
        // The platforms
        this.platforms = []

        // =======================================================
        // Middle area platforms
        // =======================================================
        this.platforms.push({
            x: 150,
            y: 180,
            width: 110,
            height: 15,
            passable: true,
        })

        this.platforms.push({
            x: 150,
            y: 280,
            width: 110,
            height: 15,
            passable: true,
        })

        this.platforms.push({
            x: 150,
            y: 380,
            width: 110,
            height: 15,
            passable: true,
        })

        this.platforms.push({
            x: -50,
            y: 100,
            width: 310,
            height: 15,
            passable: true,
        })

        // =======================================================
        // Lower Area Platforms
        // =======================================================

        // this.platforms.push({
        //     x: -110,
        //     y: 580,
        //     width: 110,
        //     height: 15,
        //     passable: true,
        // })
    }
    draw(ctx) {
        // Create platforms

        // Render platforms
        ctx.fillStyle = '#4250ed'
        for (let i = 0; i < this.platforms.length; i++) {
            ctx.fillRect(
                this.platforms[i].x,
                this.platforms[i].y,
                this.platforms[i].width,
                this.platforms[i].height
            )
        }
    }
}

class FloorComponent extends Component {
    name = 'FloorComponent'
    start() {
        this.floor = {
            x: 0,
            y: 500,
            width: 1000,
            height: 15,
            passable: false,
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#19183d'
        ctx.fillRect(
            this.floor.x,
            this.floor.y,
            this.floor.width,
            this.floor.height
        )
    }
}

// class PlayerComponentTest extends Component {
//     name = 'PlayerComponentTest'
//     speed = 20
//     start() {
//         // Player obj
//         this.player = {
//             x_v: 0,
//             y_v: 0,
//             canJump: false,
//             jumpDown: false,
//             height: 20,
//             width: 20,
//         }

//         // Gravity and Friction variables
//         this.gravity = 0.6
//         this.friction = 0.7

//         // Pass through plats
//         this.markForPass = false
//     }
//     update() {
//         if (keysDown['ArrowRight']) {
//             this.transform.x += this.speed * Time.deltaTime
//         }
//         if (keysDown['ArrowLeft']) {
//             this.transform.x -= this.speed * Time.deltaTime
//         }
//     }
// }

class BenchComponent extends Component {
    name = 'BenchComponent'
    start() {
        this.bench = {
            id: 1,
            x: 15,
            y: 500,
            height: 12,
            width: 70,
        }
        this.sit_x
        this.sit_y
        this.freezeTime = 0
        this.maxFreezeTime = 0.5

        // Front left leg
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                3,
                this.bench.x,
                this.bench.y,
                this.bench.x,
                this.bench.y - this.bench.height
            )
        )

        // Back left leg
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                3,
                this.bench.x - 10,
                this.bench.y,
                this.bench.x - 10,
                this.bench.y - this.bench.height * 3.3
            )
        )

        // Front right leg
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                3,
                this.bench.x + 70,
                this.bench.y,
                this.bench.x + 70,
                this.bench.y - this.bench.height
            )
        )

        // Back right leg
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                3,
                this.bench.x + 60,
                this.bench.y,
                this.bench.x + 60,
                this.bench.y - this.bench.height * 3.3
            )
        )

        // Right edge
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x + 60,
                this.bench.y - this.bench.height * 1.2,
                this.bench.x + 70,
                this.bench.y - this.bench.height
            )
        )

        // Left edge
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x - 10,
                this.bench.y - this.bench.height * 1.2,
                this.bench.x,
                this.bench.y - this.bench.height
            )
        )

        // Seat
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x - 10,
                this.bench.y - this.bench.height * 1.2,
                this.bench.x + 60,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x,
                this.bench.y - this.bench.height,
                this.bench.x + 70,
                this.bench.y - this.bench.height
            )
        )

        // Top
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                3,
                this.bench.x - 10,
                this.bench.y - this.bench.height * 3.3,
                this.bench.x + 60,
                this.bench.y - this.bench.height * 3.3
            )
        )

        // Back designs
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x - 10,
                this.bench.y - this.bench.height - 10,
                this.bench.x,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x - 10,
                this.bench.y - this.bench.height - 20,
                this.bench.x + 10,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x - 10,
                this.bench.y - this.bench.height * 3.3,
                this.bench.x + 20,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x,
                this.bench.y - this.bench.height * 3.3,
                this.bench.x + 30,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x + 60,
                this.bench.y - this.bench.height - 10,
                this.bench.x + 50,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x + 60,
                this.bench.y - this.bench.height - 20,
                this.bench.x + 40,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x + 60,
                this.bench.y - this.bench.height * 3.3,
                this.bench.x + 30,
                this.bench.y - this.bench.height * 1.2
            )
        )
        this.parent.addComponent(
            new Line(
                '#7d7db3',
                2,
                this.bench.x + 50,
                this.bench.y - this.bench.height * 3.3,
                this.bench.x + 20,
                this.bench.y - this.bench.height * 1.2
            )
        )
    }
    update() {
        this.freezeTime += Time.deltaTime
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let player = playerGameObject.getComponent('PlayerComponent')

        this.sit_x =
            (this.bench.x + this.bench.width) / 2 - player.player.width / 2
        this.sit_y =
            this.bench.y - this.bench.height * 1.2 - player.player.height

        let checkpointGameObject = GameObject.getObjectByName(
            'CheckpointGameObject'
        )
        let checkpointComponent = checkpointGameObject.getComponent(
            'CheckpointComponent'
        )

        if (
            player.transform.x + player.player.width >= this.bench.x &&
            player.transform.x <= this.bench.width + this.bench.x
        ) {
            if (
                player.transform.y <= this.bench.y &&
                player.transform.y >= this.bench.y - this.bench.height * 3.3
            ) {
                if (
                    (keysDown['e'] || keysDown['E']) &&
                    this.freezeTime >= this.maxFreezeTime
                ) {
                    this.freezeTime = 0
                    if (!player.player.sitting) {
                        checkpointComponent.updateId(this.bench.id)
                        player.player.sitting = true

                        checkpointComponent.setSpawnLocation(
                            this.sit_x,
                            this.sit_y
                        )
                        player.transform.x = this.sit_x
                        player.transform.y = this.sit_y
                    } else {
                        player.player.sitting = false
                    }
                }
            }
        }
    }
}

class MainScene extends Scene {
    constructor() {
        super('teal')
    }
    start() {
        this.addGameObject(
            new GameObject('BenchGameObject').addComponent(new BenchComponent())
        ).layer = -5
        this.addGameObject(
            new GameObject('PlayerGameObject')
                .addComponent(new PlayerComponent())
                .addComponent(new Rectangle('red'))
        ).layer = 0
        this.addGameObject(new EnemyGameObject(1)).layer = -1
        this.addGameObject(new EnemyGameObject(2)).layer = -1
        this.addGameObject(new EnemyGameObject(3)).layer = -1
        this.addGameObject(
            new GameObject('PlatformGameObject').addComponent(
                new PlatformComponent()
            )
        ).layer = 5
        this.addGameObject(
            new GameObject('FloorGameObject').addComponent(new FloorComponent())
        ).layer = 5
        this.addGameObject(
            new GameObject('MainControllerObject').addComponent(
                new MainController()
            )
        )
        Camera.main.parent.addComponent(new MainCameraComponent())
    }
}

//-----------------------------------------------------
//End

class EndController extends Component {
    start() {
        this.freezeTime = 0
        this.maxFreezeTime = 1
    }
    update() {
        this.freezeTime += Time.deltaTime
        if (this.freezeTime >= this.maxFreezeTime) {
            if (keysDown['a']) {
                SceneManager.changeScene(0)
            } else if (keysDown['Enter']) {
                SceneManager.changeScene(1)
            }
        }
    }
}

// class EndDrawComponent extends Component {
//     draw(ctx) {
//         ctx.fillStyle = 'black'
//         ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
//         ctx.fillStyle = 'red'
//         ctx.fillText('You died', 100, 100)
//     }
// }

class EndCameraComponent extends Component {
    start() {}
    update() {}
}

class EndScene extends Scene {
    constructor() {
        super('black')
    }
    start() {
        this.addGameObject(new GameObject().addComponent(new EndController()))
        // this.addGameObject(
        //     new GameObject().addComponent(new EndDrawComponent())
        // )
        this.addGameObject(
            new GameObject('DeathGameObject').addComponent(
                new Text('You Died! Press Enter to Respawn.', 'red')
            ),
            new Vector2(-150, 0)
        )
        Camera.main.parent.addComponent(new EndCameraComponent())
    }
}

let startScene = new StartScene()
let mainScene = new MainScene()
let endScene = new EndScene()

window.allScenes = [startScene, mainScene, endScene]
