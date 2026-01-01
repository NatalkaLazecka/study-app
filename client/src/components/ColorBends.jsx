import { useEffect, useRef } from "react";

export default function ColorBends({
  colors = ["#643762", "#FF9FFC", "#561f48"],
  speed = 0.002,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.max(canvas.width, canvas.height) * 0.8;

      const grad = ctx.createRadialGradient(
        cx + Math.sin(t) * 150,
        cy + Math.cos(t * 0.8) * 150,
        100,
        cx,
        cy,
        r
      );

      grad.addColorStop(0, colors[1]);
      grad.addColorStop(0.5, colors[0]);
      grad.addColorStop(1, colors[2]);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      t += speed;
      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resize);
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
