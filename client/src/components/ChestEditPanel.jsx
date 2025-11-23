import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { apiGet, apiPut, apiDelete } from "../api/api";
import { getCardStyles, getInputStyles, getButtonStyles } from "./EditPanelStyles";
import ChestHistoryPanel from "./ChestHistoryPanel";
import { useRenderedTimeAgo } from "../hooks/useRenderedTimeAgo";

const renderedCircleStyle = (isRendered) => ({
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: isRendered ? "#4caf50" : "#d32f2f",
  display: "inline-block",
});

export default function ChestEditPanel({ item, saveCallback, deleteCallback, childrenList = [], darkMode }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coordX, setCoordX] = useState(item.coord_x ?? 0);
  const [coordY, setCoordY] = useState(item.coord_y ?? 0);
  const [amount, setAmount] = useState(item.amount ?? 0);
  const [lastUpdate, setLastUpdate] = useState(item.last_update ? new Date(item.last_update) : null);

  const [rendered, timeAgo] = useRenderedTimeAgo(lastUpdate);

  useEffect(() => {
    setCoordX(item.coord_x ?? 0);
    setCoordY(item.coord_y ?? 0);
    setAmount(item.amount ?? 0);
    setLastUpdate(item.last_update ? new Date(item.last_update) : null);
  }, [item]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await apiGet(`/chests/${item.id}`);
        if (data.last_update) setLastUpdate(new Date(data.last_update));
        if (data.amount != null) setAmount(data.amount);
        if (data.coord_x != null) setCoordX(data.coord_x);
        if (data.coord_y != null) setCoordY(data.coord_y);
      } catch (err) {
        console.error("Failed to fetch latest chest:", err);
      }
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 60000);
    return () => clearInterval(interval);
  }, [item.id]);

  const handleSave = async (updatedChest) => {
    try {
      const saved = await apiPut(`/chests/${updatedChest.id}`, updatedChest);
      saveCallback(saved);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Failed to save chest:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await apiDelete(`/chests/${item.id}`);
      deleteCallback(item);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete chest:", err);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "coord_x") setCoordX(value);
    if (fieldName === "coord_y") setCoordY(value);
  };

  const labelStyle = { margin: 0, lineHeight: "1.2" };
  const readOnlyStyle = { ...getInputStyles(darkMode), userSelect: "none", pointerEvents: "none" };

  return (
    <div style={getCardStyles(darkMode)}>
      {/* Coordinates */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: "0.6", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Item Name:</label>
          <input type="text" value={item.item_name ?? ""} readOnly style={readOnlyStyle} />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>X:</label>
          <input type="number" value={coordX} onChange={e => handleFieldChange("coord_x", Number(e.target.value || 0))}
            style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }} inputMode="numeric" />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Y:</label>
          <input type="number" value={coordY} onChange={e => handleFieldChange("coord_y", Number(e.target.value || 0))}
            style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }} inputMode="numeric" />
        </div>
      </div>

      {/* Amount + Rendered */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        <span style={{ fontWeight: "bold" }}>ID: {item.id}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={labelStyle}>Rendered:</label>
          <div style={renderedCircleStyle(rendered)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <label style={labelStyle}>Last Update:</label>
          <span>{timeAgo}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button style={{ ...getButtonStyles(darkMode), backgroundColor: "#4caf50", color: "#fff", flex: 1 }}
          onClick={() => handleSave({ ...item, coord_x: coordX, coord_y: coordY })}>
          Save
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button style={{ ...getButtonStyles(darkMode), backgroundColor: "#d32f2f", color: "#fff", width: "100%" }}
          onClick={() => setShowDeleteModal(true)}>
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

      <div style={{ marginTop: "15px" }}>
        <ChestHistoryPanel chestId={item.id} darkMode={darkMode} />
      </div>
    </div>
  );
}