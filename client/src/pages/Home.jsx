import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EditPanel from "../components/EditPanel";
import { apiGet } from "../api/api";
import { useTheme } from "../context/ThemeContext";
import { useAdder } from "../hooks/useAdder";
import { useDeleter } from "../hooks/useDeleter";
import { useSaver } from "../hooks/useSaver";
import { getCardStyles, getContainerStyles, getBodyStyles, getMainStyles } from "../styles/Styles";

export default function Home() {
  const { darkMode } = useTheme();

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

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedChests = await apiGet("/chests");
      setChests(updatedChests);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // --- Hooks ---
  const state = { factories, setFactories, machines, setMachines, chests, setChests };
  const selected = { selectedFactory, setSelectedFactory, selectedMachine, setSelectedMachine, selectedChest, setSelectedChest };

  const { addFactory, addMachine, addChest } = useAdder({ user, state, selected, setEditingId, setEditingValues });
  const { saveFactory, saveMachine, saveChest } = useSaver({ state, editingValues, setEditingValues, setEditingId });
  const { deleteFactory, deleteMachine, deleteChest } = useDeleter({ state, selected });

  // --- Selection handlers ---
  const selectFactory = f => { setSelectedFactory(f); setSelectedMachine(null); setSelectedChest(null); };
  const selectMachine = m => { setSelectedMachine(m); setSelectedChest(null); };
  const selectChest = c => setSelectedChest(c);

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
    mainContent = <div style={getCardStyles(darkMode)}><p style={{ textAlign: "center" }}>Select a factory, machine, or chest to edit its details.</p></div>;
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