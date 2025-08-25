import { useEffect, useRef } from "react";

export default function Step1_Basics() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // لون الخلفية (اختياري)
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ارسم مستطيل أحمر
    ctx.fillStyle = "tomato";
    ctx.fillRect(50, 50, 120, 80);

    // ارسم خط أسود
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(450, 250);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, []);

  return <canvas ref={canvasRef} width={500} height={300} style={{ border: "1px solid #ccc" }} />;
}
