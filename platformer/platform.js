// Basic logic for platforms and player inspired from https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript
//
// Educative (2023) "How to make a simple platformer using JavaScript" [Source code] https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript

// Lerp tutorial for sword movement from https://gamedevbeginner.com/the-right-way-to-lerp-in-unity-with-examples/

import 'Game-Project/engine/engine.js'

// =================================================== //
//                        Start                        //
// =================================================== //

class CheckpointComponent extends Component {
    name = 'CheckpointComponent'
    benchId = 0
    spawn_x = 0
    spawn_y = 0
    spawned = false
    equipedSword = false
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
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        if (playerGameObject) {
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
                //The player is below
                this.transform.y += 0.1 * (difference - maxDifference)
            } else if (difference < -maxDifference) {
                //The player is above
                this.transform.y += 0.1 * (difference + maxDifference)
            }
        }
    }
}

class Hint_1 extends GameObject {
    name = 'Hint_1'
    start() {
        this.transform.x = 180
        this.transform.y = 20
        this.addComponent(
            new GUITextCentered('Use WASD or the arrow keys to move')
        )
    }
}

class Hint_2 extends GameObject {
    name = 'Hint_2'
    start() {
        this.transform.x = 140
        this.transform.y = 20
        this.addComponent(
            new GUITextCentered('Press e to interact with things')
        )
    }
}

class SadSwordComponent extends Component {
    name = 'SadSwordComponent'
    start() {
        this.transform.x = 670
        this.transform.y = -35
        this.transform.sx = 680
        this.transform.sy = 0
        this.parent.addComponent(new Line('black', 2))
    }
    update() {
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
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
                Math.abs(this.transform.x - playerComponent.transform.x) <= 30
            ) {
                if (
                    Input.keyUp['e'] &&
                    !checkpointComponent.getSwordEquipment()
                ) {
                    GameObject.instantiate(
                        new SwordGameObject().addComponent(new Line('black', 3))
                    )
                    checkpointComponent.setSwordEquipment(true)
                }
                if (checkpointComponent.getSwordEquipment()) {
                    this.parent.destroy()
                }
            }
        }
    }
}

class SadSwordGameObject extends GameObject {
    name = 'SadSwordGameObject'
    start() {
        this.addComponent(new SadSwordComponent()).layer = -1
    }
}

