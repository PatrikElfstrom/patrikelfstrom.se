import { ReactElement, useEffect, useRef } from 'react';
import { TriangleGrid } from './triangleGrid';
import './style.css';

export default function Triangles(): ReactElement {
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
  }, [canvas]);

  return <canvas className="canvas" ref={canvas} />;
}
