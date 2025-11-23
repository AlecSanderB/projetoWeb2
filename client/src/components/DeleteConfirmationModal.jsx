import React from "react";

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType,
  childrenList,
  darkMode
}) {
  if (!open) return null;

  const getSymbol = (type) => {
    switch (type) {
      case "factory": return "🏭";
      case "machine": return "⚙️";
      case "chest": return "📦";
      default: return "";
    }
  };

  const getIndent = (childType) => {
    switch (childType) {
      case "machine": return "12px";
      case "chest": return "24px";
      default: return "0px";
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: darkMode ? "#2a2a3d" : "#fff",
    color: darkMode ? "#fff" : "#000",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: darkMode
      ? "0 5px 15px rgba(0,0,0,0.7)"
      : "0 5px 15px rgba(0,0,0,0.3)",
  };

  const buttonsStyle = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  };

  const cancelButtonStyle = {
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: darkMode ? "#555" : "#f0f0f0",
    color: darkMode ? "#fff" : "#000",
    border: "none",
    borderRadius: "6px",
  };

  const confirmButtonStyle = {
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Confirm Deletion</h3>
        <p>
          Are you sure you want to delete{" "}
          <strong>{getSymbol(itemType)} {itemName}</strong>?
        </p>
        {childrenList.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <p>The following children will also be deleted:</p>
            <div>
              {childrenList.map((c) => {
                const childType = c.machine_id ? "chest" : "machine";
                return (
                  <div
                    key={c.id}
                    style={{ paddingLeft: getIndent(childType), marginBottom: "4px" }}
                  >
                    | {getSymbol(childType)} {c.name || c.item_name || "<unnamed>"}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div style={buttonsStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          <button onClick={onConfirm} style={confirmButtonStyle}>Delete</button>
        </div>
      </div>
    </div>
  );
}