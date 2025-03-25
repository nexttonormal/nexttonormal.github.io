#version 300 es
precision mediump float;

in vec2 aPosition;
uniform vec2 uOffset;

void main() {
    gl_Position = vec4(aPosition + uOffset, 0.0, 1.0);
}