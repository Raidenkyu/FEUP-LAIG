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
        this.currentDistance = 0;
        this.speed = this.totalD/this.time;
        this.rotationAngle = 0;
        this.elapsedTime = 0;
        this.currentDistance = 0;

    }

    /**
     * updates the actual position of the animation
     */
    update(deltaTime){

        this.elapsedTime += deltaTime;
        this.currentDistance = this.speed * this.elapsedTime;
        var i = 0;
        while(i < this.arrayDist.length && this.currentDistance > this.arrayDist[i]){
            this.currentDistance -= this.arrayDist[i];
            i++
        }
        this.index = i % this.vectors.length;
        let vectorLength = vec3.length(this.vectors[this.index],[0,0,0]);
        let cosAngle = vec3.dot(this.vectors[this.index], [0,0,1])/vectorLength;
        this.rotationAngle = Math.acos(cosAngle);
        console.log(this.elapsedTime);
        console.log(this.time);
        if(this.elapsedTime >= this.time){
            this.terminated = true;
            
            return;
        }

    }

    apply(deltaTime){
        var transform = mat4.create();
        mat4.identity(transform);
        var relativeDistance = this.currentDistance/this.arrayDist[this.index];
        var x = (this.controlPoints[this.index][0]-this.controlPoints[0][0]) + this.vectors[this.index][0]*relativeDistance;
        var y = (this.controlPoints[this.index][1]-this.controlPoints[0][1]) + this.vectors[this.index][1]*relativeDistance;
        var z = (this.controlPoints[this.index][2]-this.controlPoints[0][2]) + this.vectors[this.index][2]*relativeDistance;
        mat4.translate(transform,transform,[x,y,z]);
        mat4.rotate(transform,transform,this.rotationAngle,[0,1,0]);
        return transform;

    }
}