import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { getCardStyles, getInputStyles, getButtonStyles } from "./EditPanelStyles";

export default function ChestEditPanel({
  item,
  saveCallback,
  deleteCallback,
  childrenList = [],
  darkMode
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coordX, setCoordX] = useState(item.coord_x ?? 0);
  const [coordY, setCoordY] = useState(item.coord_y ?? 0);
  const [lastUpdate, setLastUpdate] = useState(item.last_update ? new Date(item.last_update) : null);
  const [rendered, setRendered] = useState(false);

  // --- Sync local state whenever item changes ---
  useEffect(() => {
    setCoordX(item.coord_x ?? 0);
    setCoordY(item.coord_y ?? 0);
    setLastUpdate(item.last_update ? new Date(item.last_update) : null);
  }, [item]);

  // --- Live rendered indicator ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastUpdate) return;
      const now = new Date();
      setRendered(now - lastUpdate <= 30000);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "coord_x") setCoordX(value);
    if (fieldName === "coord_y") setCoordY(value);

    saveCallback({ ...item, [fieldName]: value });
  };

  const handleDelete = () => {
    deleteCallback(item);
    setShowDeleteModal(false);
  };

  const labelStyle = { margin: 0, lineHeight: "1.2" };
  const readOnlyStyle = {
    ...getInputStyles(darkMode),
    userSelect: "none",
    pointerEvents: "none"
  };

  return (
    <div style={getCardStyles(darkMode)}>
      {/* Name + X + Y */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: "0.6", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Item Name:</label>
          <input
            type="text"
            value={item.item_name ?? ""}
            readOnly
            style={readOnlyStyle}
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

      {/* Amount (read-only) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "10px" }}>
        <label style={labelStyle}>Amount:</label>
        <input
          type="number"
          value={item.amount ?? 0}
          readOnly
          style={readOnlyStyle}
        />
      </div>

      {/* ID + Rendered + Last Update */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        <span>ID: {item.id}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={labelStyle}>Rendered:</label>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: rendered ? "#4caf50" : "#d32f2f",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <label style={labelStyle}>Last Update:</label>
          <span>{lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}</span>
        </div>
      </div>

      {/* Save */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          style={{ ...getButtonStyles(darkMode), backgroundColor: "#4caf50", color: "#fff", flex: 1 }}
          onClick={() => saveCallback({ ...item, coord_x: coordX, coord_y: coordY })}
        >
          Save
        </button>
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
        itemName={item.item_name || "<unnamed>"}
        itemType="chest"
        childrenList={childrenList}
        darkMode={darkMode}
      />
    </div>
  );
}