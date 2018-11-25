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

uniform float normScale;

void main() {

	vec3 offset=vec3(0.0, 0.0, 0.0);
	
	vTextureCoord = aTextureCoord;
	
	vec3 colorArray = texture2D(uSampler2, vec2(0.0,0.0) + vTextureCoord + (timeFactor-4.0)).rgb;
	//vec3 colorArray = texture2D(uSampler2, vec2(0.0,0.0) + vTextureCoord).rgb;

	//vec3 colorArray = texture2D(uSampler2, vec2(timeFactor,timeFactor) + vTextureCoord).rgb;

	float avgColor = (colorArray[0] + colorArray[1] + colorArray[2]) / 3.0;

	offset = aVertexNormal * normScale * avgColor * 0.5;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

}

