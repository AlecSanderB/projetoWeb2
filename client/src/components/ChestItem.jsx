import React, { useRef } from "react";

export default function ChestItem({ chest, darkMode, selectChest, editingId }) {
  const clickTimer = useRef(null);

  const handleClick = () => {
    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      selectChest(chest);
      clickTimer.current = null;
    }, 200);
  };

  const isEditing = editingId?.type === "chest" && editingId.id === chest.id;

  const textStyle = {
    flex: 1,
    cursor: "pointer",
    color: darkMode ? "#fff" : "#000",
    backgroundColor: isEditing ? (darkMode ? "#444" : "#ddd") : "transparent",
  };


  return (
    <div style={{ display: "flex", alignItems: "center", userSelect: "none" }}>
      <span style={{ display: "inline-block", width: "24px" }} />
      <span onClick={handleClick} style={textStyle}>
        📦 {chest.amount != null ? `(${chest.amount}) ` : ""}{chest.item_name || "<unnamed>"}
      </span>
    </div>
  );
}