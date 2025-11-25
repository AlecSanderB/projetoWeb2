import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import HistoryPanel from "./HistoryPanel";
import { apiGet, apiPut } from "../api/api";
import {
  getCardStyles,
  getInputStyles,
  getButtonStyles,
  labelStyle,
  flexColumnGap,
  flexRowGap,
  historyPanelWrapper,
  renderedCircleStyle,
  enabledWrapper,
  enabledLabel,
  switchOuter,
  switchCircle,
} from "../styles/Styles";
import { useRenderedTimeAgo } from "../hooks/useRenderedTimeAgo";

export default function EditPanel({ type, item, addChildCallback, childrenList = [], darkMode, saveCallback, deleteCallback, setSelectedItem }) {
  const [fields, setFields] = useState({
    ...item,
    coord_x: item.coord_x != null ? String(item.coord_x) : "",
    coord_y: item.coord_y != null ? String(item.coord_y) : "",
    is_enabled: item.is_enabled ?? false,
    amount: item.amount ?? 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [rendered, timeAgo] = useRenderedTimeAgo(fields.last_update ? new Date(fields.last_update) : null);

  useEffect(() => {
    setFields({
      ...item,
      coord_x: item.coord_x != null ? String(item.coord_x) : "",
      coord_y: item.coord_y != null ? String(item.coord_y) : "",
      is_enabled: item.is_enabled ?? false,
      amount: item.amount ?? 0,
    });
  }, [item]);

  useEffect(() => {
    if (!item.id || type === "factory") return;
    if (item.id.toString().startsWith("temp-")) return;
    const fetchLatest = async () => {
      try {
        const endpoint = type === "machine" ? `/machines/${item.id}` : `/chests/${item.id}`;
        const data = await apiGet(endpoint);
        if (!data) return;
        setFields(prev => ({
          ...prev,
          last_update: data.last_update ?? prev.last_update,
          coord_x: data.coord_x ?? prev.coord_x,
          coord_y: data.coord_y ?? prev.coord_y,
          is_enabled: data.is_enabled ?? prev.is_enabled,
          amount: data.amount ?? prev.amount,
        }));
      } catch (err) {
        console.error(`Failed to fetch latest ${type}:`, err);
      }
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 60000);
    return () => clearInterval(interval);
  }, [item.id, type]);

  const handleFieldChange = (field, value) => setFields(prev => ({ ...prev, [field]: value }));
  const isChest = type === "chest";
  const isMachine = type === "machine";
  const isFactory = type === "factory";

  const handleToggleEnabled = async () => {
    if (!isMachine || loadingToggle) return;
    const newStatus = !fields.is_enabled;
    setFields(prev => ({ ...prev, is_enabled: newStatus }));
    setLoadingToggle(true);
    try {
      await apiPut(`/machines/${item.id}`, { ...fields, is_enabled: newStatus });
    } catch {
      setFields(prev => ({ ...prev, is_enabled: !newStatus }));
    } finally {
      setLoadingToggle(false);
    }
  };

  const handleSave = async () => {
    if (!saveCallback) return;
    const payload = { ...item, ...fields, coord_x: Number(fields.coord_x), coord_y: Number(fields.coord_y) };
    await saveCallback(payload);
  };

  const handleDelete = async () => {
    if (!deleteCallback) return;
    await deleteCallback(item);
    setShowDeleteModal(false);
  };

  return (
    <div style={getCardStyles(darkMode)}>
      <div style={flexRowGap("10px")}>
        <div style={{ flex: 0.6, ...flexColumnGap() }}>
          <label style={labelStyle}>{isChest ? "Item Name:" : "Name:"}</label>
          <input
            type="text"
            value={isChest ? fields.item_name ?? "" : fields.name ?? ""}
            readOnly={isChest}
            onChange={e => !isChest && handleFieldChange("name", e.target.value)}
            style={{ ...getInputStyles(darkMode), userSelect: isChest ? "none" : "auto", pointerEvents: isChest ? "none" : "auto" }}
          />
        </div>
        <div style={{ flex: 0.2, ...flexColumnGap() }}>
          <label style={labelStyle}>X:</label>
          <input type="number" value={fields.coord_x ?? ""} onChange={e => handleFieldChange("coord_x", e.target.value)} style={{ ...getInputStyles(darkMode), textAlign: "center" }} />
        </div>
        <div style={{ flex: 0.2, ...flexColumnGap() }}>
          <label style={labelStyle}>Y:</label>
          <input type="number" value={fields.coord_y ?? ""} onChange={e => handleFieldChange("coord_y", e.target.value)} style={{ ...getInputStyles(darkMode), textAlign: "center" }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        <span style={{ fontWeight: "bold" }}>ID: {item.id ?? "<unsaved>"}</span>
        {isMachine && (
          <div style={enabledWrapper}>
            <label style={enabledLabel}>Enabled:</label>
            <div style={{ ...switchOuter, backgroundColor: fields.is_enabled ? "#4caf50" : darkMode ? "#555" : "#ccc" }} onClick={handleToggleEnabled}>
              <div style={{ ...switchCircle, left: fields.is_enabled ? "26px" : "2px" }} />
            </div>
          </div>
        )}
        {isChest && <span>Amount: {fields.amount}</span>}
        {(isMachine || isChest) && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ margin: 0 }}>Rendered:</label>
              <div style={renderedCircleStyle(rendered)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <label style={{ margin: 0 }}>Last Update:</label>
              <span>{timeAgo}</span>
            </div>
          </>
        )}
      </div>

      <div style={flexRowGap("10px", { marginTop: "10px" })}>
        <button style={getButtonStyles(false, darkMode, { backgroundColor: "#4caf50", color: "#fff", flex: 1 })} onClick={handleSave}>Save</button>
        {addChildCallback && (
          <button style={getButtonStyles(false, darkMode, { backgroundColor: "#1976d2", color: "#fff", flex: 1 })} onClick={addChildCallback}>
            {isFactory ? "+ Add Machine" : isMachine ? "+ Add Chest" : null}
          </button>
        )}
      </div>

      <div style={{ marginTop: "10px" }}>
        <button style={getButtonStyles(false, darkMode, { backgroundColor: "#d32f2f", color: "#fff", width: "100%" })} onClick={() => setShowDeleteModal(true)}>Delete</button>
      </div>

      <DeleteConfirmationModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} itemName={fields.name ?? fields.item_name ?? "<unnamed>"} itemType={type} childrenList={childrenList} darkMode={darkMode} />

      {item.id && type !== "factory" && !item.id.toString().startsWith("temp-") && (
        <div style={{ marginTop: "15px", ...historyPanelWrapper }}>
          <HistoryPanel type={type} id={item.id} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}