import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import MenuItem from "./MenuItem";
import { getButtonStyles } from "../styles/Styles";

export default function Sidebar({
  factories,
  machines,
  chests,
  addFactory,
  user,
  collapsedMap,
  setCollapsedMap,
  selectedItem,
  setSelectedItem,
}) {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isManager = user?.role_id === 1;

  const sidebarBg = darkMode ? "#1e1e2f" : "#f9f9f9";
  const borderColor = darkMode ? "#444" : "#ccc";

  const handleSelect = (item) => {
    setSelectedItem({ ...item, id: String(item.id) });
  };

  const handleSetCollapsed = (id, value) => {
    setCollapsedMap(prev => ({ ...prev, [id]: value }));
  };

  const sortByCreatedAt = (a, b) => {
    if (!a.createdAt) return 1;  // temp items go to the bottom
    if (!b.createdAt) return -1;
    return new Date(a.createdAt) - new Date(b.createdAt);
  };

  const sortedFactories = [...factories].sort(sortByCreatedAt);
  const sortedMachines = [...machines].sort(sortByCreatedAt);
  const sortedChests = [...chests].sort(sortByCreatedAt);

  return (
    <div style={{
      width: "300px",
      borderRight: `1px solid ${borderColor}`,
      display: "flex",
      flexDirection: "column",
      backgroundColor: sidebarBg,
      height: "100vh",
    }}>
      <div style={{ padding: "10px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          style={getButtonStyles(false, darkMode, { width: "100%", backgroundColor: darkMode ? "#1976d2" : "#4caf50", color: "#fff" })}
          onClick={toggleTheme}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {isManager && (
          <button
            style={getButtonStyles(false, darkMode, { width: "100%", backgroundColor: "#4caf50", color: "#fff" })}
            onClick={async () => {
              try {
                const newFactory = await addFactory();
                if (newFactory?.id) {
                  const factoryIdStr = String(newFactory.id);
                  handleSetCollapsed(factoryIdStr, false);
                  handleSelect({ ...newFactory, type: "factory" });
                }
              } catch (err) {
                console.error("Failed to add factory:", err);
              }
            }}
          >
            + Add Factory
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px", minHeight: 0, paddingBottom: "60px" }}>
        {sortedFactories.map(f => {
          const factoryId = String(f.id);

          const factoryMachines = sortedMachines
            .filter(m => String(m.factory_id) === factoryId)
            .sort(sortByCreatedAt)
            .map(m => ({
              ...m,
              id: String(m.id),
              type: "machine",
              children: sortedChests
                .filter(c => String(c.machine_id) === String(m.id))
                .sort(sortByCreatedAt)
                .map(c => ({ ...c, id: String(c.id), type: "chest" })),
            }));

          return (
            <MenuItem
              key={factoryId}
              item={{ ...f, id: factoryId, type: "factory" }}
              type="factory"
              childrenItems={factoryMachines}
              selectItem={handleSelect}
              collapsedMap={collapsedMap}
              setCollapsedMap={handleSetCollapsed}
              darkMode={darkMode}
              selectedItem={selectedItem}
              level={0}
            />
          );
        })}
      </div>

      <div style={{ padding: "10px", flexShrink: 0, position: "sticky", bottom: 0, backgroundColor: sidebarBg, zIndex: 10 }}>
        <button
          style={getButtonStyles(false, darkMode, { width: "100%", backgroundColor: "#f44336", color: "#fff" })}
          onClick={() => navigate("/")}
        >
          Log out
        </button>
      </div>
    </div>
  );
}