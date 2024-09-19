import * as THREE from 'three';
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Plane, useCamera, useScroll, useTexture } from '@react-three/drei';

import { useFrame, useThree, extend } from '@react-three/fiber';
import { FretBoard } from './fretboard';
import { Lesson, Module } from '@prisma/client';
import { FinalScene } from './finish-scene';
import ModulePath, { ModuleButtonDisplay } from './module-path';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { LessonButton, ModulePosition } from './course.types';
import ModuleAwards from './module-awards';
gsap.registerPlugin(ScrollTrigger);
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
gsap.registerPlugin(useGSAP);

gsap.registerPlugin(ScrollToPlugin);

type LessonType = Lesson & { category: { name: string } };
type ModuleSection = Module & { lessons: LessonType[] };

interface LandscapeProps {
  rotation?: [number, number, number];
  position?: [number, number, number];
  modules: ModuleSection[];
  lessonSpacing: number;
  onOpenLesson?: (lesson: LessonButton) => void;
  onReady?: (ready: boolean) => void;
  container?: MutableRefObject<HTMLElement | null>;
}

const SCROLL_FACTOR = 50;

export const Landscape = ({
  modules,
  lessonSpacing,
  rotation,
  position,
  onReady,
  container,
  onOpenLesson,
  ...rest
}: LandscapeProps) => {
  const [pathLength, setPathLength] = useState<number | null>(null);
  const [modulePosition, setModulePosition] = useState<ModulePosition[] | []>([]);
  const [currentLesson, setCurrentLesson] = useState<number>(0);

  const guitar = useTexture('/images/course/guitar.png');
  const midGround = useTexture('/images/course/lessons-mid.webp');
  const foreGround = useTexture('/images/course/lessons-fore.webp');
  const ref = React.useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const lessonNumber = useMemo(() => {
    console.log('LANDSCAPE MODULES: lessonNumber');
    return modules.reduce((acc, item) => acc + item.lessons.length, 0);
  }, modules);

  const { contextSafe } = useGSAP(
    () => {
      if (!container?.current) {
        return;
      }

      if (pathLength === null) {
        return;
      }

      if (!camera.current) {
        return;
      }

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      console.log('LANDSCAPE MODULES: SCROLLTRIGGER');

      const tl = gsap.timeline();
      //const zoomTl = gsap.timeline();

      tl.to(camera.current.position, {
        z: 70,
        y: 20,
        duration: 0.2,
        ease: 'none',
      });

      tl.to(camera.current.position, {
        y: pathLength,
        duration: 1,
        ease: 'none',
      });

      scrollTriggerRef.current = ScrollTrigger.create({
        animation: tl,
        trigger: container.current,
        pin: true,
        scrub: 1,
        end: `+=${pathLength * SCROLL_FACTOR} `,
      });

      if (typeof window !== 'undefined') {
        gsap.to(window, {
          duration: 3,
          scrollTo: { y: (currentLesson + 10) * SCROLL_FACTOR },
          delay: 3,
          ease: 'Power2.inOut',
        });
      }

      return () => {
        ScrollTrigger.killAll();
      };
    },
    { scope: container, dependencies: [pathLength, currentLesson, camera] },
  );

  const handleUpdate = (data: ModuleButtonDisplay) => {
    if (!data.pathLength) {
      return;
    }

    if (!pathLength) {
      console.log('LANDSCAPE MODULES: handleUpdate', data);
      setPathLength(data?.pathLength);
      setCurrentLesson(data.buttons[data.next || 0].position.y);
      setModulePosition(data.modulePosition);
      onReady && onReady(true);
    }
  };

  const handleOnLesson = contextSafe((lesson: LessonButton) => {
    if (!camera.current) {
      return;
    }

    console.log('LANDSCAPE MODULES: handleOnLesson');
    gsap.to(camera.current?.position, { z: 100, duration: 1, ease: 'power2.in' });
    onOpenLesson && onOpenLesson(lesson);
  });

  const handleOnBackToCurrentLesson = contextSafe(() => {
    console.log('LANDSCAPE MODULES: handleOnBackToCurrentLesson');
    if (typeof window !== 'undefined') {
      gsap.to(window, {
        duration: 3,
        scrollTo: { y: (currentLesson + 10) * SCROLL_FACTOR },
        ease: 'Power2.inOut',
      });
    }
  });

  useFrame((state, delta) => {
    const { pointer } = state;
    // Rotate the camera around its own center based on pointer movement
    const rotationSpeed = 0.01; // Adjust this for sensitivity
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, pointer.x * rotationSpeed, 0.1); // Left/right rotation
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, pointer.y * rotationSpeed, 0.1); // Up/down rotation

    // Ensure you don't rotate too far (optional, to avoid flipping the camera)
    state.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, state.camera.rotation.x)); // Clamp x-axis rotation to avoid flipping

    if (!camera.current) {
      console.log('LANDSCAPE MODULES: CAMERA NOT SET');
      camera.current = state.camera as THREE.PerspectiveCamera;
    }
  });

  console.log('LANDSCAPE MODULES: RENDER');

  return (
    <>
      <group ref={ref} position={position} rotation={rotation} {...rest}>
        <Plane args={[20, 17]} position={[0, 3, -25.1]} scale={2} rotation={[0, 0, 0]} receiveShadow>
          <meshPhongMaterial map={guitar} transparent={true} side={THREE.DoubleSide} />
        </Plane>
        <Plane args={[17, 10]} position={[0, 0, 0]} scale={4} rotation={[0, 0, 0]}>
          <meshStandardMaterial map={midGround} transparent={true} metalness={0.4} />
        </Plane>
        <Plane args={[17, 10]} position={[0, 2, 10]} scale={4} rotation={[0, 0, 0]}>
          <meshStandardMaterial map={foreGround} transparent={true} metalness={0.4} />
        </Plane>

        {pathLength && (
          <>
            <FretBoard
              position={[0, 0, 0]}
              lessonSpacing={lessonSpacing}
              lessonNumber={lessonNumber}
              pathLength={pathLength}
            />

            <FinalScene pathLength={pathLength} />

            <ModuleAwards modulePosition={modulePosition} pathLength={new THREE.Vector3(0, pathLength, 0)} />
          </>
        )}

        <ModulePath
          modulesSection={modules}
          lessonSpacing={lessonSpacing}
          onBackToCurrentLesson={handleOnBackToCurrentLesson}
          onOpenLesson={(lesson: LessonButton) => handleOnLesson(lesson)}
          onUpdated={data => handleUpdate(data)}
        />
      </group>
    </>
  );
};
