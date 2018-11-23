var DEGREE_TO_RAD = Math.PI / 180;

/**
 *  class, representing a circular animation.
 */
class CircularAnimation extends Animation {
    /**
     * @constructor
     */
    constructor(animationId, time, center,radius,startang,rotang) {
        super(animationId,time);
        this.x_center = center[0];
        this.y_center = center[1];
        this.z_center = center[2];
        this.radius = radius;
        this.startang = startang * DEGREE_TO_RAD;
        this.rotang = rotang * DEGREE_TO_RAD;
        this.initAnimation();
    }

    initAnimation(){
    
        if(this.rotang > 0){
            this.direction = 1;
        }
        else{
            this.direction = -1;
        }

        this.elapsedTime = 0; 
        this.elapsedAngle = 0;

    }

    /**
     * updates the actual position of the animation
     */
    update(deltaTime){
        this.elapsedTime += deltaTime;
        this.elapsedAngle = (this.elapsedTime/this.time)*this.rotang;
        

        if(this.direction*this.elapsedAngle >= this.direction*this.rotang){
            this.terminated = true;
        }

        this.elapsedAngle += this.startang;

    }


    apply(deltaTime){
       //console.log(this.elapsedAngle);
        var transform = mat4.create();
        mat4.translate(transform, transform, [this.x_center,this.y_center,this.z_center]);
        mat4.rotate(transform, transform, this.elapsedAngle, [0, 1, 0]);

        mat4.translate(transform,transform,[this.radius,0,0]);

        
        return transform;
    }
}