import React from "react";

export default function ChestItem({ chest, darkMode, selectChest, editingId }) {
  const isEditing = editingId?.type === "chest" && editingId.id === chest.id;

  const handleClick = () => selectChest(chest);

  const textStyle = {
    flex: 1,
    cursor: "pointer",
    color: darkMode ? "#fff" : "#000",
    backgroundColor: isEditing ? (darkMode ? "#444" : "#ddd") : "transparent",
    userSelect: "none",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}>
      {/* Indent for hierarchy */}
      <span style={{ display: "inline-block", width: "24px" }} />
      <span onClick={handleClick} style={textStyle}>
        📦 {chest.amount != null ? `(${chest.amount}) ` : ""}
        {chest.item_name || "<unnamed>"}
      </span>
    </div>
  );
}