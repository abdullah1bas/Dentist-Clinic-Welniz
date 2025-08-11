export default function Tooth({ number, status, onClick }) {
  const color = status === "missing" ? "red" : status === "filled" ? "orange" : "green";
  return (
    <svg
      width="40"
      height="60"
      className="cursor-pointer"
      onClick={() => onClick(number)}
    >
      <rect width="30" height="50" x="5" y="5" fill={color} stroke="black" rx="5" />
      <text x="20" y="55" fontSize="10" textAnchor="middle">{number}</text>
    </svg>
  );
}
