uniform float uSize;
uniform float uTime;
attribute float aScale;
attribute vec3 aRandomness;
varying vec3 vColor;


void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Rotate
    // float angle  = atan(modelPosition.x, modelPosition.z);
    // float distanceToCenter = length(modelPosition.xz);
    // float angleOffset = (1.0 / distanceToCenter) * uTime * 0.7;
    // angle += angleOffset;

    // modelPosition.x =distanceToCenter * cos(angle) * sin(angle);
    // modelPosition.z = sin(angle) * tan(angle) * distanceToCenter;
    // modelPosition.y += tan(angle) * 0.5;


    // Swirling Vortex Effect
    float distanceToCenter = length(modelPosition.xz);
    float angle = atan(modelPosition.x, modelPosition.z) + uTime * 0.5;
    float spiralFactor = sin(uTime + distanceToCenter * 5.0) * 0.5;

    modelPosition.x = distanceToCenter * cos(angle + spiralFactor);
    modelPosition.z = distanceToCenter * sin(angle + spiralFactor);
    modelPosition.y += sin(distanceToCenter * 10.0 - uTime) * 0.1;

    // Galactic Whirlpool Effect
    // float distanceToCenter = length(modelPosition.xz);
    // float angle = atan(modelPosition.x, modelPosition.z) + uTime * 0.3;
    // float spiralFactor = sin(uTime * 2.0 + distanceToCenter * 8.0) * 0.3;
    // float pulse = sin(uTime * 5.0 + distanceToCenter * 10.0) * 0.1;

    // modelPosition.x = distanceToCenter * cos(angle + spiralFactor) + pulse;
    // modelPosition.z = distanceToCenter * sin(angle + spiralFactor) + pulse;
    // modelPosition.y += sin(distanceToCenter * 15.0 - uTime * 2.0) * 0.2;

        // Chaotic Cosmic Storm Effect
    // float distanceToCenter = length(modelPosition.xz);
    // float angle = atan(modelPosition.x, modelPosition.z) + uTime * 0.5;
    // float noiseFactor = fract(sin(dot(modelPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);
    // float randomOffset = noiseFactor * 2.0 - 1.0;

    // modelPosition.x += sin(angle * 10.0 + randomOffset) * 0.5;
    // modelPosition.z += cos(angle * 10.0 + randomOffset) * 0.5;
    // modelPosition.y += sin(distanceToCenter * 20.0 + uTime * 3.0) * 0.3;

    // // Add randomness for a more chaotic look
    modelPosition.xyz += aRandomness * 1.2 ;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Dynamic point size based on distance and time
    gl_PointSize = uSize * aScale * (1.0 + sin(uTime + distanceToCenter * 5.0) * 0.5);
    gl_PointSize *= (1.0 / -viewPosition.z);

    // Color shifting effect
    vColor = vec3(0.5 + 0.5 * sin(uTime + distanceToCenter * 3.0),
                  0.5 + 0.5 * sin(uTime + distanceToCenter * 4.0),
                  0.5 + 0.5 * sin(uTime + distanceToCenter * 5.0));

}