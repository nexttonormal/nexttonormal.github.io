export function resizeAspectRatio(canvas) {
    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
  }

  import { resizeAspectRatio } from './resize.js';

  const canvas = document.getElementById("glcanvas");
  const gl = canvas.getContext("webgl2");
  
  resizeAspectRatio(canvas);
  
  // 셰이더 파일 읽기
  async function loadShaderSource(url) {
    const res = await fetch(url);
    return await res.text();
  }
  
  async function init() {
    const vsSource = await loadShaderSource('vertex.glsl');
    const fsSource = await loadShaderSource('fragment.glsl');
  
    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    const program = createProgram(vertexShader, fragmentShader);
  
    const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    const uOffsetLoc = gl.getUniformLocation(program, 'uOffset');
  
    // 정사각형 중심 기준 꼭짓점들 (TRIANGLE_FAN 순서)
    const size = 0.1;
    const vertices = new Float32Array([
      -size,  size,
       size,  size,
       size, -size,
      -size, -size
    ]);
  
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
  
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPositionLoc);
  
    let offset = [0, 0];
  
    function render() {
      resizeAspectRatio(canvas); // 비율 유지
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(1.0, 1.0, 1.0, 1.0); // 흰 배경
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2fv(uOffsetLoc, offset);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
  
    window.addEventListener('keydown', (event) => {
      const step = 0.01;
      const limit = 1.0 - size; // canvas 경계 - 사각형 반 너비
  
      if (event.key === 'ArrowUp') {
        if (offset[1] + step <= limit) offset[1] += step;
      } else if (event.key === 'ArrowDown') {
        if (offset[1] - step >= -limit) offset[1] -= step;
      } else if (event.key === 'ArrowLeft') {
        if (offset[0] - step >= -limit) offset[0] -= step;
      } else if (event.key === 'ArrowRight') {
        if (offset[0] + step <= limit) offset[0] += step;
      }
      render();
    });
  
    window.addEventListener('resize', render);
  
    render();
  }
  
  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  
  function createProgram(vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }
  
  init();