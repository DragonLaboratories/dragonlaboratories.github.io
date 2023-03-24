precision highp float;

// Config
#define ITER_COUNT  255

// Complex math functions
#define CPLX_MUL(a, b) vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x)
#define CPLX_MODSQ(a) (a.x*a.x + a.y*a.y)

// Arguments
uniform float zoom;
uniform vec2 offset;
varying vec2 vu;

// Colormap
uniform sampler2D colorMap;

void main() {
    vec2 c = vu * zoom + offset;
    vec2 z = vec2(0.0, 0.0);
    int iters = 0;
    for (int i = 0; i < ITER_COUNT; i++) {
        z = CPLX_MUL(z, z) + c;
        if (CPLX_MODSQ(z) > 4.0) break;
        iters++;
    }

    float intense = float(iters)/float(ITER_COUNT);

    gl_FragColor = texture2D(colorMap, vec2(intense, 0.5));
}