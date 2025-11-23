import React, { useRef, useEffect } from "react";
import ChestItem from "./ChestItem";

export default function MachineItem({
  machine, chests, editingId, setEditingId, editingValues, setEditingValues,
  selectMachine, selectChest, collapsed, toggleCollapse, darkMode
}) {
  const clickTimer = useRef(null);
  const isCollapsed = collapsed || false;
  const isEditing = editingId?.type === "machine" && editingId.id === machine.id;

  useEffect(() => {
    if (isEditing && editingValues.id !== machine.id) {
      setEditingValues({
        id: machine.id,
        name: machine.name,
        coord_x: machine.coord_x,
        coord_y: machine.coord_y,
        is_enabled: machine.is_enabled
      });
    }
  }, [isEditing, machine, editingValues, setEditingValues]);

  const handleClick = () => {
    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      selectMachine(machine);
      clickTimer.current = null;
    }, 200);
  };

  const handleSave = () => setEditingId({ type: null, id: null });

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

        {isEditing ? (
          <input
            value={editingValues.name ?? ""}
            autoFocus
            onChange={e => setEditingValues(prev => ({ ...prev, name: e.target.value }))}
            onBlur={handleSave}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            style={{ flex: 1 }}
          />
        ) : (
          <span onClick={handleClick} style={{ flex: 1, cursor: "pointer" }}>
            ⚙️ {machine.name || "<unnamed>"}
          </span>
        )}
      </div>

      {!isCollapsed && chests.length > 0 && (
        <div style={{ paddingLeft: "24px", marginTop: "6px" }}>
          {chests.map(c => (
            <ChestItem key={c.id} chest={c} darkMode={darkMode} selectChest={selectChest} editingId={editingId} />
          ))}
        </div>
      )}
    </div>
  );
}