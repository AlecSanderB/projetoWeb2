import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EditPanel from "../components/EditPanel";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { darkMode } = useTheme();

  // --- State (Single Source of Truth) ---
  const [user, setUser] = useState(null);
  const [factories, setFactories] = useState([]);
  const [machines, setMachines] = useState([]);
  const [chests, setChests] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedChest, setSelectedChest] = useState(null);
  const [editingId, setEditingId] = useState({ type: null, id: null });
  const [editingValues, setEditingValues] = useState({});
  const [collapsedFactories, setCollapsedFactories] = useState({});
  const [collapsedMachines, setCollapsedMachines] = useState({});

  // --- Load initial data ---
  useEffect(() => {
    loadUser();
    loadFactories();
  }, []);

  async function loadUser() {
    const data = await apiGet("/me");
    setUser(data);
  }

  async function loadFactories() {
    const factoriesData = await apiGet("/factories");
    setFactories(factoriesData);

    const allMachines = await apiGet("/machines");
    setMachines(allMachines);

    const allChests = await apiGet("/chests");
    setChests(allChests);
  }

  // --- Poll chests periodically (optional) ---
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedChests = await apiGet("/chests");
      setChests(updatedChests);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Keep selected items updated ---
  useEffect(() => {
    if (selectedChest) {
      const updated = chests.find(c => c.id === selectedChest.id);
      if (updated) setSelectedChest(updated);
    }
  }, [chests, selectedChest?.id]);

  useEffect(() => {
    if (selectedMachine) {
      const updated = machines.find(m => m.id === selectedMachine.id);
      if (updated) setSelectedMachine(updated);
    }
  }, [machines, selectedMachine?.id]);

  useEffect(() => {
    if (selectedFactory) {
      const updated = factories.find(f => f.id === selectedFactory.id);
      if (updated) setSelectedFactory(updated);
    }
  }, [factories, selectedFactory?.id]);

  // --- Add Items ---
  async function addItem({ type, newItem, stateSetter, setSelected, setChildren, tempIdPrefix = "temp" }) {
    if (!user) return;
    const tempId = `${tempIdPrefix}-${Date.now()}`;
    const tempItem = { ...newItem, id: tempId };

    // Optimistically add
    stateSetter(prev => [...prev, tempItem]);
    if (setSelected) setSelected(tempItem);
    setEditingId({ type, id: tempId });
    setEditingValues(newItem);

    try {
      const saved = await apiPost(`/${type}s`, newItem);
      stateSetter(prev => prev.map(item => (item.id === tempId ? saved : item)));
      if (setSelected) setSelected(saved);
      if (setChildren) setChildren([]);
      setEditingId({ type, id: saved.id });
      setEditingValues(saved);
    } catch (err) {
      console.error(`Failed to add ${type}:`, err);
      stateSetter(prev => prev.filter(item => item.id !== tempId));
    }
  }

  async function addFactory() {
    if (!user || user.role_id !== 1) return null;
    const newFactory = { name: "", coord_x: 0, coord_y: 0 };

    try {
      const savedFactory = await apiPost("/factories", newFactory);
      setFactories(prev => [...prev, savedFactory]);
      setSelectedFactory(savedFactory);
      setSelectedMachine(null);
      setSelectedChest(null);
      return savedFactory;
    } catch (err) {
      console.error("Failed to add factory:", err);
      return null;
    }
  }

  async function addMachine() {
    if (!selectedFactory) return;
    await addItem({
      type: "machine",
      newItem: { name: "", coord_x: 0, coord_y: 0, is_enabled: true, factory_id: selectedFactory.id },
      stateSetter: setMachines,
      setSelected: setSelectedMachine,
      setChildren: setChests
    });
  }

  async function addChest() {
    if (!selectedMachine) return;
    await addItem({
      type: "chest",
      newItem: { coord_x: 0, coord_y: 0, item_name: "", amount: 0, machine_id: selectedMachine.id },
      stateSetter: setChests,
      setSelected: setSelectedChest
    });
  }

  // --- Save / Update ---
  async function saveFactory(factory) {
    const updated = { ...factory, ...editingValues };
    await apiPut(`/factories/${factory.id}`, updated);
    setFactories(prev => prev.map(f => f.id === factory.id ? updated : f));
    setEditingId({ type: null, id: null });
    setEditingValues({});
  }

  async function saveMachine(machine) {
    const updated = { ...machine, ...editingValues };
    await apiPut(`/machines/${machine.id}`, updated);
    setMachines(prev => prev.map(m => m.id === machine.id ? updated : m));
    setEditingId({ type: null, id: null });
    setEditingValues({});
  }

  async function saveChest(chest) {
    const updated = { ...chest, ...editingValues };
    await apiPut(`/chests/${chest.id}`, updated);
    setChests(prev => prev.map(c => c.id === chest.id ? updated : c));
    setEditingId({ type: null, id: null });
    setEditingValues({});
  }

  // --- Delete ---
  async function deleteFactory(factory) {
    const factoryMachines = machines.filter(m => m.factory_id === factory.id);
    const factoryChests = chests.filter(c => factoryMachines.some(m => m.id === c.machine_id));

    await Promise.all(factoryChests.map(c => apiDelete(`/chests/${c.id}`)));
    await Promise.all(factoryMachines.map(m => apiDelete(`/machines/${m.id}`)));
    await apiDelete(`/factories/${factory.id}`);

    setChests(prev => prev.filter(c => !factoryChests.includes(c)));
    setMachines(prev => prev.filter(m => !factoryMachines.includes(m)));
    setFactories(prev => prev.filter(f => f.id !== factory.id));

    if (selectedFactory?.id === factory.id) setSelectedFactory(null);
    setSelectedMachine(null);
    setSelectedChest(null);
  }

  async function deleteMachine(machine) {
    const machineChests = chests.filter(c => c.machine_id === machine.id);
    await Promise.all(machineChests.map(c => apiDelete(`/chests/${c.id}`)));
    await apiDelete(`/machines/${machine.id}`);

    setChests(prev => prev.filter(c => !machineChests.includes(c)));
    setMachines(prev => prev.filter(m => m.id !== machine.id));

    if (selectedMachine?.id === machine.id) setSelectedMachine(null);
    setSelectedChest(null);
  }

  async function deleteChest(chest) {
    await apiDelete(`/chests/${chest.id}`);
    setChests(prev => prev.filter(c => c.id !== chest.id));
    if (selectedChest?.id === chest.id) setSelectedChest(null);
  }

  // --- Selection ---
  const selectFactory = (f) => {
    setSelectedFactory(f);
    setSelectedMachine(null);
    setSelectedChest(null);
  };
  const selectMachine = (m) => {
    setSelectedMachine(m);
    setSelectedChest(null);
  };
  const selectChest = (c) => setSelectedChest(c);

  // --- Render Edit Panel ---
  let mainContent;
  if (selectedChest) {
    mainContent = (
      <EditPanel
        item={selectedChest}
        type="chest"
        fields={[
          { name: "item_name", label: "Item Name" },
          { name: "amount", label: "Amount", type: "number" },
        ]}
        saveCallback={saveChest}
        deleteCallback={deleteChest}
        childrenList={[]}
        darkMode={darkMode}
      />
    );
  } else if (selectedMachine) {
    const machineChildren = chests.filter(c => c.machine_id === selectedMachine.id).map(c => ({ ...c, type: "chest" }));
    mainContent = (
      <EditPanel
        item={selectedMachine}
        type="machine"
        fields={[
          { name: "name", label: "Machine Name" },
          { name: "coord_x", label: "X Coordinate", type: "number" },
          { name: "coord_y", label: "Y Coordinate", type: "number" },
          { name: "is_enabled", label: "Enabled", type: "checkbox" },
        ]}
        saveCallback={saveMachine}
        addChildCallback={addChest}
        deleteCallback={deleteMachine}
        childrenList={machineChildren}
        darkMode={darkMode}
      />
    );
  } else if (selectedFactory) {
    const factoryMachines = machines.filter(m => m.factory_id === selectedFactory.id).map(m => ({ ...m, type: "machine" }));
    const factoryChests = chests.filter(c => factoryMachines.some(m => m.id === c.machine_id)).map(c => ({ ...c, type: "chest" }));
    const factoryChildren = [...factoryMachines, ...factoryChests];

    mainContent = (
      <EditPanel
        item={selectedFactory}
        type="factory"
        fields={[
          { name: "name", label: "Factory Name" },
          { name: "coord_x", label: "X Coordinate", type: "number" },
          { name: "coord_y", label: "Y Coordinate", type: "number" },
        ]}
        saveCallback={saveFactory}
        addChildCallback={addMachine}
        deleteCallback={deleteFactory}
        childrenList={factoryChildren}
        darkMode={darkMode}
      />
    );
  } else {
    mainContent = (
      <div style={getCardStyles(darkMode)}>
        <p style={{ textAlign: "center" }}>Select a factory, machine, or chest to edit its details.</p>
      </div>
    );
  }

  return (
    <div style={getContainerStyles(darkMode)}>
      <Navbar />
      <div style={getBodyStyles()}>
        <Sidebar
          darkMode={darkMode}
          factories={factories}
          machines={machines}
          chests={chests}
          selectedFactory={selectedFactory}
          selectedMachine={selectedMachine}
          editingId={editingId}
          setEditingId={setEditingId}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          saveFactory={saveFactory}
          saveMachine={saveMachine}
          saveChest={saveChest}
          deleteFactory={deleteFactory}
          deleteMachine={deleteMachine}
          deleteChest={deleteChest}
          addFactory={addFactory}
          addMachine={addMachine}
          addChest={addChest}
          user={user}
          selectFactory={selectFactory}
          selectMachine={selectMachine}
          selectChest={selectChest}
          collapsedFactories={collapsedFactories}
          setCollapsedFactories={setCollapsedFactories}
          collapsedMachines={collapsedMachines}
          setCollapsedMachines={setCollapsedMachines}
        />
        <div style={getMainStyles()}>{mainContent}</div>
      </div>
    </div>
  );
}

// --- Styles (unchanged) ---
const getContainerStyles = (darkMode) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  fontFamily: "sans-serif",
  overflow: "hidden",
  backgroundColor: darkMode ? "#1e1e2f" : "#f0f0f0",
  color: darkMode ? "#fff" : "#000",
});
const getBodyStyles = () => ({ flex: 1, display: "flex", overflow: "hidden" });
const getMainStyles = () => ({
  flex: 1,
  padding: "40px",
  boxSizing: "border-box",
  overflowY: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
});
const getCardStyles = (darkMode) => ({
  width: "100%",
  maxWidth: "500px",
  padding: "30px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)",
  backgroundColor: darkMode ? "#2a2a3d" : "#fff",
});