import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { apiGet, apiPut, apiDelete } from "../api/api";
import { getCardStyles, getInputStyles, getButtonStyles } from "./EditPanelStyles";
import MachineHistoryPanel from "./MachineHistoryPanel";
import { useRenderedTimeAgo } from "../hooks/useRenderedTimeAgo";

const renderedCircleStyle = (isRendered) => ({
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: isRendered ? "#4caf50" : "#d32f2f",
  display: "inline-block",
});

export default function MachineEditPanel({
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
  const [isEnabled, setIsEnabled] = useState(item.is_enabled ?? false);
  const [lastUpdate, setLastUpdate] = useState(item.last_update ? new Date(item.last_update) : null);

  const [rendered, timeAgo] = useRenderedTimeAgo(lastUpdate);

  useEffect(() => {
    setName(item.name ?? "");
    setCoordX(item.coord_x ?? 0);
    setCoordY(item.coord_y ?? 0);
    setIsEnabled(item.is_enabled ?? false);
    setLastUpdate(item.last_update ? new Date(item.last_update) : null);
  }, [item]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const latest = await apiGet(`/machines/${item.id}`);
        if (latest.last_update) setLastUpdate(new Date(latest.last_update));
      } catch (err) {
        console.error("Failed to fetch latest machine:", err);
      }
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 60000);
    return () => clearInterval(interval);
  }, [item.id]);

  const handleSave = async () => {
    try {
      const updated = await apiPut(`/machines/${item.id}`, {
        ...item,
        name,
        coord_x: coordX,
        coord_y: coordY,
        is_enabled: isEnabled
      });
      saveCallback(updated);
    } catch (err) {
      console.error("Failed to save machine:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await apiDelete(`/machines/${item.id}`);
      deleteCallback(item);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete machine:", err);
    }
  };

  const labelStyle = { margin: 0, lineHeight: "1.2" };

  return (
    <div style={getCardStyles(darkMode)}>
      {/* Name + X + Y */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: "0.6", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={getInputStyles(darkMode)} />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>X:</label>
          <input type="number" value={coordX} onChange={e => setCoordX(Number(e.target.value))}
            style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }} />
        </div>
        <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Y:</label>
          <input type="number" value={coordY} onChange={e => setCoordY(Number(e.target.value))}
            style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }} />
        </div>
      </div>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "10px", width: "100%" }}>
        <div style={{ flex: 1 }}>ID: {item.id}</div>
        <div style={{ flex: 1 }}>
          Enabled: <input type="checkbox" checked={isEnabled} onChange={e => setIsEnabled(e.target.checked)} />
        </div>
        <div style={{ flex: 1 }}>
          Rendered: <div style={renderedCircleStyle(rendered)} />
        </div>
        <div style={{ flex: 1 }}>Last Update: {timeAgo}</div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button style={{ ...getButtonStyles(darkMode), backgroundColor: "#4caf50", color: "#fff", flex: 1 }} onClick={handleSave}>Save</button>
        {addChildCallback && <button style={{ ...getButtonStyles(darkMode), backgroundColor: "#1976d2", color: "#fff", flex: 1 }} onClick={addChildCallback}>+ Add Chest</button>}
      </div>

      <div style={{ marginTop: "10px" }}>
        <button style={{ ...getButtonStyles(darkMode), backgroundColor: "#d32f2f", color: "#fff", width: "100%" }} onClick={() => setShowDeleteModal(true)}>Delete</button>
      </div>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={name || "<unnamed>"}
        itemType="machine"
        childrenList={childrenList}
        darkMode={darkMode}
      />

      <div style={{ marginTop: "15px" }}>
        <MachineHistoryPanel machineId={item.id} darkMode={darkMode} />
      </div>
    </div>
  );
}