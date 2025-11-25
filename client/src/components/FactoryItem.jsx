import React from "react";
import MachineItem from "./MachineItem";

export default function FactoryItem({
  factory,
  darkMode,
  machines = [],
  chests = [],
  editingId,
  setEditingId,
  editingValues,
  setEditingValues,
  saveFactory,
  selectedMachine,
  isManager,
  selectFactory,
  selectMachine,
  selectChest,
  collapsed = false,
  toggleCollapse,
  collapsedMachines = {},
  setCollapsedMachines,
}) {
  const isEditing = editingId?.type === "factory" && editingId.id === factory.id;

  const handleSave = () => {
    if (editingValues.name !== undefined) {
      saveFactory({ ...factory, ...editingValues });
      setEditingId({ type: null, id: null });
    }
  };

  const handleClick = () => selectFactory(factory);

  const hasChildren = machines.length > 0;
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
    <div style={{ marginBottom: "6px" }}>
      {/* Factory Header */}
      <div style={{ display: "flex", alignItems: "center", userSelect: "none" }}>
        <button onClick={toggleCollapse} style={buttonStyle}>
          {collapseSymbol || <span style={{ display: "inline-block", width: "14px" }} />}
        </button>

        {isEditing ? (
          <input
            value={editingValues.name ?? ""}
            autoFocus
            onFocus={() => setEditingId({ type: "factory", id: factory.id })}
            onChange={(e) => setEditingValues((prev) => ({ ...prev, name: e.target.value }))}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={{ flex: 1 }}
          />
        ) : (
          <span
            onClick={handleClick}
            style={{ flex: 1, cursor: "pointer", userSelect: "none" }}
          >
            🏭 {factory.name || "<unnamed>"}
          </span>
        )}
      </div>

      {/* Machines */}
      {!collapsed && machines.length > 0 && (
        <div style={{ paddingLeft: "24px", marginTop: "4px" }}>
          {machines.map((m) => (
            <MachineItem
              key={m.id}
              machine={m}
              darkMode={darkMode}
              selectedMachine={selectedMachine}
              chests={chests.filter((c) => c.machine_id === m.id)}
              editingId={editingId}
              setEditingId={setEditingId}
              editingValues={editingValues}
              setEditingValues={setEditingValues}
              isManager={isManager}
              selectMachine={selectMachine}
              selectChest={selectChest}
              collapsed={collapsedMachines[m.id]}
              toggleCollapse={() =>
                setCollapsedMachines((prev) => ({ ...prev, [m.id]: !prev[m.id] }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}