const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

function drawLines() {
    gl.clearColor(0, 0, 0, 1); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    const lineVertices = [
        // C
        -0.7, 0.5, -0.5, 0.7,
        -0.7, 0.5, -0.7, -0.5,
        -0.7, -0.5, -0.5, -0.7,
        // H
        -0.3, 0.7, -0.3, -0.7,
        -0.1, 0.7, -0.1, -0.7,
        -0.3, 0, -0.1, 0,
        // A
        0.1, -0.7, 0.3, 0.7,
        0.3, 0.7, 0.5, -0.7,
        0.15, 0, 0.45, 0
    ];

    const lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVertices), gl.STATIC_DRAW);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0, 1);
        }
    `);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(0, 1, 1, 1); // Aqua color
        }
    `);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, lineVertices.length / 2);
}

function drawTriangles() {
    gl.clearColor(1, 0, 1, 1); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    const triangleVertices = [
        // C (improved triangular approximation)
        -0.7, 0.5,  -0.5, 0.7,  -0.7, 0.7,
        -0.7, 0.5,  -0.5, 0.7,  -0.5, 0.5,
        -0.7, -0.5, -0.5, -0.7, -0.7, -0.7,
        -0.7, -0.5, -0.5, -0.7, -0.5, -0.5,
        -0.7, 0.5,  -0.7, -0.5, -0.6, 0.5,
        -0.7, -0.5, -0.6, -0.5, -0.6, 0.5,
        // H
        -0.3, 0.7,  -0.3, -0.7, -0.2, 0.7,
        -0.3, -0.7, -0.2, -0.7, -0.2, 0.7,
        -0.1, 0.7,  -0.1, -0.7, -0.2, 0.7,
        -0.1, -0.7, -0.2, -0.7, -0.2, 0.7,
        -0.3, 0.1,  -0.3, -0.1, -0.1, 0.1,
        -0.3, -0.1, -0.1, -0.1, -0.1, 0.1,
        // A
        0.1, -0.7,  0.3, 0.7,   0.5, -0.7,
        0.15, 0,    0.3, 0.35,  0.45, 0,
        0.2, -0.35, 0.3, 0.35,  0.4, -0.35
    ];

    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0, 1);
        }
    `);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(0, 1, 0, 1); // Green color
        }
    `);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length / 2);
}

let isLines = true;

function animate() {
    if (isLines) {
        drawLines();
    } else {
        drawTriangles();
    }
    isLines = !isLines;
    setTimeout(animate, 3000); // Toggle between lines and triangles every 3 seconds
}

animate();
