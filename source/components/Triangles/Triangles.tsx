import styled from '@emotion/styled';
import { ReactElement, useEffect, useRef } from 'react';
import { TriangleGrid } from './TriangleGrid';

const Canvas = styled.canvas({
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: -1,
});

export const Triangles = (): ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      new TriangleGrid({
        backgroundColor: 0x21_21_21,
        resizeTo: window.document.body,
        size: 40,
        view: canvas.current,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });
    }
  }, []);

  return <Canvas ref={canvas} />;
};

// eslint-disable-next-line import/no-default-export
export default Triangles;
