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
    }

    update(deltaTime){}

    apply(){}

}