class StartController extends Component {
    start() {
        this.enemy_count = 1
        GameObject.getObjectByName('CheckpointGameObject').doNotDestroyOnLoad()
        this.playerStarted = false

        let checkpointGameObject = GameObject.getObjectByName(
            'CheckpointGameObject'
        )
        let checkpointComponent = checkpointGameObject.getComponent(
            'CheckpointComponent'
        )
        // Spawn in the sword if the player hasn't picked it up yet
        if (!checkpointComponent.getSwordEquipment()) {
            GameObject.instantiate(new SadSwordGameObject())
        }
    }
    update() {
        let checkpointGameObject = GameObject.getObjectByName(
            'CheckpointGameObject'
        )
        let checkpointComponent = checkpointGameObject.getComponent(
            'CheckpointComponent'
        )
        let startTextGameObject = GameObject.getObjectByName(
            'StartTextGameObject'
        )
        let startTextGameObject_2 = GameObject.getObjectByName(
            'StartTextGameObject_2'
        )

        // If this isn't the first time in this area don't display the welcome text and hints
        if (checkpointComponent.spawned) {
            if (!this.playerStarted) {
                this.playerStarted = true
                if (startTextGameObject) startTextGameObject.destroy()
                if (startTextGameObject_2) startTextGameObject_2.destroy()
                GameObject.instantiate(new PlayerGameObject())
            }
        } else {
            if (Input.keyUp['Enter']) {
                checkpointComponent.spawned = true

                if (startTextGameObject) startTextGameObject.destroy()

                if (startTextGameObject_2) startTextGameObject_2.destroy()
                // SceneManager.changeScene(1)
                this.playerStarted = true
                GameObject.instantiate(new PlayerGameObject())
                // GameObject.getObjectByName('PlayerGameObject').doNotDestroyOnLoad()
            }
        }

        // Spawn in enemies when sitting on bench

        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        if (playerGameObject) {
            let playerComponent =
                playerGameObject.getComponent('PlayerComponent')
            if (playerComponent.player.sitting) {
                let enemySwordGameObjects = GameObject.getObjectsByName(
                    'EnemyShieldGameObject'
                )
                let enemyGamesObjects =
                    GameObject.getObjectsByName('EnemyGameObject')
                if (enemyGamesObjects.length != this.enemy_count) {
                    let total_ids = []
                    let ids = []
                    for (let i = 1; i <= this.enemy_count; i++) {
                        total_ids.push(-i)
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
        this.addGameObject(
            new GameObject('StartTextGameObject').addComponent(
                new GUITextCentered('Welcome to the game!')
            ),
            new Vector2(300, 100)
        )
        this.addGameObject(
            new GameObject('StartTextGameObject_2').addComponent(
                new GUITextCentered('Press Enter to start!')
            ),
            new Vector2(300, 200)
        )
        // this.addGameObject(new SadSwordGameObject())

        this.addGameObject(new BenchGameObject(-1, 900, 45)).layer = -5
        this.addGameObject(new DoorGameObject(1, 1375, -40)).layer = -5
        // this.addGameObject(new EnemyGameObject(1)).layer = -1

        this.addGameObject(new FloorGameObject(-300, 100, 600, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-300, -150, 600, 15)).layer = 5
        this.addGameObject(new FloorGameObject(350, 50, 200, 15)).layer = 5
        this.addGameObject(new FloorGameObject(600, 0, 200, 15)).layer = 5
        this.addGameObject(new FloorGameObject(800, 15, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(825, 30, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(850, 45, 600, 15)).layer = 5

        this.addGameObject(new EnemyGameObject(-1)).layer = -1

        // this.addGameObject(
        //     new GameObject('MainControllerObject').addComponent(
        //         new MainController()
        //     )
        // )

        Camera.main.parent.addComponent(new MainCameraComponent())
    }
}

// =================================================== //
//                        Main                         //
// =================================================== //

class MainController extends Component {
    name = 'MainController'
    start() {
        // if (SceneManager.getActiveScene() == 0) {
        //     this.enemy_count = 1
        // } else this.enemy_count = 3
        this.enemy_count = 7
        GameObject.getObjectByName('CheckpointGameObject').doNotDestroyOnLoad()
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
                new SwordGameObject().addComponent(new Line('black', 3))
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
            this.transform.x = checkpointComponent.getSpawnX()
            this.transform.y = checkpointComponent.getSpawnY()

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
            this.parent.layer = 0

            // Check if the player is blocked
            if (this.player.blocked && this.player.canJump) {
                this.player.canJump = false
                this.transform.y -= 10
            } else {
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
                        // Move Down through Plat
                        if (!(keysDown['ArrowDown'] || keysDown['s'])) {
                            this.player.canJump = true
                            this.player.y_v = 0
                            this.transform.y = plat.y - this.player.height
                        }
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
                                                    shieldComponent.transform
                                                        .x +
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
                                                    shieldComponent.transform
                                                        .y &&
                                                    y_end <=
                                                        shieldComponent
                                                            .transform.y +
                                                            shieldComponent
                                                                .shield
                                                                .height) ||
                                                (y_start <=
                                                    shieldComponent.transform
                                                        .y &&
                                                    y_end <=
                                                        shieldComponent
                                                            .transform.y +
                                                            shieldComponent
                                                                .shield.height)
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
                                        (y_start >=
                                            shieldComponent.transform.y &&
                                            y_end <=
                                                shieldComponent.transform.y +
                                                    shieldComponent.shield
                                                        .height) ||
                                        (y_start <=
                                            shieldComponent.transform.y &&
                                            y_end <=
                                                shieldComponent.transform.y +
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
            }
            if ((in_range && !blocked) || fallen) {
                SceneManager.changeScene(2)
            }
        } else this.parent.layer = -1
    }
}

class PlayerGameObject extends GameObject {
    name = 'PlayerGameObject'
    start() {
        this.addComponent(new PlayerComponent()).addComponent(
            new Rectangle('red')
        )
    }
}

class SwordComponent extends Component {
    name = 'SwordComponent'
    start() {
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')

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

        // this.transform.x =
        //     playerComponent.transform.x + playerComponent.player.width / 3
        // this.transform.y =
        //     playerComponent.transform.y + playerComponent.player.height / 1.5
        // this.sword.lerpx = SwordComponent.lerp(
        //     this.sword.lerpx,
        //     this.transform.x - this.sword.height / 3,
        //     this.windUpTime / this.maxTime
        // )
        // this.sword.lerpy = this.transform.y - this.sword.height
        // this.transform.sx = this.sword.lerpx
        // this.transform.sy = this.sword.lerpy
    }
    update() {
        this.transform.sx = this.sword.lerpx
        this.transform.sy = this.sword.lerpy
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')
        let shieldGameObject = GameObject.getObjectByName('ShieldGameObject')

        this.sword.sitting = playerComponent.player.sitting
        if (!this.sword.sitting) {
            playerComponent.player.blocked = this.sword.blocked
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

            // Check if the player blocked
            if (this.sword.blocked && this.blockedTime <= this.maxBlockedTime) {
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
            if (
                keysDown[' '] &&
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
            if (this.sword.isSwinging && this.swingTime >= this.maxTime) {
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
                playerComponent.transform.x + (3 * this.sword.height) / 4
            this.transform.sy =
                playerComponent.transform.y + this.sword.height / 2
        }
    }
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
        this.parent.addComponent(new Rectangle('black'))
        this.parent.addComponent(new Rectangle('none', 'grey'))
    }
    update() {
        this.transform.sx = this.shield.width
        this.transform.sy = -this.shield.height

        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        let playerComponent = playerGameObject.getComponent('PlayerComponent')
        let swordGameObject = GameObject.getObjectByName('SwordGameObject')

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
                this.freezeTime >= this.maxFreezeTime &&
                (keysDown['f'] || keysDown['F'])
            ) {
                if (swordGameObject) {
                    let swordComponent =
                        swordGameObject.getComponent('SwordComponent')
                    if (!swordComponent.sword.isSwinging) {
                        this.shield.lerpx = this.transform.x
                        this.shield.lerpy = this.transform.y
                        this.blockTime = 0
                        this.shield.isBlocking = true
                        this.shield.canBlock = false
                    }
                } else {
                    this.shield.lerpx = this.transform.x
                    this.shield.lerpy = this.transform.y
                    this.blockTime = 0
                    this.shield.isBlocking = true
                    this.shield.canBlock = false
                }
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
}

class ShieldGameObject extends GameObject {
    name = 'ShieldGameObject'
    start() {
        this.addComponent(new ShieldComponent()).layer = 1
    }
}

class EnemyComponent extends Component {
    name = 'EnemyComponent'
    constructor(walking, x_start, y_start, id, sword, shield) {
        super()
        this.walking = walking
        this.x_start = x_start
        this.y_start = y_start
        this.id = id
        this.sword = sword
        this.shield = shield
    }

    start() {
        // Instantiate a sword
        if (this.sword) {
            GameObject.instantiate(
                new EnemySwordGameObject(this.id).addComponent(
                    new Line('black', 3)
                )
            )
        }

        // Instantiate a shield
        if (this.shield) {
            GameObject.instantiate(new EnemyShieldGameObject(this.id))
        }

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

        this.turnTimer = 2
        this.maxTurnTimer = 2
    }
    update() {
        // if (!this.parent.markedForDestroy) {
        // }
        let platformGameObject =
            GameObject.getObjectByName('PlatformGameObject')

        let floorGameObjects = GameObject.getObjectsByName('FloorGameObject')

        // If the player is in the air then apply the effect of gravity
        if (!this.player.canJump && this.player.y_v <= 12)
            this.player.y_v += this.gravity

        if (this.player.blocked && this.player.canJump) {
            this.player.canJump = false
            this.player.y_v = 0
            this.transform.y -= 10
            if (this.player.direction == 0) {
                this.transform.x -= 0.5
            } else this.transform.x += 0.5
        }

        // Updating the y and x coordinates of the player
        this.transform.y += this.player.y_v
        // this.transform.x += this.player.x_v

        // Check for collisions with the platform
        if (platformGameObject) {
            let platformComponent =
                platformGameObject.getComponent('PlatformComponent')
            for (let i = 0; i < platformComponent.platforms.length; i++) {
                let plat = platformComponent.platforms[i]
                if (
                    plat.x < this.transform.x + this.player.width &&
                    this.transform.x < plat.x + plat.width &&
                    plat.y < this.transform.y + this.player.height &&
                    this.transform.y + this.player.height < plat.y + plat.height
                ) {
                    // this.player.y_v = 0
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
                            if (
                                this.transform.x >=
                                plat.x + this.player.width
                            ) {
                                this.transform.x -= this.player.x_v
                            } else this.player.direction = 0
                        }
                    }
                }
            }
        }

        // Check for collisions with the floor
        if (floorGameObjects) {
            for (let floorGameObject of floorGameObjects) {
                let floorComponent =
                    floorGameObject.getComponent('FloorComponent')
                let plat = floorComponent.floor
                if (
                    plat.x < this.transform.x + this.player.width &&
                    this.transform.x < plat.x + plat.width &&
                    plat.y < this.transform.y + this.player.height &&
                    this.transform.y + this.player.height < plat.y + plat.height
                ) {
                    // this.player.y_v = 0
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
                            if (
                                this.transform.x >=
                                plat.x + this.player.width
                            ) {
                                this.transform.x -= this.player.x_v
                            } else this.player.direction = 0
                        }
                    }
                }
                // if below the floor destroy it
                if (this.transform.y >= plat.y + 400) {
                    this.parent.destroy()
                }
            }
        }

        // Get information from player component
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        if (playerGameObject) {
            let playerComponent =
                playerGameObject.getComponent('PlayerComponent')

            if (!playerComponent.player.sitting) {
                // Check direction to face
                let dist_x = this.transform.x - playerComponent.transform.x

                let dist_y = this.transform.y - playerComponent.transform.y
                if (Math.abs(dist_y) <= 50 && Math.abs(dist_x) <= 100) {
                    this.player.nearPlayer = true
                    if (this.shield) {
                        this.turnTimer += Time.deltaTime
                        if (this.turnTimer >= this.maxTurnTimer) {
                            this.turnTimer = 0
                            dist_x <= 0
                                ? (this.player.direction = 0)
                                : (this.player.direction = 1)
                        }
                    } else {
                        dist_x <= 0
                            ? (this.player.direction = 0)
                            : (this.player.direction = 1)
                    }
                } else this.player.nearPlayer = false

                let shieldGameObjects = GameObject.getObjectsByName(
                    'EnemyShieldGameObject'
                )
                let shieldGameObject
                for (let shield of shieldGameObjects) {
                    if (
                        shield.getComponent('EnemyShieldComponent').id ==
                        this.id
                    ) {
                        shieldGameObject = shield
                        break
                    }
                    shieldGameObject
                }

                // Check for collisions with the player sword
                let swordGameObject =
                    GameObject.getObjectByName('SwordGameObject')
                let in_range = false
                let blocked = false
                if (swordGameObject) {
                    let swordComponent =
                        swordGameObject.getComponent('SwordComponent')

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

                                if (shieldGameObject) {
                                    let shieldComponent =
                                        shieldGameObject.getComponent(
                                            'EnemyShieldComponent'
                                        )
                                    if (shieldComponent.shield.isBlocking) {
                                        // Check if the shield is within the x-range of the sword
                                        if (
                                            (x_start >=
                                                shieldComponent.transform.x &&
                                                x_end <=
                                                    shieldComponent.transform
                                                        .x +
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
                                                    shieldComponent.transform
                                                        .y &&
                                                    y_end <=
                                                        shieldComponent
                                                            .transform.y +
                                                            shieldComponent
                                                                .shield
                                                                .height) ||
                                                (y_start <=
                                                    shieldComponent.transform
                                                        .y &&
                                                    y_end <=
                                                        shieldComponent
                                                            .transform.y +
                                                            shieldComponent
                                                                .shield.height)
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
                            let shieldComponent = shieldGameObject.getComponent(
                                'EnemyShieldComponent'
                            )

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
                                        (y_start >=
                                            shieldComponent.transform.y &&
                                            y_end <=
                                                shieldComponent.transform.y +
                                                    shieldComponent.shield
                                                        .height) ||
                                        (y_start <=
                                            shieldComponent.transform.y &&
                                            y_end >=
                                                shieldComponent.transform.y +
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
                if (in_range && !blocked) {
                    this.parent.destroy()
                }
            }
        } else this.player.nearPlayer = false
    }
}

class EnemyGameObject extends GameObject {
    name = 'EnemyGameObject'
    constructor(id) {
        super()
        this.id = id

        // For enemies that cannot move:
        // #9e34eb
        // For enemies that can move:
        // #d6d64b

        if (this.id == 1) {
            this.walking = false
            this.x_start = 195
            this.y_start = 200
            this.sword = true
            this.shield = false
            this.addComponent(new Rectangle('#9e34eb'))
        } else if (this.id == 2) {
            this.walking = true
            this.x_start = -40
            this.y_start = 60
            this.sword = true
            this.shield = true
            this.addComponent(new Rectangle('#d6d64b'))
        } else if (this.id == 3) {
            this.walking = true
            this.x_start = 900
            this.y_start = 0
            this.sword = true
            this.shield = false
            this.addComponent(new Rectangle('#d6d64b'))
        } else if (this.id == 4) {
            this.walking = true
            this.x_start = 400
            this.y_start = 450
            this.sword = true
            this.shield = false
            this.addComponent(new Rectangle('#d6d64b'))
        } else if (this.id == 5) {
            this.walking = false
            this.x_start = 600
            this.y_start = 500
            this.sword = true
            this.shield = true
            this.addComponent(new Rectangle('#9e34eb'))
        } else if (this.id == 6) {
            this.walking = false
            this.x_start = 740
            this.y_start = 500
            this.sword = true
            this.shield = true
            this.addComponent(new Rectangle('#9e34eb'))
        } else if (this.id == 7) {
            this.walking = true
            this.x_start = 550
            this.y_start = 300
            this.sword = true
            this.shield = false
            this.addComponent(new Rectangle('#d6d64b'))
        }
        // first scene
        else if (this.id == -1) {
            this.walking = false
            this.x_start = 1140
            this.y_start = -40
            this.sword = false
            this.shield = true
            this.addComponent(new Rectangle('#9e34eb'))
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
                this.id,
                this.sword,
                this.shield
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
                    this.freezeTime = 0
                    this.sword.isSwinging = false
                    this.sword.canSwing = false
                    this.blockedTime += Time.deltaTime
                } else if (
                    this.sword.blocked &&
                    this.blockedTime >= this.maxBlockedTime
                ) {
                    this.freezeTime = 0
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

                let floorGameObjects =
                    GameObject.getObjectsByName('FloorGameObject')

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
                for (let floorGameObject of floorGameObjects) {
                    let floorComponent =
                        floorGameObject.getComponent('FloorComponent')
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
                    if (this.transform.y >= plat.y + 1000) {
                        this.parent.destroy()
                    }
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

class EnemyShieldComponent extends Component {
    name = 'EnemyShieldComponent'
    constructor(id) {
        super()
        this.id = id
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
        this.parent.addComponent(new Rectangle('black'))
        this.parent.addComponent(new Rectangle('none', 'grey'))
    }
    update() {
        this.transform.sx = this.shield.width
        this.transform.sy = -this.shield.height

        this.found = false
        let enemies = GameObject.getObjectsByName('EnemyGameObject')
        // if the enemy is alive
        for (let enemy of enemies) {
            let enemyComponent = enemy.getComponent('EnemyComponent')
            // find matching id
            if (enemyComponent.id == this.id) {
                this.found = true
                let playerComponent = enemyComponent
                if (playerComponent.player.direction == 1) {
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

                this.shield.lerpx = ShieldComponent.lerp(
                    this.shield.lerpx,
                    this.transform.x,
                    500 / 1000
                )
                this.transform.x = this.shield.lerpx
            }
        }
        if (!this.found) {
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
                    for (
                        let i = 0;
                        i < platformComponent.platforms.length;
                        i++
                    ) {
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
                        this.transform.x + this.shield.width <=
                            plat.x + plat.width
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
            let playerGameObject =
                GameObject.getObjectByName('PlayerGameObject')
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
                    30
                ) {
                    if (
                        Input.keyUp['e'] &&
                        !checkpointComponent.getShieldEquipment()
                    ) {
                        GameObject.instantiate(new ShieldGameObject())
                        checkpointComponent.setShieldEquipment(true)
                        this.parent.destroy()
                    }
                }
            }
        }
    }
}

class EnemyShieldGameObject extends GameObject {
    name = 'EnemyShieldGameObject'
    constructor(id) {
        super()
        this.id = id
    }
    start() {
        this.addComponent(new EnemyShieldComponent(this.id)).layer = -1
    }
}

class PlatformComponent extends Component {
    name = 'PlatformComponent'
    start() {
        // The platforms
        this.platforms = []

        // =======================================================
        // First area platforms
        // =======================================================
        this.platforms.push({
            x: 150,
            y: 180,
            width: 110,
            height: 15,
            passable: true,
        })

        this.parent.addComponent(
            new Rectangle('#4250ed', 'transparent', 1, 150, 180, 110, 15)
        )

        this.platforms.push({
            x: 150,
            y: 280,
            width: 110,
            height: 15,
            passable: true,
        })

        this.parent.addComponent(
            new Rectangle('#4250ed', 'transparent', 1, 150, 280, 110, 15)
        )

        this.platforms.push({
            x: 150,
            y: 380,
            width: 110,
            height: 15,
            passable: true,
        })

        this.parent.addComponent(
            new Rectangle('#4250ed', 'transparent', 1, 150, 380, 110, 15)
        )

        this.platforms.push({
            x: -50,
            y: 100,
            width: 310,
            height: 15,
            passable: true,
        })

        this.parent.addComponent(
            new Rectangle('#4250ed', 'transparent', 1, -50, 100, 310, 15)
        )

        // =======================================================
        // Middle Area Platforms
        // =======================================================

        this.platforms.push({
            x: 550,
            y: 330,
            width: 250,
            height: 15,
            passable: true,
        })

        this.parent.addComponent(
            new Rectangle('#4250ed', 'transparent', 1, 550, 330, 250, 15)
        )
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

class BenchComponent extends Component {
    name = 'BenchComponent'
    constructor(id, x, y) {
        super()
        this.id = id
        this.x = x
        this.y = y
    }
    start() {
        this.bench = {
            id: this.id,
            x: this.x,
            y: this.y,
            height: 12,
            width: 70,
        }
        this.sit_x
        this.sit_y

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
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        if (playerGameObject) {
            let player = playerGameObject.getComponent('PlayerComponent')

            this.sit_x =
                this.bench.x + this.bench.width / 2 - player.player.width
            this.sit_y =
                this.bench.y -
                this.bench.height * 3.3 +
                player.player.height / 4

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
                    if (Input.keyUp['e'] || Input.keyUp['E']) {
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
}

class BenchGameObject extends GameObject {
    name = 'BenchGameObject'
    constructor(id, x, y) {
        super()
        this.id = id
        this.x = x
        this.y = y
    }
    start() {
        this.addComponent(new BenchComponent(this.id, this.x, this.y))
    }
}

class DoorComponent extends Component {
    name = 'DoorComponent'
    constructor(id, x, y) {
        super()
        this.id = id
        this.x = x
        this.y = y
    }
    start() {
        this.door = {
            id: this.id,
            x: this.x,
            y: this.y,
            height: 90,
            width: 40,
        }
        this.transform.x = this.door.x
        this.transform.y = this.door.y
        this.transform.sx = this.door.width
        this.transform.sy = this.door.height
        // this.parent.addComponent(new Rectangle('#debc90'))
        this.parent.addComponent(new Rectangle('#de8816'))
        this.parent.addComponent(new Rectangle('none', '#38250b', 6))
    }
    update() {
        let checkpointGameObject = GameObject.getObjectByName(
            'CheckpointGameObject'
        )

        let checkpointComponent = checkpointGameObject.getComponent(
            'CheckpointComponent'
        )
        let playerGameObject = GameObject.getObjectByName('PlayerGameObject')
        if (playerGameObject) {
            let playerComponent =
                playerGameObject.getComponent('PlayerComponent')
            if (
                Math.abs(
                    this.transform.x +
                        this.door.width / 2 -
                        (playerComponent.transform.x +
                            playerComponent.player.width / 2)
                ) <= 25 &&
                Math.abs(
                    this.transform.y +
                        this.door.height -
                        (playerComponent.transform.y +
                            playerComponent.player.height)
                ) <= 25
            ) {
                if (Input.keyUp['e']) {
                    if (this.door.id == 1) {
                        checkpointComponent.setDoor(true)
                        checkpointComponent.setDoorLocation(-400, 435)
                        SceneManager.changeScene(1)
                    } else if (this.door.id == 2) {
                        checkpointComponent.setDoor(true)
                        checkpointComponent.setDoorLocation(1375, -40)
                        SceneManager.changeScene(0)
                    }
                }
            }
        }
    }
}

class DoorGameObject extends GameObject {
    name = 'DoorGameObject'
    constructor(id, x, y) {
        super()
        this.id = id
        this.x = x
        this.y = y
    }
    start() {
        this.addComponent(new DoorComponent(this.id, this.x, this.y))
    }
}

class MainScene extends Scene {
    constructor() {
        super('teal')
    }
    start() {
        // this.addGameObject(new BenchGameObject(2, 15, 500)).layer = -5
        this.addGameObject(new BenchGameObject(1, -175, 545)).layer = -5
        this.addGameObject(new DoorGameObject(2, -400, 435)).layer = -5
        this.addGameObject(
            new GameObject('PlayerGameObject')
                .addComponent(new PlayerComponent())
                .addComponent(new Rectangle('red'))
        ).layer = 0
        this.addGameObject(new EnemyGameObject(1)).layer = -1
        this.addGameObject(new EnemyGameObject(2)).layer = -1
        this.addGameObject(new EnemyGameObject(3)).layer = -1
        // Enemy under the platforms
        this.addGameObject(new EnemyGameObject(4)).layer = -1

        // Two enemies in divots -- cannot move
        this.addGameObject(new EnemyGameObject(5)).layer = -1
        this.addGameObject(new EnemyGameObject(6)).layer = -1

        // Enemy on platform with sword and shield
        this.addGameObject(new EnemyGameObject(7)).layer = -1

        this.addGameObject(
            new GameObject('PlatformGameObject').addComponent(
                new PlatformComponent()
            )
        ).layer = 5
        this.addGameObject(new FloorGameObject(0, 500, 500, 15)).layer = 5
        this.addGameObject(new FloorGameObject(500, 515, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(525, 530, 300, 15)).layer = 5
        this.addGameObject(new FloorGameObject(825, 515, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(850, 500, 500, 15)).layer = 5

        this.addGameObject(new FloorGameObject(-25, 515, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-50, 530, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-225, 545, 175, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-250, 530, 25, 15)).layer = 5
        this.addGameObject(new FloorGameObject(-425, 515, 175, 15)).layer = 5
        this.addGameObject(
            new GameObject('MainControllerObject').addComponent(
                new MainController()
            )
        )
        Camera.main.parent.addComponent(new MainCameraComponent())
    }
}

// =================================================== //
//                        Death                        //
// =================================================== //

class EndController extends Component {
    start() {}
    update() {
        if (Input.keyUp['Enter']) {
            // SceneManager.changeScene(1)
            let checkpointGameObject = GameObject.getObjectByName(
                'CheckpointGameObject'
            )
            let checkpointComponent = checkpointGameObject.getComponent(
                'CheckpointComponent'
            )
            if (checkpointComponent.benchId > 0) {
                SceneManager.changeScene(1)
            } else SceneManager.changeScene(0)
        }
    }
}

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
