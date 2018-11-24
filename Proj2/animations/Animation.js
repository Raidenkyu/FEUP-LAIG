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

    update(deltaTime){}

    apply(){}

}