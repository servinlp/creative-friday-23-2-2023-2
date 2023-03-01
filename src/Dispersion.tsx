import { Stats, useFBO } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { BackSide, FrontSide, Group, IcosahedronGeometry, Mesh, ShaderMaterial, Vector2, Vector3 } from "three";
import vertexGlassShader from './shaders/glass/vertex.vert'
import fragmentGlassShader from './shaders/glass/fragment.frag'
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

export const Dispersion = () => {
  const mesh = useRef<Mesh<IcosahedronGeometry, ShaderMaterial>>(null);
  const backgroundGroup = useRef<Group>(null);
  const mainRenderTarget = useFBO();
  const backRenderTarget = useFBO();
  
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
      },
      uLight: {
        value: null
      },
      uDiffuseness: {
        value: null
      },
      uShininess: {
        value: null
      },
      uFresnelPower: {
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

    gl.setRenderTarget(backRenderTarget);
    // Render the scene into the "back" FBO
    gl.render(scene, camera);

    // Pass the FBO texture to the material
    mesh.current.material.uniforms.uTexture.value = backRenderTarget.texture;
    // Render the backside and display the mesh
    mesh.current.material.side = BackSide;
    mesh.current.visible = true;


    gl.setRenderTarget(mainRenderTarget);
    // Render the scene into the "front" FBO
    gl.render(scene, camera);

    // Pass the texture data to our shader material
    mesh.current.material.uniforms.uTexture.value = mainRenderTarget.texture;
    // Render the frontside
    mesh.current.material.side = FrontSide;

    gl.setRenderTarget(null);
    // // Show the mesh
    // mesh.current.visible = true;
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
      max: 100,
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
    },
    uLight: {
      value: [-2.0, 10.0, 5.0],
      onChange(v) {
        uniforms.uLight.value = v
      }
    },
    uDiffuseness: {
      value: 0.52,
      onChange(v) {
        uniforms.uDiffuseness.value = v
      }
    },
    uShininess: {
      value: 4.2,
      onChange(v) {
        uniforms.uShininess.value = v
      }
    },
    uFresnelPower: {
      value: 16.5,
      onChange(v) {
        uniforms.uFresnelPower.value = v
      }
    },
  })
  
  return (
    <>
      <color attach="background" args={["black"]} />
      {/* <group ref={backgroundGroup}>
        {columns.map((col, i) =>
          rows.map((row, j) => (
            <mesh position={[col, row, -4]} key={`icosahedronGeometry-${(Math.random()) + i * j }`}>
              <icosahedronGeometry args={[0.333, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))
        )}
      </group> */}
    {/* <mesh>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="hotpink" />
    </mesh> */}
    <Stats />
    <hemisphereLight />
    <mesh ref={mesh}>
      <torusGeometry args={[3, 1, 32, 100]} />
      {/* <planeGeometry args={[10, 10]} /> */}
      {/* <icosahedronGeometry args={[2, 20]} /> */}
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
