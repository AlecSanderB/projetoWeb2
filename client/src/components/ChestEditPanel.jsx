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
  const [coordX, setCoordX] = useState(item.coord_x ?? 0);
  const [coordY, setCoordY] = useState(item.coord_y ?? 0);
  const [amount, setAmount] = useState(item.amount ?? 0);
  const [lastUpdate, setLastUpdate] = useState(item.last_update ? new Date(item.last_update) : null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [rendered, timeAgo] = useRenderedTimeAgo(lastUpdate);

  // Keep local state in sync if item changes
  useEffect(() => {
    setCoordX(item.coord_x ?? 0);
    setCoordY(item.coord_y ?? 0);
    setAmount(item.amount ?? 0);
    setLastUpdate(item.last_update ? new Date(item.last_update) : null);
  }, [item]);

  // Fetch latest data periodically
  useEffect(() => {
    const fetchLatest = async () => {
      if (!item.id) return;
      try {
        const data = await apiGet(`/chests/${item.id}`);
        if (data) {
          setLastUpdate(data.last_update ? new Date(data.last_update) : lastUpdate);
          if (data.amount != null) setAmount(data.amount);
          if (data.coord_x != null) setCoordX(data.coord_x);
          if (data.coord_y != null) setCoordY(data.coord_y);
        }
      } catch (err) {
        console.error("Failed to fetch latest chest:", err);
      }
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 60000);
    return () => clearInterval(interval);
  }, [item.id]);

  const handleSave = async () => {
    if (!item.id) {
      console.error("Cannot save chest: ID is undefined", item);
      return;
    }

    const updatedChest = {
      ...item, // ensures id, machine_id, and other fields are preserved
      coord_x: coordX,
      coord_y: coordY,
      amount: amount,
    };

    try {
      const saved = await apiPut(`/chests/${updatedChest.id}`, updatedChest);
      saveCallback(saved);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Failed to save chest:", err);
    }
  };

  const handleDelete = async () => {
    if (!item.id) return;
    try {
      await apiDelete(`/chests/${item.id}`);
      deleteCallback(item);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete chest:", err);
    }
  };

  return (
    <div style={getCardStyles(darkMode)}>
      {/* Coordinates and Item Name */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: "0.6", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ margin: 0 }}>Item Name:</label>
          <input type="text" value={item.item_name ?? ""} readOnly style={{ ...getInputStyles(darkMode), userSelect: "none", pointerEvents: "none" }} />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ margin: 0 }}>X:</label>
          <input
            type="number"
            value={coordX}
            onChange={(e) => setCoordX(Number(e.target.value || 0))}
            style={{ ...getInputStyles(darkMode), textAlign: "center" }}
          />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ margin: 0 }}>Y:</label>
          <input
            type="number"
            value={coordY}
            onChange={(e) => setCoordY(Number(e.target.value || 0))}
            style={{ ...getInputStyles(darkMode), textAlign: "center" }}
          />
        </div>
      </div>

      {/* ID, Rendered, Last Update */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        <span style={{ fontWeight: "bold" }}>ID: {item.id ?? "<unsaved>"}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ margin: 0 }}>Rendered:</label>
          <div style={renderedCircleStyle(rendered)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <label style={{ margin: 0 }}>Last Update:</label>
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          style={{ ...getButtonStyles(darkMode), backgroundColor: "#4caf50", color: "#fff", flex: 1 }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {/* Delete Button */}
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

      <div style={{ marginTop: "15px" }}>
        {item.id && <ChestHistoryPanel chestId={item.id} darkMode={darkMode} />}
      </div>
    </div>
  );
}