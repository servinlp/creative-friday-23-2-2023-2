precision mediump float;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vEyeVector;

uniform vec2 uResolution;
uniform sampler2D uTexture;

// uniform float uIorR;
// uniform float uIorG;
// uniform float uIorB;
uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;

uniform int uLoop;

uniform float uRefractPower;
uniform float uChromaticAberration;
uniform float uSaturation;

vec3 sat(vec3 rgb, float intensity) {
    vec3 L = vec3(0.2125, 0.7154, 0.0721);
    vec3 grayscale = vec3(dot(rgb, L));
    return mix(grayscale, rgb, intensity);
}

void main () {
    // float iorRatio = 1.0/1.11;
    float iorRatioX = 1.0/uIorR; //1.1;
    float iorRatioY = 1.0/uIorG; //1.09;
    float iorRatioZ = 1.0/uIorB; //1.08;
    vec3 normal = vWorldNormal;
    // vec3 refractVec = refract(vEyeVector, normal, iorRatio);
    // vec3 refractVecX = refract(vEyeVector, normal, iorRatioX);
    // vec3 refractVecY = refract(vEyeVector, normal, iorRatioY);
    // vec3 refractVecZ = refract(vEyeVector, normal, iorRatioZ);

    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    // vec4 color = texture2D(uTexture, uv + refractVec.xy);
    // float r = texture2D(uTexture, uv + refractVecX.xy).r;
    // float g = texture2D(uTexture, uv + refractVecY.xy).g;
    // float b = texture2D(uTexture, uv + refractVecZ.xy).b;

    vec3 color = vec3(1.0);

    for ( int i = 0; i < uLoop; i ++ ) {
        float slide = float(i) / float(uLoop) * 0.1;

        // vec3 refractVecR = refract(vEyeVector, normal, iorRatioX);
        // vec3 refractVecG = refract(vEyeVector, normal, iorRatioY);
        // vec3 refractVecB = refract(vEyeVector, normal, iorRatioZ);

        // color.r += texture2D(uTexture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).r;
        // color.g += texture2D(uTexture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).g;
        // color.b += texture2D(uTexture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).b;

        vec3 refractVecR = refract(vEyeVector, normal,(1.0/uIorR));
        vec3 refractVecY = refract(vEyeVector, normal, (1.0/uIorY));
        vec3 refractVecG = refract(vEyeVector, normal, (1.0/uIorG));
        vec3 refractVecC = refract(vEyeVector, normal, (1.0/uIorC));
        vec3 refractVecB = refract(vEyeVector, normal, (1.0/uIorB));
        vec3 refractVecP = refract(vEyeVector, normal, (1.0/uIorP));

        float r = texture2D(uTexture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 0.5;

        float y = (texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
                    texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
                    texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z) / 6.0;

        float g = texture2D(uTexture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).y * 0.5;

        float c = (texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
                    texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
                    texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
            
        float b = texture2D(uTexture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).z * 0.5;

        float p = (texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
                    texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
                    texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

        float R = r + (2.0*p + 2.0*y - c)/3.0;
        float G = g + (2.0*y + 2.0*c - p)/3.0;
        float B = b + (2.0*c + 2.0*p - y)/3.0;

        color.r += R;
        color.g += G;
        color.b += B;
        
        color = sat(color, uSaturation);
    }

    color /= float(uLoop);
    // vec4 color = vec4(r, g, b, 1.0);
    // vec4 color = texture2D(uTexture, uv + vec2(refractVecX, refractVecY));
    
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    gl_FragColor = vec4(color, 1.0);
}