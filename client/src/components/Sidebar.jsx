import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import FactoryItem from "./FactoryItem";

export default function Sidebar({
  factories,
  selectedFactory,
  selectedMachine,
  editingId,
  setEditingId,
  editingValues,
  setEditingValues,
  saveFactory,
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

  const [machines, setMachines] = useState([]);
  const [chests, setChests] = useState([]);

  async function handleLogout() {
    try {
      await fetch("http://localhost:8081/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  // Periodically fetch machines and chests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machinesRes, chestsRes] = await Promise.all([
          fetch("http://localhost:8081/api/machines"),
          fetch("http://localhost:8081/api/chests")
        ]);

        const [machinesData, chestsData] = await Promise.all([
          machinesRes.json(),
          chestsRes.json()
        ]);

        setMachines(machinesData);
        setChests(chestsData);
      } catch (err) {
        console.error("Failed to fetch machines or chests", err);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const sidebarBg = darkMode ? "#1e1e2f" : "#f9f9f9";
  const borderColor = darkMode ? "#444" : "#ccc";

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

      {/* Scrollable middle section */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          minHeight: 0,
          paddingBottom: "60px",
        }}
      >
        {factories.map((f) => (
          <FactoryItem
            key={f.id}
            factory={f}
            darkMode={darkMode}
            selectedFactory={selectedFactory}
            selectedMachine={selectedMachine}
            machines={machines.filter((m) => m.factory_id === f.id)}
            chests={chests}
            editingId={editingId}
            setEditingId={setEditingId}
            editingValues={editingValues}
            setEditingValues={setEditingValues}
            saveFactory={saveFactory}
            deleteFactory={deleteFactory}
            deleteMachine={deleteMachine}
            addChest={addChest}
            deleteChest={deleteChest}
            isManager={isManager}
            selectFactory={selectFactory}
            selectMachine={selectMachine}
            selectChest={selectChest}
            collapsed={collapsedFactories[f.id]}
            toggleCollapse={() =>
              setCollapsedFactories(prev => ({ ...prev, [f.id]: !prev[f.id] }))
            }
            collapsedMachines={collapsedMachines}
            setCollapsedMachines={setCollapsedMachines}
            addMachine={addMachine}
          />
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
        <button
          style={{
            width: "100%",
            backgroundColor: "#f44336",
            color: "#fff",
          }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}