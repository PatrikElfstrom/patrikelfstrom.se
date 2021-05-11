import React, { useRef, useEffect } from 'react';
import Triangles from '../lib/Triangles';

const TriangleBackground = () => {
  const canvas = useRef(null);

  useEffect(() => {
    const triangles = new Triangles({
      backgroundColor: 0x212121,
      resizeTo: window,
      size: 40,
      view: canvas.current,
    });
  }, []);

  return <canvas ref={canvas}>asd</canvas>;
};

export default TriangleBackground;
