import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import HistoryPanel from "./HistoryPanel";
import {
  getCardStyles,
  getInputStyles,
  getButtonStyles,
  labelStyle,
  flexColumnGap,
  flexRowGap,
  historyPanelWrapper,
} from "../styles/Styles";
import { useRenderedTimeAgo } from "../hooks/useRenderedTimeAgo";

export default function EditPanel({
  type,
  item,
  addChildCallback,
  childrenList = [],
  darkMode,
  saveCallback,
  deleteCallback,
}) {
  const [fields, setFields] = useState({
    ...item,
    coord_x: item.coord_x != null ? String(item.coord_x) : "",
    coord_y: item.coord_y != null ? String(item.coord_y) : "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rendered] = useRenderedTimeAgo(fields.last_update ? new Date(fields.last_update) : null);

  useEffect(() => {
    setFields({
      ...item,
      coord_x: item.coord_x != null ? String(item.coord_x) : "",
      coord_y: item.coord_y != null ? String(item.coord_y) : "",
    });
  }, [item]);

  const handleFieldChange = (field, value) =>
    setFields(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!saveCallback) return;
    await saveCallback({
      ...item,
      ...fields,
      coord_x: Number(fields.coord_x),
      coord_y: Number(fields.coord_y),
    });
  };

  const handleDelete = async () => {
    if (!deleteCallback) return;
    await deleteCallback(item);
    setShowDeleteModal(false);
  };

  const isChest = type === "chest";
  const isMachine = type === "machine";
  const isFactory = type === "factory";

  return (
    <div style={getCardStyles(darkMode)}>
      {/* Name / Item Name */}
      <div style={flexRowGap("10px")}>
        <div style={{ flex: 0.6, ...flexColumnGap() }}>
          <label style={labelStyle}>{isChest ? "Item Name:" : "Name:"}</label>
          <input
            type="text"
            value={isChest ? fields.item_name ?? "" : fields.name ?? ""}
            readOnly={isChest}
            onChange={e => !isChest && handleFieldChange("name", e.target.value)}
            style={{
              ...getInputStyles(darkMode),
              userSelect: isChest ? "none" : "auto",
              pointerEvents: isChest ? "none" : "auto",
            }}
          />
        </div>

        {/* Coordinates */}
        <div style={{ flex: 0.2, ...flexColumnGap() }}>
          <label style={labelStyle}>X:</label>
          <input
            type="number"
            value={fields.coord_x ?? ""}
            onChange={e => handleFieldChange("coord_x", e.target.value)}
            style={{ ...getInputStyles(darkMode), textAlign: "center" }}
          />
        </div>
        <div style={{ flex: 0.2, ...flexColumnGap() }}>
          <label style={labelStyle}>Y:</label>
          <input
            type="number"
            value={fields.coord_y ?? ""}
            onChange={e => handleFieldChange("coord_y", e.target.value)}
            style={{ ...getInputStyles(darkMode), textAlign: "center" }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={flexRowGap("10px", { marginTop: "10px" })}>
        <button
          style={getButtonStyles(false, darkMode, { backgroundColor: "#4caf50", color: "#fff", flex: 1 })}
          onClick={handleSave}
        >
          Save
        </button>

        {addChildCallback && (
          <button
            style={getButtonStyles(false, darkMode, { backgroundColor: "#1976d2", color: "#fff", flex: 1 })}
            onClick={addChildCallback}
          >
            {isFactory ? "+ Add Machine" : isMachine ? "+ Add Chest" : null}
          </button>
        )}
      </div>

      {/* Delete Button */}
      <div style={{ marginTop: "10px" }}>
        <button
          style={getButtonStyles(false, darkMode, { backgroundColor: "#d32f2f", color: "#fff", width: "100%" })}
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      </div>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={fields.name ?? fields.item_name ?? "<unnamed>"}
        itemType={type}
        childrenList={childrenList}
        darkMode={darkMode}
      />

      {/* History Panel */}
      {item.id && type !== "factory" && (
        <div style={{ marginTop: "15px", ...historyPanelWrapper }}>
          <HistoryPanel type={type} id={item.id} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}