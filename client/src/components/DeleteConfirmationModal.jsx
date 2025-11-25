import React, { useEffect } from "react";
import {
  getModalOverlayStyle,
  getModalStyle,
  getModalButtonsStyle,
  getModalChildIndent,
  flexColumnGap,
  getButtonStyles,
} from "../styles/Styles";

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType,
  childrenList,
  darkMode
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onConfirm, onClose]);

  if (!open) return null;

  const getSymbol = (type) => {
    switch (type) {
      case "factory": return "🏭";
      case "machine": return "⚙️";
      case "chest": return "📦";
      default: return "";
    }
  };

  return (
    <div style={getModalOverlayStyle(darkMode)}>
      <div style={getModalStyle(darkMode)}>
        <h3>Confirm Deletion</h3>
        <p>
          Are you sure you want to delete{" "}
          <strong>{getSymbol(itemType)} {itemName}</strong>?
        </p>

        {childrenList.length > 0 && (
          <div style={{ marginTop: "10px", ...flexColumnGap("4px") }}>
            <p>The following children will also be deleted:</p>
            {childrenList.map((c) => {
              const childType = c.machine_id ? "chest" : "machine";
              return (
                <div
                  key={c.id}
                  style={{ paddingLeft: getModalChildIndent(childType) }}
                >
                  | {getSymbol(childType)} {c.name || c.item_name || "<unnamed>"}
                </div>
              );
            })}
          </div>
        )}

        <div style={getModalButtonsStyle}>
          <button
            onClick={onClose}
            style={getButtonStyles(false, darkMode, { backgroundColor: "#1976d2", color: "#fff", flex: 1 })}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={getButtonStyles(false, darkMode, { backgroundColor: "#d32f2f", color: "#fff", flex: 1 })}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}