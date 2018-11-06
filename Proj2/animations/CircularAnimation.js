/**
 * LinearAnimation class, representing a linear animation.
 */
class LinearAnimation extends Animation {
    /**
     * @constructor
     */
    constructor(animationId, time, center,radius,startang,rotang) {
        super(animationId,time);
        this.center = center;
        this.radius = radius;
        this.startang = startang;
        this.rotang = rotang;

        
    }

    initAnimation(){


    }

    /**
     * updates the actual position of the animation
     */
    update(deltaTime){


    }

    getMatrix(deltaTime){

    }

    apply(){}
}