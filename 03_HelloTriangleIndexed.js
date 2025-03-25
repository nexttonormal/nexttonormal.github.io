// ✅ 1. HTML 파일: index.html
// 캔버스 생성과 안내 문구 포함
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Red Square Movement</title>
  <style>
    canvas {
      display: block;
      margin: 0 auto;
      background-color: #eee;
    }
    #message {
      text-align: center;
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <canvas id="glcanvas" width="600" height="600"></canvas>
  <div id="message">Use arrow keys to move the rectangle</div>
  <script type="module" src="main.js"></script>
</body>
</html>
*/

// ✅ 2. Vertex Shader: vertex.glsl
/*
#version 300 es
in vec2 a_position;
uniform vec2 u_offset;
void main() {
    gl_Position = vec4(a_position + u_offset, 0.0, 1.0);
}
*/

// ✅ 3. Fragment Shader: fragment.glsl
/*
#version 300 es
precision mediump float;
out vec4 fragColor;
void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
*/

// ✅ 4. main.js (자바스크립트): 힌트를 반영하여 개선
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
  alert('WebGL 2.0 not supported');
}

canvas.width = 600;
canvas.height = 600;

let offset = [0, 0];
const squareSize = 0.2;
const moveStep = 0.01;

function resizeAspectRatio() {
  const aspect = 1;
  let width = window.innerWidth;
  let height = window.innerHeight;

  if (width / height > aspect) {
    width = height * aspect;
  } else {
    height = width / aspect;
  }
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
}

window.addEventListener('resize', resizeAspectRatio);

async function loadShaderSource(url) {
  const response = await fetch(url);
  return response.text();
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

async function main() {
  resizeAspectRatio();
  const vsSource = await loadShaderSource('vertex.glsl');
  const fsSource = await loadShaderSource('fragment.glsl');
  const program = createProgram(gl, vsSource, fsSource);
  gl.useProgram(program);

  const aPositionLoc = gl.getAttribLocation(program, 'a_position');
  const uOffsetLoc = gl.getUniformLocation(program, 'u_offset');

  const half = squareSize / 2;
  const vertices = new Float32Array([
    0, 0,
    -half, -half,
    -half, half,
    half, half,
    half, -half
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(aPositionLoc);
  gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.clearColor(1, 1, 1, 1);

  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2fv(uOffsetLoc, offset);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
  }

  const keys = {
    ArrowLeft: true,
    ArrowRight: true,
    ArrowUp: true,
    ArrowDown: true
  };

  window.addEventListener('keydown', (event) => {
    if (event.key in keys) {
      const limit = 1.0 - squareSize / 2;
      switch (event.key) {
        case 'ArrowLeft':
          if (offset[0] - moveStep >= -limit) offset[0] -= moveStep;
          break;
        case 'ArrowRight':
          if (offset[0] + moveStep <= limit) offset[0] += moveStep;
          break;
        case 'ArrowUp':
          if (offset[1] + moveStep <= limit) offset[1] += moveStep;
          break;
        case 'ArrowDown':
          if (offset[1] - moveStep >= -limit) offset[1] -= moveStep;
          break;
      }
      draw();
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key in keys) {
      // 키를 뗐을 때도 필요한 처리를 여기에 추가할 수 있음 (예: 상태 초기화 등)
    }
  });

  draw();
}

main();
