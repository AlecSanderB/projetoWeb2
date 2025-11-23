import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import FactoryItem from "./FactoryItem";

export default function Sidebar({
  factories,
  machines,
  chests,
  selectedFactory,
  selectedMachine,
  editingId,
  setEditingId,
  editingValues,
  setEditingValues,
  saveFactory,
  saveMachine,
  saveChest,
  deleteFactory,
  deleteMachine,
  deleteChest,
  addFactory,
  addMachine,
  addChest,
  user,
  selectFactory,
  selectMachine,
  selectChest,
  collapsedFactories,
  setCollapsedFactories,
  collapsedMachines,
  setCollapsedMachines
}) {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isManager = user?.role_id === 1;

  const sidebarBg = darkMode ? "#1e1e2f" : "#f9f9f9";
  const borderColor = darkMode ? "#444" : "#ccc";
  const editingHighlight = darkMode ? "#2a2a3c" : "#d0f0d0"; // background for editing

  async function handleLogout() {
    try {
      await fetch("http://localhost:8081/auth/logout", { method: "POST", credentials: "include" });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <div
      style={{
        width: "300px",
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: sidebarBg,
        height: "100vh",
      }}
    >
      {/* Top buttons */}
      <div style={{ padding: "10px", flexShrink: 0 }}>
        <button
          style={{
            width: "100%",
            marginBottom: "8px",
            backgroundColor: darkMode ? "#1976d2" : "#4caf50",
            color: "#fff",
          }}
          onClick={toggleTheme}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        {isManager && (
          <button
            style={{
              width: "100%",
              backgroundColor: "#4caf50",
              color: "#fff",
              marginBottom: "8px",
            }}
            onClick={async () => {
              const newFactory = await addFactory();
              if (newFactory) selectFactory(newFactory);
            }}
          >
            + Add Factory
          </button>
        )}
      </div>

      {/* Factory list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", minHeight: 0, paddingBottom: "60px" }}>
        {factories.map(f => (
          <div
            key={f.id}
            style={{
              backgroundColor: editingId === f.id ? editingHighlight : "transparent",
              borderRadius: "4px",
              padding: "2px 0"
            }}
          >
            <FactoryItem
              factory={f}
              darkMode={darkMode}
              selectedFactory={selectedFactory}
              selectedMachine={selectedMachine}
              machines={machines.filter(m => m.factory_id === f.id)}
              chests={chests}
              editingId={editingId}
              setEditingId={setEditingId}
              editingValues={editingValues}
              setEditingValues={setEditingValues}
              saveFactory={saveFactory}
              deleteFactory={deleteFactory}
              deleteMachine={deleteMachine}
              addMachine={addMachine}
              addChest={addChest}
              deleteChest={deleteChest}
              isManager={isManager}
              selectFactory={selectFactory}
              selectMachine={selectMachine}
              selectChest={selectChest}
              collapsed={collapsedFactories[f.id]}
              toggleCollapse={() => setCollapsedFactories(prev => ({ ...prev, [f.id]: !prev[f.id] }))}
              collapsedMachines={collapsedMachines}
              setCollapsedMachines={setCollapsedMachines}
            />
          </div>
        ))}
      </div>

      {/* Bottom logout button */}
      <div
        style={{
          padding: "10px",
          flexShrink: 0,
          position: "sticky",
          bottom: 0,
          backgroundColor: sidebarBg,
          zIndex: 10,
        }}
      >
        <button style={{ width: "100%", backgroundColor: "#f44336", color: "#fff" }} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}