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
    start() {}
    update() {
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')
        console.log(playerComponent.player.sitting)
        if (playerComponent.player.sitting) {
            let enemyGameObject = GameObject.getObjectByName('EnemyGameObject')
            let enemySwordGameObject = GameObject.getObjectByName(
                'EnemySwordGameObject'
            )

            if (!enemyGameObject) {
                if (enemySwordGameObject) enemySwordGameObject.destroy()
                GameObject.instantiate(new EnemyGameObject())
            }
        }
    }
}

class PlayerComponent extends Component {
    name = 'PlayerComponent'
    start() {
        // Instantiate the sword
        GameObject.instantiate(new SwordGameObject())
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
            if (this.transform.y >= plat.y + 400) {
                this.parent.destroy()
                SceneManager.changeScene(2)
            }

            // Check for collisions with the player sword
            let swordGameObject = GameObject.getObjectByName(
                'EnemySwordGameObject'
            )
            let swordComponent = swordGameObject.getComponent(
                'EnemySwordComponent'
            )

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
                        SceneManager.changeScene(2)
                    }
                }
            }
        }
    }
    draw(ctx) {
        ctx.fillStyle = '#de0d3a'
        ctx.fillRect(
            this.transform.x,
            this.transform.y,
            this.player.width,
            this.player.height
        )
    }
}

class SwordComponent extends Component {
    name = 'SwordComponent'
    start() {
        this.sword = {
            canSwing: true,
            isSwinging: false,
            height: 40,
            width: 4,
            lerpx: 0,
            lerpy: 0,
            sitting: false,
        }
        this.swingTime = 0
        this.maxTime = 1
    }
    update() {
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')
        this.sword.sitting = playerComponent.player.sitting
        if (!this.sword.sitting) {
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

            if (
                keysDown[' '] &&
                this.sword.canSwing &&
                !this.sword.isSwinging
            ) {
                this.swingTime = 0
                this.sword.isSwinging = true
                this.sword.canSwing = false
            }
            if (this.sword.isSwinging && this.swingTime >= this.maxTime) {
                this.swingTime = 0
                this.sword.isSwinging = false
                this.sword.canSwing = true
            }
        }
    }
    draw(ctx) {
        if (!this.sword.sitting) {
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(this.transform.x, this.transform.y)
            ctx.lineTo(this.sword.lerpx, this.sword.lerpy)
            ctx.stroke()
        }
    }
}

class SwordGameObject extends GameObject {
    name = 'SwordGameObject'
    start() {
        this.addComponent(new SwordComponent())
    }
}

