// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/SceneManager.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class SceneManager {
    static scenes = []

    static currentSceneIndex = 0

    static changedSceneFlag = true

    static previousSceneIndex = -1

    static startScenes(scenes, title) {
        SceneManager.setScenes(scenes)
        start(title)
    }

    static testScenes(scenes, title, options) {
        SceneManager.setScenes(scenes)
        test(title, options)
    }

    static setScenes(scenes) {
        SceneManager.currentSceneIndex = 0
        SceneManager.changedScene = true
        SceneManager.scenes = []
        SceneManager.addScenes(scenes)
    }

    static addScenes(scenes) {
        for (let scene of scenes) {
            SceneManager.addScene(scene)
        }
    }

    static addScene(scene) {
        SceneManager.scenes.push(scene)
    }

    static getActiveScene() {
        return SceneManager.scenes[SceneManager.currentSceneIndex]
    }

    static getPreviousScene() {
        if (SceneManager.previousSceneIndex == -1) return
        return SceneManager.scenes[SceneManager.previousSceneIndex]
    }

    static changeScene(index) {
        SceneManager.previousSceneIndex = SceneManager.currentSceneIndex
        SceneManager.currentSceneIndex = index
        SceneManager.changedSceneFlag = true
    }
}

window.SceneManager = SceneManager
