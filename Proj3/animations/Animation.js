/**
 * Animation class, representing an animation.
 */
class Animation {

    /**
     * @constructor
     */
    constructor(id, span) {
        this.animationId = id;
        this.time = span;
        this.terminated = false;
    }

    /**
     * Updates the animation with the given time span.
     * @param {Number} deltaTime 
     */
    update(deltaTime){}

    /**
     * Returns the transformation matrix resultant from the animation
     */
    apply(){}

}