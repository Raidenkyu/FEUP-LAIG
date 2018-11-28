#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler1; // terrain texture
uniform sampler2D uSampler2; // terrain heightmap

/**
* Main function, displays the texture of terrain
*/
void main() {
	gl_FragColor = texture2D(uSampler1, vTextureCoord);
}
