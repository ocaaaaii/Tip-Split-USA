'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface Props {
  text: string;
  size?: number;
  color?: string;
}

export default function QRCodeCanvas({ text, size = 180, color = '#3D1D0A' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, text, {
      width: size,
      margin: 2,
      color: {
        dark: color,
        light: '#F7EED8',
      },
    }).catch(() => {});
  }, [text, size, color]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-xl"
      style={{ display: 'block' }}
    />
  );
}
