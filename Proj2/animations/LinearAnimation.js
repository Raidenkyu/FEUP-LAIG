/**
 * LinearAnimation class, representing a linear animation.
 */
class LinearAnimation extends Animation {
    /**
     * @constructor
     */
    constructor(animationId, time,controlPoints) {
        super(animationId,time);
        this.controlPoints = controlPoints;
        this.index = 0;
        this.dist = 0;
        this.initAnimation();

        
    }

    initAnimation(){
        var totalD = 0;
        this.vectors = [];
        this.arrayDist = [];
        for(var i = 0; i < this.controlPoints.length - 1 ;i++){
            var aux = Math.sqrt(Math.pow(this.controlPoints[i+1][0] - this.controlPoints[i][0],2) + 
                        Math.pow(this.controlPoints[i+1][1] - this.controlPoints[i][1],2) + 
                        Math.pow(this.controlPoints[i+1][2] - this.controlPoints[i][2],2));
            this.vectors.push([this.controlPoints[i+1][0] - this.controlPoints[i][0],
                            this.controlPoints[i+1][1] - this.controlPoints[i][1],
                            this.controlPoints[i+1][2] - this.controlPoints[i][2]]);
            this.arrayDist.push(aux);
            totalD += aux;                
        }
        this.totalD = totalD;
        this.speed = this.totalD/this.time;
        this.rotationAngle = 0;
        this.elapsedTime = 0;

    }

    /**
     * updates the actual position of the animation
     */
    update(deltaTime){
        var deltaD = (this.totalD * deltaTime)/this.time;
        this.dist += deltaD;
        if(this.dist > this.arrayDist[this.index]){
            this.index++;
            if(this.index >= this.vectors.length){
                this.terminated = true;
                return;
            }
            this.dist = 0;
            this.rotationAngle = vec3.angle(this.vectors[this.index],[0,1,0]);
        }


    }

    apply(deltaTime){
        var transform = mat4.create();
        mat4.identity(transform);
        var x = (this.vectors[this.index][0]/this.arrayDist[this.index])*this.speed*deltaTime;
        var y = (this.vectors[this.index][1]/this.arrayDist[this.index])*this.speed*deltaTime;
        var z = (this.vectors[this.index][2]/this.arrayDist[this.index])*this.speed*deltaTime;
        mat4.translate(transform,transform,[x,y,z]);
        return transform;
    }
}