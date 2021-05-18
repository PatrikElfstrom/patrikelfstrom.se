import { ReactElement, useEffect, useRef } from 'react';
import { TriangleGrid } from './TriangleGrid';

export const Triangles = (): ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      new TriangleGrid({
        backgroundColor: 0x21_21_21,
        resizeTo: window.document.body,
        size: 40,
        view: canvas.current,
      });
    }
  }, []);

  return <canvas ref={canvas} />;
};