class EnemyComponent extends Component {
    name = 'EnemyComponent'
    start() {
        // Instantiate a sword
        GameObject.instantiate(new EnemySwordGameObject())

        // Player obj
        this.player = {
            x_v: 0,
            y_v: 0,
            canJump: false,
            height: 20,
            width: 20,
            // 0 is facing right, 1 is facing left
            direction: 0,
            nearPlayer: false,
        }

        // Player x and y pos
        this.transform.x = 200
        this.transform.y = 200

        // Gravity and Friction variables
        this.gravity = 0.6
        this.friction = 0.7
    }
    update() {
        let platformGameObject =
            GameObject.getObjectByName('PlatformGameObject')
        let platformComponent =
            platformGameObject.getComponent('PlatformComponent')

        let floorGameObject = GameObject.getObjectByName('FloorGameObject')
        let floorComponent = floorGameObject.getComponent('FloorComponent')
        // If the player is in the air then apply the effect of gravity
        if (!this.player.canJump) this.player.y_v += this.gravity

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
            }
        }

        // Check for collisions with the floor
        let plat = floorComponent.floor
        if (
            plat.y <= this.transform.y + this.player.height &&
            this.transform.y + this.player.height <= plat.y + plat.height
        ) {
            this.player.canJump = true
            this.transform.y = plat.y - this.player.height
        }

        // Get information from player component
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')

        // Check direction to face
        let dist_x = this.transform.x - playerComponent.transform.x
        dist_x <= 0 ? (this.player.direction = 0) : (this.player.direction = 1)

        let dist_y = this.transform.y - playerComponent.transform.y

        if (Math.abs(dist_y) <= 50 && Math.abs(dist_x) <= 50) {
            this.player.nearPlayer = true
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
    }
    draw(ctx) {
        ctx.fillStyle = '#9e34eb'
        ctx.fillRect(
            this.transform.x,
            this.transform.y,
            this.player.width,
            this.player.height
        )
    }
}
class EnemyGameObject extends GameObject {
    name = 'EnemyGameObject'
    start() {
        this.addComponent(new EnemyComponent())
    }
}
class EnemySwordComponent extends Component {
    name = 'EnemySwordComponent'
    start() {
        this.sword = {
            canSwing: true,
            isSwinging: false,
            height: 40,
            width: 4,
            lerpx: 0,
            lerpy: 0,
            y_v: 0,
            x_v: 0,
            stuck: false,
        }
        this.swingTime = 0
        this.maxTime = 1
        this.gravity = 0.3
        this.freezeTime = 0
        this.maxFreezeTime = 2
    }
    update() {
        // If the player is alive
        if (GameObject.getObjectByName('EnemyGameObject')) {
            let playerGameObject = GameObject.getObjectByName('EnemyGameObject')
            let playerComponent =
                playerGameObject.getComponent('EnemyComponent')

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

            // if player is facing to the right
            if (playerComponent.player.direction == 0) {
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
                }
                // if the player is not swinging
                else {
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
                }
                // If the player is not swinging
                else {
                    this.sword.lerpx = SwordComponent.lerp(
                        this.sword.lerpx,
                        this.transform.x,
                        300 / 1000
                    )
                    this.sword.lerpy = this.transform.y - this.sword.height
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
                    this.sword.isSwinging = true
                    this.sword.canSwing = false
                }
            }
            if (this.sword.isSwinging && this.swingTime >= this.maxTime) {
                this.swingTime = 0
                this.sword.isSwinging = false
                this.sword.canSwing = true
            }
        }
        // If the player dies let the sword fall to the floor
        else {
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
                    plat.y <= this.transform.y + this.sword.height &&
                    this.transform.y + this.sword.height <=
                        plat.y + plat.height &&
                    this.transform.x + this.sword.width >= plat.x &&
                    this.transform.x <= plat.x + plat.width
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
    draw(ctx) {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(this.transform.x, this.transform.y)
        ctx.lineTo(this.sword.lerpx, this.sword.lerpy)
        ctx.stroke()
    }
}

class EnemySwordGameObject extends GameObject {
    name = 'EnemySwordGameObject'
    start() {
        this.addComponent(new EnemySwordComponent())
    }
}

class PlatformComponent extends Component {
    name = 'PlatformComponent'
    start() {
        // The platforms
        this.platforms = []

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
            x: 20,
            y: 100,
            width: 210,
            height: 15,
            passable: true,
        })
    }
    draw(ctx) {
        // Create platforms

        // Render platforms
        ctx.fillStyle = '#0c068c'
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
        ctx.fillStyle = '#0c068c'
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
    draw(ctx) {
        ctx.strokeStyle = '#7d7db3'
        ctx.lineWidth = 3

        // Front left leg
        ctx.beginPath()
        ctx.moveTo(this.bench.x, this.bench.y)
        ctx.lineTo(this.bench.x, this.bench.y - this.bench.height)
        ctx.stroke()

        // Back left leg
        ctx.beginPath()
        ctx.moveTo(this.bench.x - 10, this.bench.y)
        ctx.lineTo(this.bench.x - 10, this.bench.y - this.bench.height * 3.3)
        ctx.stroke()

        // Front right leg
        ctx.beginPath()
        ctx.moveTo(this.bench.x + 70, this.bench.y)
        ctx.lineTo(this.bench.x + 70, this.bench.y - this.bench.height)
        ctx.stroke()

        // Back right leg
        ctx.beginPath()
        ctx.moveTo(this.bench.x + 60, this.bench.y)
        ctx.lineTo(this.bench.x + 60, this.bench.y - this.bench.height * 3.3)
        ctx.stroke()

        // Right edge
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(this.bench.x + 60, this.bench.y - this.bench.height * 1.2)
        ctx.lineTo(this.bench.x + 70, this.bench.y - this.bench.height)
        ctx.stroke()

        // Left edge
        ctx.beginPath()
        ctx.moveTo(this.bench.x - 10, this.bench.y - this.bench.height * 1.2)
        ctx.lineTo(this.bench.x, this.bench.y - this.bench.height)
        ctx.stroke()

        // Seat
        ctx.beginPath()
        ctx.moveTo(this.bench.x - 10, this.bench.y - this.bench.height * 1.2)
        ctx.lineTo(this.bench.x + 60, this.bench.y - this.bench.height * 1.2)
        ctx.moveTo(this.bench.x, this.bench.y - this.bench.height)
        ctx.lineTo(this.bench.x + 70, this.bench.y - this.bench.height)
        ctx.stroke()

        // Top
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(this.bench.x - 10, this.bench.y - this.bench.height * 3.3)
        ctx.lineTo(this.bench.x + 60, this.bench.y - this.bench.height * 3.3)
        ctx.stroke()

        // Back designs
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(this.bench.x - 10, this.bench.y - this.bench.height - 10)
        ctx.lineTo(this.bench.x, this.bench.y - this.bench.height * 1.2)

        ctx.moveTo(this.bench.x - 10, this.bench.y - this.bench.height - 20)
        ctx.lineTo(this.bench.x + 10, this.bench.y - this.bench.height * 1.2)

        ctx.moveTo(this.bench.x - 10, this.bench.y - this.bench.height * 3.3)
        ctx.lineTo(this.bench.x + 20, this.bench.y - this.bench.height * 1.2)

        ctx.moveTo(this.bench.x, this.bench.y - this.bench.height * 3.3)
        ctx.lineTo(this.bench.x + 30, this.bench.y - this.bench.height * 1.2)

        ctx.moveTo(this.bench.x + 60, this.bench.y - this.bench.height - 10)
        ctx.lineTo(this.bench.x + 50, this.bench.y - this.bench.height * 1.2)

        ctx.moveTo(this.bench.x + 60, this.bench.y - this.bench.height - 20)
        ctx.lineTo(this.bench.x + 40, this.bench.y - this.bench.height * 1.2)

        ctx.moveTo(this.bench.x + 60, this.bench.y - this.bench.height * 3.3)
        ctx.lineTo(this.bench.x + 30, this.bench.y - this.bench.height * 1.2)

        ctx.moveTo(this.bench.x + 50, this.bench.y - this.bench.height * 3.3)
        ctx.lineTo(this.bench.x + 20, this.bench.y - this.bench.height * 1.2)
        ctx.stroke()
    }
}

class MainScene extends Scene {
    constructor() {
        super('teal')
    }
    start() {
        this.addGameObject(
            new GameObject('BenchGameObject').addComponent(new BenchComponent())
        )
        this.addGameObject(
            new GameObject('PlayerGameObject').addComponent(
                new PlayerComponent()
            )
        )
        this.addGameObject(
            new GameObject('EnemyGameObject').addComponent(new EnemyComponent())
        )

        this.addGameObject(
            new GameObject('PlatformGameObject').addComponent(
                new PlatformComponent()
            )
        )
        this.addGameObject(
            new GameObject('FloorGameObject').addComponent(new FloorComponent())
        )
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
