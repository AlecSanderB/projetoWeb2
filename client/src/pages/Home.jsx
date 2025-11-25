import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EditPanel from "../components/EditPanel";
import { apiGet } from "../api/api";
import { useTheme } from "../context/ThemeContext";
import { useAdder } from "../hooks/useAdder";
import { useDeleter } from "../hooks/useDeleter";
import { useSaver } from "../hooks/useSaver";
import {
  getCardStyles,
  getContainerStyles,
  getBodyStyles,
  getMainStyles,
} from "../styles/Styles";

function mergeServerData(prevItems, serverItems) {
  const serverMap = new Map(serverItems.map(item => [String(item.id), { ...item, id: String(item.id) }]));

  const merged = prevItems.map(item => {
    if (item.id.startsWith("temp")) return item;
    return serverMap.get(String(item.id)) || item;
  });

  serverItems.forEach(item => {
    const idStr = String(item.id);
    if (!merged.some(i => String(i.id) === idStr)) merged.push({ ...item, id: idStr });
  });

  return merged;
}


export default function Home() {
  const { darkMode } = useTheme();

  const [user, setUser] = useState(null);
  const [factories, setFactories] = useState([]);
  const [machines, setMachines] = useState([]);
  const [chests, setChests] = useState([]);

  const [editingId, setEditingId] = useState({ type: null, id: null });
  const [editingValues, setEditingValues] = useState({});
  const [collapsedMap, setCollapsedMap] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  // Load user and initial data
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
    setFactories(prev => mergeServerData(prev, factoriesData));

    const allMachines = await apiGet("/machines");
    setMachines(prev => mergeServerData(prev, allMachines));

    const allChests = await apiGet("/chests");
    setChests(prev => mergeServerData(prev, allChests));
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedChests = await apiGet("/chests");
      setChests(prev => mergeServerData(prev, updatedChests));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedItem) return;

    if (String(selectedItem.id).startsWith("temp")) return;

    let updated;
    if (selectedItem.type === "factory") updated = factories.find(f => String(f.id) === String(selectedItem.id));
    else if (selectedItem.type === "machine") updated = machines.find(m => String(m.id) === String(selectedItem.id));
    else if (selectedItem.type === "chest") updated = chests.find(c => String(c.id) === String(selectedItem.id));

    if (updated) setSelectedItem({ ...updated, type: selectedItem.type });
  }, [factories, machines, chests, selectedItem?.id]);


  const state = { factories, setFactories, machines, setMachines, chests, setChests };
  const { addFactory, addMachine, addChest } = useAdder({
    user,
    state,
    selectedItem,
    setSelectedItem,
    setEditingId,
    setEditingValues,
  });
  const { saveFactory, saveMachine, saveChest } = useSaver({
    state,
    editingValues,
    setEditingValues,
    setEditingId,
  });
  const { deleteFactory, deleteMachine, deleteChest } = useDeleter({
    state,
    selectedItem,
    setSelectedItem,
  });

  // Build main EditPanel content
  let mainContent;
  if (!selectedItem) {
    mainContent = (
      <div style={getCardStyles(darkMode)}>
        <p style={{ textAlign: "center" }}>Select a factory, machine, or chest to edit its details.</p>
      </div>
    );
  } else if (selectedItem.type === "chest") {
    mainContent = (
      <EditPanel
        item={selectedItem}
        type="chest"
        saveCallback={saveChest}
        deleteCallback={deleteChest}
        setSelectedItem={setSelectedItem}
        childrenList={[]}
        darkMode={darkMode}
      />
    );
  } else if (selectedItem.type === "machine") {
    const machineChildren = chests
      .filter(c => String(c.machine_id) === String(selectedItem.id))
      .map(c => ({ ...c, type: "chest" }));

    mainContent = (
      <EditPanel
        item={selectedItem}
        type="machine"
        addChildCallback={async () => await addChest(selectedItem)}
        saveCallback={saveMachine}
        deleteCallback={deleteMachine}
        childrenList={machineChildren}
        darkMode={darkMode}
      />
    );
  } else if (selectedItem.type === "factory") {
    const factoryMachines = machines
      .filter(m => String(m.factory_id) === String(selectedItem.id))
      .map(m => ({ ...m, type: "machine" }));
    const factoryChests = chests
      .filter(c => factoryMachines.some(m => String(m.id) === String(c.machine_id)))
      .map(c => ({ ...c, type: "chest" }));
    const factoryChildren = [...factoryMachines, ...factoryChests];

    mainContent = (
      <EditPanel
        item={selectedItem}
        type="factory"
        addChildCallback={async () => await addMachine(selectedItem)}
        saveCallback={saveFactory}
        deleteCallback={deleteFactory}
        childrenList={factoryChildren}
        darkMode={darkMode}
      />
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
          editingId={editingId}
          setEditingId={setEditingId}
          editingValues={editingValues}
          setEditingValues={setEditingValues}
          addFactory={addFactory}
          user={user}
          collapsedMap={collapsedMap}
          setCollapsedMap={setCollapsedMap}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
        <div style={getMainStyles()}>{mainContent}</div>
      </div>
    </div>
  );
}