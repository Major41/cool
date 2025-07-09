// components/AdPlaceholder.jsx
"use client"; // optional, only needed if you use client-side logic

export default function AdPlaceholder({
  id,
  width = "100%",
  height = "250px",
  label = "Ad Space",
}) {
  return (
    <div
      id={id}
      className="flex items-center justify-center border border-dashed border-gray-300 bg-gray-100 text-gray-400 text-sm"
      style={{ width, height }}
    >
      {label}
    </div>
  );
}
