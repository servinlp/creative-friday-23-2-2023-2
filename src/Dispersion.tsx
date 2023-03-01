import { Stats, useFBO } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Group, IcosahedronGeometry, Mesh, ShaderMaterial, Vector2 } from "three";
import vertexGlassShader from './shaders/glass/vertex.vert'
import fragmentGlassShader from './shaders/glass/fragment.frag'
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

export const Dispersion = () => {
  const mesh = useRef<Mesh<IcosahedronGeometry, ShaderMaterial>>(null);
  const backgroundGroup = useRef<Group>(null);
  const mainRenderTarget = useFBO();
  
  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: null,
      },
      uResolution: {
        value: new Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
      },
      uIorR: {
        value: null
      },
      uIorY: {
        value: null
      },
      uIorG: {
        value: null
      },
      uIorC: {
        value: null
      },
      uIorB: {
        value: null
      },
      uIorP: {
        value: null
      },
      uLoop: {
        value: null
      },
      uChromaticAberration: {
        value: null
      },
      uRefractPower: {
        value: null
      },
      uSaturation: {
        value: null
      }
    }),
    []
  );

  useFrame((state) => {
    if (!mesh.current) return
    const { gl, scene, camera } = state;
    // Hide the mesh
    mesh.current.visible = false;
    gl.setRenderTarget(mainRenderTarget);
    // Render into the FBO
    gl.render(scene, camera);

    // Pass the texture data to our shader material
    mesh.current.material.uniforms.uTexture.value = mainRenderTarget.texture;

    gl.setRenderTarget(null);
    // Show the mesh
    mesh.current.visible = true;
  });

  const columns = range(-7.5, 7.5, 2.5);
  const rows = range(-7.5, 7.5, 2.5);

  useControls({
    uIorR: {
      value: 1.04,
      min: 0.9,
      max: 2,
      onChange(v) {
        uniforms.uIorR.value = v
      }
    },
    uIorY: {
      value: 1.74,
      min: 0.9,
      max: 2,
      onChange(v) {
        uniforms.uIorY.value = v
      }
    },
    uIorG: {
      value: 1.03,
      min: 0.9,
      max: 2,
      onChange(v) {
        uniforms.uIorG.value = v
      }
    },
    uIorC: {
      value: 1.6,
      min: 0.9,
      max: 2,
      onChange(v) {
        uniforms.uIorC.value = v
      }
    },
    uIorB: {
      value: 1.28,
      min: 0.9,
      max: 2,
      onChange(v) {
        uniforms.uIorB.value = v
      }
    },
    uIorP: {
      value: 1.94,
      min: 0.9,
      max: 2,
      onChange(v) {
        uniforms.uIorP.value = v
      }
    },
    uLoop: {
      value: 23,
      min: 1,
      max: 30,
      step: 1,
      onChange(v) {
        uniforms.uLoop.value = v
      }
    },
    uChromaticAberration: {
      value: 0.62,
      min: 0,
      max: 1.5,
      step: 0.01,
      onChange(v) {
        uniforms.uChromaticAberration.value = v
      }
    },
    uRefractPower: {
      value: 0.25,
      min: 0,
      max: 1,
      step: 0.01,
      onChange(v) {
        uniforms.uRefractPower.value = v
      }
    },
    uSaturation: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
      onChange(v) {
        uniforms.uSaturation.value = v
      }
    }
  })
  
  return (
    <>
    <color attach="background" args={["black"]} />
      <group ref={backgroundGroup}>
        {columns.map((col, i) =>
          rows.map((row, j) => (
            <mesh position={[col, row, -4]} key={`icosahedronGeometry-${(Math.random()) + i * j }`}>
              <icosahedronGeometry args={[0.333, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))
        )}
      </group>
    {/* <mesh>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="hotpink" />
    </mesh> */}
    <Stats />
    <hemisphereLight />
    <mesh ref={mesh}>
      <icosahedronGeometry args={[2, 20]} />
      <shaderMaterial
        vertexShader={vertexGlassShader}
        fragmentShader={fragmentGlassShader}
        uniforms={uniforms}
        />
    </mesh>
        </>
  );
}


  // Range from https://www.joshwcomeau.com/snippets/javascript/range/
  const range = (start:number, end:number, step = 1) => {
    let output = [];
    if (typeof end === "undefined") {
      end = start;
      start = 0;
    }
    for (let i = start; i <= end; i += step) {
      output.push(i);
    }
    return output;
  };
