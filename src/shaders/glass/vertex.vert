varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vEyeVector;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix* vec4(position, 1.0);
    vUv = uv;

    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vEyeVector = normalize(worldPos.xyz - cameraPosition);

    vec3 transformedNormal = normalMatrix * normal;
    vWorldNormal = normalize(transformedNormal);
}