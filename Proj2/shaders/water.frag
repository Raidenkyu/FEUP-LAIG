#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {

	vec2 coords = vec2(vTextureCoord.st);

	gl_FragColor = texture2D(uSampler1, coords + (timeFactor+1.0));
}
