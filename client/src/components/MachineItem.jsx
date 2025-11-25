import React from "react";
import ChestItem from "./ChestItem";

export default function MachineItem({
  machine,
  chests = [],
  editingId,
  setEditingId,
  editingValues,
  setEditingValues,
  selectMachine,
  selectChest,
  collapsed = false,
  toggleCollapse,
  darkMode,
}) {
  const isEditing = editingId?.type === "machine" && editingId.id === machine.id;

  const handleSave = () => setEditingId({ type: null, id: null });
  const handleClick = () => selectMachine(machine);

  const hasChildren = chests.length > 0;
  const collapseSymbol = hasChildren ? (collapsed ? "▶" : "▼") : "";

  const buttonStyle = {
    marginRight: "6px",
    width: "24px",
    background: "none",
    border: "none",
    cursor: hasChildren ? "pointer" : "default",
    color: darkMode ? "#fff" : "#000",
    fontSize: "14px",
    padding: 0,
    textAlign: "center",
  };

  return (
    <div style={{ marginBottom: "4px" }}>
      {/* Machine Header */}
      <div style={{ display: "flex", alignItems: "center", userSelect: "none" }}>
        <button onClick={toggleCollapse} style={buttonStyle}>
          {collapseSymbol || <span style={{ display: "inline-block", width: "14px" }} />}
        </button>

        {isEditing ? (
          <input
            value={editingValues.name ?? ""}
            autoFocus
            onChange={(e) =>
              setEditingValues((prev) => ({ ...prev, name: e.target.value }))
            }
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={{ flex: 1 }}
          />
        ) : (
          <span
            onClick={handleClick}
            style={{ flex: 1, cursor: "pointer", userSelect: "none" }}
          >
            ⚙️ {machine.name || "<unnamed>"}
          </span>
        )}
      </div>

      {/* Chests */}
      {!collapsed && chests.length > 0 && (
        <div style={{ paddingLeft: "24px", marginTop: "6px" }}>
          {chests.map((c) => (
            <ChestItem
              key={c.id}
              chest={c}
              darkMode={darkMode}
              selectChest={selectChest}
              editingId={editingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}