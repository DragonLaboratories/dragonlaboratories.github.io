import * as utils from './utils.js';

let PAGE_UP_PRESSED = false;
let PAGE_DOWN_PRESSED = false;
let KEY_UP_PRESSED = false;
let KEY_DOWN_PRESSED = false;
let KEY_LEFT_PRESSED = false;
let KEY_RIGHT_PRESSED = false;
document.onkeydown = (e) => {
    if (e.key == 'PageUp') { PAGE_UP_PRESSED = true; }
    else if (e.key == 'PageDown') { PAGE_DOWN_PRESSED = true; }
    else if (e.key == 'ArrowUp') { KEY_UP_PRESSED = true; }
    else if (e.key == 'ArrowDown') { KEY_DOWN_PRESSED = true; }
    else if (e.key == 'ArrowLeft') { KEY_LEFT_PRESSED = true; }
    else if (e.key == 'ArrowRight') { KEY_RIGHT_PRESSED = true; }
}
document.onkeyup = (e) => {
    if (e.key == 'PageUp') { PAGE_UP_PRESSED = false; }
    else if (e.key == 'PageDown') { PAGE_DOWN_PRESSED = false; }
    else if (e.key == 'ArrowUp') { KEY_UP_PRESSED = false; }
    else if (e.key == 'ArrowDown') { KEY_DOWN_PRESSED = false; }
    else if (e.key == 'ArrowLeft') { KEY_LEFT_PRESSED = false; }
    else if (e.key == 'ArrowRight') { KEY_RIGHT_PRESSED = false; }
}

async function main() {
    // Load WebGL context
    let vp = document.getElementById('viewport');
    let gl = vp.getContext('webgl');

    // Download and compile shaders
    let shader = gl.createProgram();
    let vs = gl.createShader(gl.VERTEX_SHADER);
    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, await utils.download('shaders/vertex.glsl'))
    gl.shaderSource(fs, await utils.download('shaders/fragment.glsl'))
    gl.compileShader(vs);
    gl.compileShader(fs);
    console.log(gl.getShaderInfoLog(vs))
    console.log(gl.getShaderInfoLog(fs))
    gl.attachShader(shader, vs);
    gl.attachShader(shader, fs);
    gl.linkProgram(shader);

    // Allocate and fill vertex buffer
    let VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0,  -1.0
    ]), gl.STATIC_DRAW);
    let posAttr = gl.getAttribLocation(shader, 'pos');
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 2*4, 0);
    gl.enableVertexAttribArray(posAttr);

    // Load colormap texture
    gl.activeTexture(gl.TEXTURE0);
    let colormapTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colormapTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([
        0x00, 0x00, 0x20, 0xFF,
        0x00, 0x00, 0x30, 0xFF,
        0x00, 0x00, 0x50, 0xFF,
        0x00, 0x00, 0x91, 0xFF,
        0x1E, 0x90, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0x00, 0xFF,
        0xFE, 0x6D, 0x16, 0xFF,
        0xFE, 0x6D, 0x16, 0xFF,
        0xFF, 0x00, 0x00, 0xFF,
        0xFF, 0x00, 0x00, 0xFF,
        0xC6, 0x00, 0x00, 0xFF,
        0x9F, 0x00, 0x00, 0xFF,
        0x75, 0x00, 0x00, 0xFF,
        0x4A, 0x00, 0x00, 0xFF,
        0x4A, 0x00, 0x00, 0xFF
    ]))
    gl.generateMipmap(gl.TEXTURE_2D);

    // Get uniforms
    let yscaleUnif = gl.getUniformLocation(shader, 'yscale');
    let zoomUnif = gl.getUniformLocation(shader, 'zoom');
    let offsetUnif = gl.getUniformLocation(shader, 'offset');
    let colormapUnif = gl.getUniformLocation(shader, 'colorMap');

    // Variables
    let yscale = vp.offsetHeight / vp.offsetWidth;
    let zoom = 2.5;
    let ox = -0.5, oy = 0.0;

    // Main loop
    setInterval(() => {
        // Clear buffer
        vp.width = window.innerWidth;
        vp.height = window.innerHeight;
        yscale = vp.offsetHeight / vp.offsetWidth;
        gl.viewport(0, 0, vp.offsetWidth, vp.offsetHeight);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Enable texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, colormapTex);

        // Activate shader
        gl.useProgram(shader);

        // Update and set uniforms
        if (PAGE_UP_PRESSED) { zoom *= 1.02; }
        if (PAGE_DOWN_PRESSED) { zoom *= 0.98; }
        if (KEY_UP_PRESSED) { oy += 0.01 * zoom; }
        if (KEY_DOWN_PRESSED) { oy -= 0.01 * zoom; }
        if (KEY_LEFT_PRESSED) { ox -= 0.01 * zoom; }
        if (KEY_RIGHT_PRESSED) { ox += 0.01 * zoom; }
        gl.uniform1f(yscaleUnif, yscale);
        gl.uniform1f(zoomUnif, zoom);
        gl.uniform2f(offsetUnif, ox, oy);
        gl.uniform1i(colormapUnif, 0);

        // Draw vertices
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }, 15);
}

main();

