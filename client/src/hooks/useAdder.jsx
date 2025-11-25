import { apiPost } from "../api/api";

export function useAdder({
  user,
  state = {}, // { factories, setFactories, machines, setMachines, chests, setChests }
  selected = {}, // { selectedFactory, setSelectedFactory, selectedMachine, setSelectedMachine, selectedChest, setSelectedChest }
  setEditingId,
  setEditingValues
}) {

  const addItem = async ({ type, newItem, stateSetter, setSelected, tempIdPrefix = "temp" }) => {
    if (!user) return;

    const tempId = `${tempIdPrefix}-${Date.now()}`;
    const tempItem = { ...newItem, id: tempId };

    stateSetter(prev => [...prev, tempItem]);
    if (setSelected) setSelected(tempItem);
    setEditingId({ type, id: tempId });
    setEditingValues(newItem);

    try {
      const saved = await apiPost(`/${type}s`, newItem);
      stateSetter(prev => prev.map(item => (item.id === tempId ? saved : item)));
      if (setSelected) setSelected(saved);
      setEditingId({ type, id: saved.id });
      setEditingValues(saved);
    } catch (err) {
      console.error(`Failed to add ${type}:`, err);
      stateSetter(prev => prev.filter(item => item.id !== tempId));
    }
  };

  const addFactory = async () => {
    if (!user || user.role_id !== 1) return null;

    const newFactory = { name: "", coord_x: 0, coord_y: 0 };
    try {
      const savedFactory = await apiPost("/factories", newFactory);
      state.setFactories(prev => [...prev, savedFactory]);
      selected.setSelectedFactory?.(savedFactory);
      selected.setSelectedMachine?.(null);
      selected.setSelectedChest?.(null);
      return savedFactory;
    } catch (err) {
      console.error("Failed to add factory:", err);
      return null;
    }
  };

  const addMachine = async () => {
    if (!selected.selectedFactory) return;

    await addItem({
      type: "machine",
      newItem: { name: "", coord_x: 0, coord_y: 0, is_enabled: true, factory_id: selected.selectedFactory.id },
      stateSetter: state.setMachines,
      setSelected: selected.setSelectedMachine
    });
  };

  const addChest = async () => {
    if (!selected.selectedMachine) return;

    await addItem({
      type: "chest",
      newItem: { coord_x: 0, coord_y: 0, item_name: "", amount: 0, machine_id: selected.selectedMachine.id },
      stateSetter: state.setChests,
      setSelected: selected.setSelectedChest
    });
  };

  return { addFactory, addMachine, addChest };
}