import React, { useRef } from "react";
import ChestItem from "./ChestItem";

export default function MachineItem({
  machine,
  chests,
  editingId,
  setEditingId,
  editingValues,
  setEditingValues,
  isManager,
  selectMachine,
  selectChest,
  collapsed,
  toggleCollapse,
  darkMode
}) {
  const clickTimer = useRef(null);
  const isCollapsed = collapsed || false;

  const handleClick = () => {
    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      selectMachine(machine);
      clickTimer.current = null;
    }, 200);
  };

  const hasChildren = chests.length > 0;
  const collapseSymbol = hasChildren ? (isCollapsed ? "▶" : "▼") : "";

  const buttonStyle = {
    marginRight: "6px",
    width: "24px",
    background: "none",
    border: "none",
    cursor: hasChildren ? "pointer" : "default",
    color: darkMode ? "#fff" : "#000",
    fontSize: "14px",
    padding: 0,
    textAlign: "center"
  };

  return (
    <div style={{ marginBottom: "4px" }}>
      <div style={{ display: "flex", alignItems: "center", userSelect: "none" }}>
        <button onClick={toggleCollapse} style={buttonStyle}>
          {collapseSymbol || <span style={{ display: "inline-block", width: "14px" }} />}
        </button>

        <span
          onClick={handleClick}
          style={{ flex: 1, cursor: "pointer" }}
        >
          ⚙️ {machine.name || "<unnamed>"}
        </span>
      </div>

      {!isCollapsed && chests.length > 0 && (
        <div style={{ paddingLeft: "24px", marginTop: "6px" }}>
          {chests.map((c) => (
            <ChestItem
              key={c.id}
              chest={c}
              darkMode={darkMode}
              editingId={editingId}
              setEditingId={setEditingId}
              editingValues={editingValues}
              setEditingValues={setEditingValues}
              isManager={isManager}
              selectChest={selectChest}
            />
          ))}
        </div>
      )}
    </div>
  );
}