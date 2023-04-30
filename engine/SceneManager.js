/**
 * The container for scenes.
 * All functions and member variables on this class are static.
 * See https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.html
 * 
 * For more information on static see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
 */

class SceneManager {
    /** 
     * The list of all scenes in the game. The scene at index 0
     * is assumed to be the first scene
     */
    static scenes = []


    /** The index of the current scene. */
    static currentSceneIndex = 0

    /** Track whether we change scenes during the previous frame */
    static changedSceneFlag = true

    /** Track the previous scene to preserve some game objects */
    static previousSceneIndex = -1

    /**
     * Start a game with the given scenes and title
     * 
     * @param {SceneArray} scenes The array of scenes to add.
     * @param {String} title The title of the game
     */
    static startScenes(scenes, title){
        SceneManager.setScenes(scenes)
        start(title)
    }

    /**
     * Start testing a game with the given scenes, name, and options
     * For test options, see engine.js/start
     * 
     * @param {SceneArray} scenes The array of scenes to add
     * @param {String} title The title of the game
     * @param {Object} options the options object
     */
    static testScenes(scenes, title, options){
        SceneManager.setScenes(scenes)
        test(title, options)
    }

    /**
     * Replace the scenes in a game with the new scene
     * @param {SceneArray} scenes The array of scenes to add
     */
    static setScenes(scenes){
        //Same as addScenes, but we clear any scenes first
        SceneManager.currentSceneIndex = 0;
        SceneManager.changedScene = true;
        SceneManager.scenes = []
        SceneManager.addScenes(scenes);
    }

    /**
     * Add the array of scenes to the current array of scenes
     * @param {SceneArray} scenes The array of scenes to add
     */
    static addScenes(scenes){
        for(let scene of scenes){
            SceneManager.addScene(scene);
        }
    }

    /**
     * Add one scene to the array of scenes
     * @param {Scene} scene The scene to add to the game
     */
    static addScene(scene) {
        SceneManager.scenes.push(scene)
    }

    /**
     * Get the current scene
     * See https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.GetActiveScene.html
     * 
     * @returns The current scene
     */
    static getActiveScene() {
        return SceneManager.scenes[SceneManager.currentSceneIndex];
    }

    static getPreviousScene() {
        if(SceneManager.previousSceneIndex == -1)
            return
        return SceneManager.scenes[SceneManager.previousSceneIndex];
    }

    /**
     * Change the current scene to the specified index.
     * @param {Integer} index Change the scene to the one at the given index.
     */
    static changeScene(index) {
        SceneManager.previousSceneIndex = SceneManager.currentSceneIndex;
        SceneManager.currentSceneIndex = index
        SceneManager.changedSceneFlag = true
    }
}

window.SceneManager = SceneManager;
