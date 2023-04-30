/**
 * The time class
 * Make static calls to this class to get timing information
 */
class Time {
    /** The time in seconds between frames */
    static deltaTime = 1 / 60

    /** The time in seconds since the first frame */
    static time = 0

    /** The number of frames since the game started */
    static frameCount = 0

    /**
     * Update the dynamic time values
     */
    static update() {
        Time.time += Time.deltaTime
        Time.frameCount++
    }
}

window.Time = Time
export default Time
