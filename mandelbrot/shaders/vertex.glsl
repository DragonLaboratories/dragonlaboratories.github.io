precision highp float;

uniform float yscale;
attribute vec2 pos;
varying vec2 vu;

void main() {
    gl_Position = vec4(pos, 0.0, 1.0);
    vu = vec2(pos.x, pos.y * yscale);
}