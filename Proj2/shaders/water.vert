attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform float timeFactor;

uniform float normScale; //the height scale
uniform float texScale; // the texture scale

/**
 * Sets the value of the y coordinate, according to the given values of timeFactor 
 * which updates the color of the height texture.
 */


/**
* Main function, updates the y coordinate of water based on the corresponding heightmap
*/
void main() {

 	vTextureCoord = aTextureCoord;

	vec3 colorArray = texture2D(uSampler2, vec2(0.0,0.0) + mod(vTextureCoord*texScale + timeFactor, 1.0)).rgb;

	float avgColor = (colorArray[0] + colorArray[1] + colorArray[2]) / 3.0;

	vec3 newPos = aVertexPosition;

	newPos.y = normScale * avgColor * 0.5;

	gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);
	

}

