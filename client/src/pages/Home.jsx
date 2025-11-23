import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EditPanel from "../components/EditPanel";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { darkMode } = useTheme();

  // --- State ---
  const [user, setUser] = useState(null);
  const [factories, setFactories] = useState([]);
  const [machines, setMachines] = useState([]);
  const [chests, setChests] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedChest, setSelectedChest] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [collapsedFactories, setCollapsedFactories] = useState({});
  const [collapsedMachines, setCollapsedMachines] = useState({});

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
  async function addItem({ type, newItem, stateSetter, apiPath, setSelected, setChildren, tempIdPrefix = "temp" }) {
    if (!user) return;
    const tempId = `${tempIdPrefix}-${Date.now()}`;
    let filledItem = { ...newItem };

    if (type === "chest") filledItem = { coord_x: 0, coord_y: 0, item_name: "", amount: 0, ...newItem };
    else if (type === "machine") filledItem = { coord_x: 0, coord_y: 0, name: "", is_enabled: true, ...newItem };
    else if (type === "factory") filledItem = { coord_x: 0, coord_y: 0, name: "", ...newItem };

    const tempItem = { ...filledItem, id: tempId };
    stateSetter(prev => [...prev, tempItem]);
    setEditingId(tempId);
    setEditingValues(filledItem);

    try {
      const saved = await apiPost(apiPath, filledItem);
      stateSetter(prev => prev.map(item => (item.id === tempId ? saved : item)));
      if (setSelected) setSelected(saved);
      if (setChildren) setChildren([]);
      setEditingId(saved.id);
      setEditingValues(saved);
    } catch (err) {
      console.error(`Failed to add ${type}:`, err);
      stateSetter(prev => prev.filter(item => item.id !== tempId));
    }
  }

  async function addFactory() {
    if (!user || user.role_id !== 1) return null;

    const newFactoryData = { name: "", coord_x: 0, coord_y: 0 };

    try {
      const savedFactory = await apiPost("/factories", newFactoryData);
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
    await addItem({ type: "machine", newItem: { factory_id: selectedFactory.id }, stateSetter: setMachines, apiPath: "/machines", setSelected: setSelectedMachine, setChildren: setChests });
  }

  async function addChest() {
    if (!selectedMachine) return;
    await addItem({ type: "chest", newItem: { machine_id: selectedMachine.id }, stateSetter: setChests, apiPath: "/chests", setSelected: setSelectedChest });
  }
  async function saveFactory(factory) {
    const updated = { ...factory, ...editingValues };
    await apiPut(`/factories/${factory.id}`, updated);
    setFactories(factories.map(f => f.id === factory.id ? updated : f));
    setEditingId(null);
    setEditingValues({});
  }

  async function saveMachine(machine) {
    const updated = { ...machine, ...editingValues };
    await apiPut(`/machines/${machine.id}`, updated);
    setMachines(machines.map(m => m.id === machine.id ? updated : m));
    setEditingId(null);
    setEditingValues({});
  }

  async function saveChest(chest) {
    const updated = { ...chest, ...editingValues };
    await apiPut(`/chests/${chest.id}`, updated);
    setChests(chests.map(c => c.id === chest.id ? updated : c));
    setEditingId(null);
    setEditingValues({});
  }

  async function deleteFactory(factory) {
    const factoryMachines = machines.filter(m => m.factory_id === factory.id);
    const factoryChests = chests.filter(c => factoryMachines.some(m => m.id === c.machine_id));

    await Promise.all(factoryChests.map(c => apiDelete(`/chests/${c.id}`)));
    await Promise.all(factoryMachines.map(m => apiDelete(`/machines/${m.id}`)));
    await apiDelete(`/factories/${factory.id}`);

    setChests(chests.filter(c => !factoryChests.includes(c)));
    setMachines(machines.filter(m => !factoryMachines.includes(m)));
    setFactories(factories.filter(f => f.id !== factory.id));

    if (selectedFactory?.id === factory.id) setSelectedFactory(null);
    setSelectedMachine(null);
    setSelectedChest(null);
  }

  async function deleteMachine(machine) {
    const machineChests = chests.filter(c => c.machine_id === machine.id);
    await Promise.all(machineChests.map(c => apiDelete(`/chests/${c.id}`)));
    await apiDelete(`/machines/${machine.id}`);

    setChests(chests.filter(c => !machineChests.includes(c)));
    setMachines(machines.filter(m => m.id !== machine.id));

    if (selectedMachine?.id === machine.id) setSelectedMachine(null);
    setSelectedChest(null);
  }

  async function deleteChest(chest) {
    await apiDelete(`/chests/${chest.id}`);
    setChests(chests.filter(c => c.id !== chest.id));
    if (selectedChest?.id === chest.id) setSelectedChest(null);
  }

  // --- Selection handlers ---
  function selectFactory(factory) {
    setSelectedFactory(factory);
    setSelectedMachine(null);
    setSelectedChest(null);
  }

  function selectMachine(machine) {
    setSelectedMachine(machine);
    setSelectedChest(null);
  }

  function selectChest(chest) {
    setSelectedChest(chest);
  }

  // --- Main content / Edit panel ---
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
    const machineChildren = chests.filter(c => c.machine_id === selectedMachine.id)
      .map(c => ({ ...c, type: "chest" }));
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
    const factoryMachines = machines.filter(m => m.factory_id === selectedFactory.id)
      .map(m => ({ ...m, type: "machine" }));
    const factoryChests = chests
      .filter(c => factoryMachines.some(m => m.id === c.machine_id))
      .map(c => ({ ...c, type: "chest" }));
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
          selectedFactory={selectedFactory}
          selectedMachine={selectedMachine}
          machines={machines}
          chests={chests}
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

// --- Dynamic styles ---
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