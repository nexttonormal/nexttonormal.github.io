// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// 1대1 고정
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
}

// Set canvas sive: 500으로 수정
canvas.width = 500;
canvas.height = 500;

// Initialize WebGL settings: viewport
gl.viewport(0, 0, canvas.width, canvas.height);

// Start rendering
render();

// Render loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.SCISSOR_TEST);
    
    const halfWidth = canvas.width / 2;
    const halfHeight = canvas.height / 2;
    
    // Top-left (red)
    gl.scissor(0, halfHeight, halfWidth, halfHeight);
    gl.clearColor(1.0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Top-right (green)
    gl.scissor(halfWidth, halfHeight, halfWidth, halfHeight);
    gl.clearColor(0, 1.0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Bottom-left (Blue)
    gl.scissor(0, 0, halfWidth, halfHeight);
    gl.clearColor(0, 0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Bottom-right (Yellow)
    gl.scissor(halfWidth, 0, halfWidth, halfHeight);
    gl.clearColor(1.0, 1.0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.disable(gl.SCISSOR_TEST);
}

// Resize event listener
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerWidth / 2;
    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
});