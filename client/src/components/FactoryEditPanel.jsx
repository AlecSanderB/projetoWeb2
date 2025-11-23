import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { getCardStyles, getInputStyles, getButtonStyles } from "./EditPanelStyles";

export default function FactoryEditPanel({
  item,
  saveCallback,
  addChildCallback,
  deleteCallback,
  childrenList = [],
  darkMode
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState(item.name ?? "");
  const [coordX, setCoordX] = useState(item.coord_x ?? 0);
  const [coordY, setCoordY] = useState(item.coord_y ?? 0);

  // --- Sync state when `item` changes ---
  useEffect(() => {
    setName(item.name ?? "");
    setCoordX(item.coord_x ?? 0);
    setCoordY(item.coord_y ?? 0);
  }, [item]);

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "name") setName(value);
    if (fieldName === "coord_x") setCoordX(value);
    if (fieldName === "coord_y") setCoordY(value);

    saveCallback({ ...item, [fieldName]: value });
  };

  const handleDelete = () => {
    deleteCallback(item);
    setShowDeleteModal(false);
  };

  const labelStyle = { margin: 0, lineHeight: "1.2" };

  return (
    <div style={getCardStyles(darkMode)}>
      {/* Name + X + Y */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: "0.6", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            style={getInputStyles(darkMode)}
          />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>X:</label>
          <input
            type="number"
            value={coordX}
            onChange={(e) => handleFieldChange("coord_x", e.target.value === "" ? 0 : Number(e.target.value))}
            style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Y:</label>
          <input
            type="number"
            value={coordY}
            onChange={(e) => handleFieldChange("coord_y", e.target.value === "" ? 0 : Number(e.target.value))}
            style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
      </div>

      {/* ID */}
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-start" }}>
        <span>ID: {item.id}</span>
      </div>

      {/* Save + Add Child */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          style={{ ...getButtonStyles(darkMode), backgroundColor: "#4caf50", color: "#fff", flex: 1 }}
          onClick={() => saveCallback({ ...item, name, coord_x: coordX, coord_y: coordY })}
        >
          Save
        </button>
        {addChildCallback && (
          <button
            style={{ ...getButtonStyles(darkMode), backgroundColor: "#1976d2", color: "#fff", flex: 1 }}
            onClick={addChildCallback}
          >
            + Add Machine
          </button>
        )}
      </div>

      {/* Delete */}
      <div style={{ marginTop: "10px" }}>
        <button
          style={{ ...getButtonStyles(darkMode), backgroundColor: "#d32f2f", color: "#fff", width: "100%" }}
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      </div>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={name || "<unnamed>"}
        itemType="factory"
        childrenList={childrenList}
        darkMode={darkMode}
      />
    </div>
  );
}