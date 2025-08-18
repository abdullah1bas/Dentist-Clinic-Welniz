import { useState } from "react";

export default function AnnotatedImage() {
  const [annotations, setAnnotations] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPos, setCurrentPos] = useState(null);
  const [comment, setComment] = useState("");

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPos({ x, y });
    setDialogOpen(true);
  };

  const handleSave = () => {
    setAnnotations([...annotations, { ...currentPos, comment }]);
    setDialogOpen(false);
    setComment("");
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        src="/public/dental-chart.svg"
        alt="Teeth"
        width={500}
        onClick={handleImageClick}
      />

      {annotations.map((a, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: a.y,
            left: a.x,
            background: "red",
            borderRadius: "50%",
            width: 10,
            height: 10,
            cursor: "pointer",
          }}
          title={a.comment}
        />
      ))}

      {dialogOpen && (
        <div
          style={{
            position: "fixed",
            top: "40%",
            left: "40%",
            background: "white",
            padding: 20,
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          <h4>أضف تعليقك</h4>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
          <button onClick={handleSave}>حفظ</button>
          <button onClick={() => setDialogOpen(false)}>إلغاء</button>
        </div>
      )}
    </div>
  );
}
