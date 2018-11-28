#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler1; // water texture
uniform sampler2D uSampler2; // water heightmap
uniform float timeFactor; // time factor used for animating the water
uniform float texScale; // texture scale

/**
* Main function, displays the texture of water that changes with time
*/
void main() {

	vec2 coords = vec2(vTextureCoord.st);

	gl_FragColor = texture2D(uSampler1, texScale*(coords + (timeFactor)));
}
