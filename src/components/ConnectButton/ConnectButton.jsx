import './../../App.css';
import './../../index.css';

import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OrbitControls } from '@react-three/drei';
import { motion, MotionConfig, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Gradient } from "./Gradient";

import useMeasure from "react-use-measure";

export const ConnectButton = () => {

    const [isHover, setIsHover] = useState(false);
    const [ref, bounds] = useMeasure({ scroll: false });
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function Scene() {
        const materials = useLoader(MTLLoader, "/fox.mtl");
        const obj = useLoader(OBJLoader, '/fox.obj', (loader) => {
            materials.preload();
            loader.setMaterials(materials);
        })
        return <primitive object={obj} scale={0.01} position={[0, 0, 0]} />
    }
    const resetMousePosition = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // For some reason the elements dont render correrctly if in a different component/
    // function MetamaskFox() { 
    //     return (

    //     )
    // }
    function useSmoothTransform(value, springOptions, transformer) {
        return useSpring(useTransform(value, transformer), springOptions);
    }



    function Camera({ mouseX, mouseY, ...props }) {
        const cameraX = useSmoothTransform(mouseX, spring, (x) => x / 350);
        const cameraY = useSmoothTransform(mouseY, spring, (y) => (-1 * y) / 350);

        const set = useThree(({ set }) => set);
        const camera = useThree(({ camera }) => camera);
        const size = useThree(({ size }) => size);
        const scene = useThree(({ scene }) => scene);
        const cameraRef = useRef();
        console.log(camera)
        useLayoutEffect(() => {
            const { current: cam } = cameraRef;
            if (cam) {
                cam.aspect = size.width / size.height;
                cam.updateProjectionMatrix();
            }
        }, [size, props]);

        useLayoutEffect(() => {
            if (cameraRef.current) {
                const oldCam = camera;
                set(() => ({ camera: cameraRef.current }));
                return () => set(() => ({ camera: oldCam }));
            }
        }, [camera, cameraRef, set]);

        useLayoutEffect(() => {
            console.log(scene.position)
            return cameraX.onChange(() => camera.lookAt(scene.position));
        }, [cameraX]);
        return (
            <>                <motion.perspectiveCamera
                ref={cameraRef}
                fov={90}
                position={[cameraX, cameraY, 0]}
            />
            </>
        );
    }

    return (
        <MotionConfig transition={{
            type: "spring",
            duration: 2,
        }}>
            <motion.button
                whileTap="press"
                initial={false}
                ref={ref}
                animate={isHover ? "hover" : "rest"}
                variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.2 },
                    press: { scale: 1.25 }
                }}
                onHoverStart={() => {
                    resetMousePosition();
                    setIsHover(true);
                }}
                onHoverEnd={() => {
                    resetMousePosition();
                    setIsHover(false);
                }}
                onPointerMove={(e) => {
                    mouseX.set(e.clientX - bounds.x - bounds.width / 2);
                    mouseY.set(e.clientY - bounds.y - bounds.height / 2);
                }}
            >
                <motion.div className='label'>
                    connect
                </motion.div>
                <Gradient isHover={isHover} />
                <MotionConfig transition={{
                    type: "spring",
                    duration: 3.7,
                    bounce: 0.2
                }}>
                    <motion.div
                        className="fox"
                        variants={{
                            rest2: { opacity: 0, scale: 1 },
                            hover2: { opacity: 1, scale: 1.2 },
                        }}
                        animate={isHover === true ? "hover2" : "rest2"}
                        initial={false}
                    >
                        <Canvas>
                            <ambientLight intensity={1} />
                            {/* <Camera mouseX={mouseX} mouseY={mouseY} /> */}
                            <Scene />
                            <OrbitControls />
                            <perspectiveCamera position={[0, 0, 0]}></perspectiveCamera>
                        </Canvas>
                    </motion.div>
                </MotionConfig>
            </motion.button>
        </MotionConfig>
    );
}

const spring = { stiffness: 600, damping: 30 };
