uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;
attribute vec2 aParticlesUv;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;

void main() {
    vec4 particles = texture(uParticlesTexture, aParticlesUv);

    vec4 modelPosition = modelMatrix * vec4(particles.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point Size
    float sizeIn = smoothstep(0.0, 0.1, particles.a);
    float sizeout = 1.0 - smoothstep(0.7, 1.0, particles.a);
    float size = min(sizeIn, sizeout);

    gl_PointSize = size * aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = aColor;
}