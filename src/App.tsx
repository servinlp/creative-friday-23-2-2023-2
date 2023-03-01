import { Canvas } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei'
import { Dispersion } from "./Dispersion"

const App = () => {
  return (
    <div style={{
      height: "100vh"
    }}>
      <Canvas camera={{ position: [-3, 0, 6] }} dpr={[1, 2]}>
        {/* <mesh>
          <boxGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh> */}
        <Dispersion />
        {/* <axesHelper args={[5]} /> */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App