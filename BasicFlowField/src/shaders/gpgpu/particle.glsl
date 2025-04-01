#include ../includes/simplexNoise4d.glsl

uniform float uTime;
uniform sampler2D uBase;
uniform float uDeltaTime;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

void main() {
    float time = uTime * 0.2;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particles = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);

    if (particles.a >= 1.0) {
        particles.a = mod(particles.a, 1.0);
        particles.xyz = base.xyz;
    }
    else {
        float influence = (uFlowFieldInfluence - 0.5) * (-2.0);
        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time+1.0));
        strength = smoothstep(influence, 1.0, strength);
        vec3 flowField = vec3(
            simplexNoise4d(vec4(particles.xyz * uFlowFieldFrequency + 0.0, time)),
            simplexNoise4d(vec4(particles.xyz * uFlowFieldFrequency + 1.0, time)),
            simplexNoise4d(vec4(particles.xyz * uFlowFieldFrequency + 2.0, time))
        );

        flowField = normalize(flowField);
        particles.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;

        particles.a += uDeltaTime * 0.3;
    }

    gl_FragColor = particles;
}