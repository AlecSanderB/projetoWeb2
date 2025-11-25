import { apiPost } from "../api/api";

export function useAdder({ user, state = {}, selectedItem, setSelectedItem }) {
  const typeToRoute = {
    factory: "factories",
    machine: "machines",
    chest: "chests",
  };

  const addItem = async ({ type, newItem, stateSetter }) => {
    if (!user) return;

    // Temporary ID for optimistic UI
    const tempId = `temp-${Date.now()}`;
    const tempItem = { ...newItem, id: tempId, tempId };

    // Add locally
    stateSetter(prev => [...prev, tempItem]);
    setSelectedItem({ ...tempItem, type });

    try {
      const saved = await apiPost(`/${typeToRoute[type]}`, newItem);

      // Skip if server didn't return ID
      if (!saved.id) return;

      // Replace temp with real item
      stateSetter(prev =>
        prev.map(item => (item.id === tempId ? { ...saved, type } : item))
      );

      // Update selection
      setSelectedItem({ ...saved, type });
    } catch (err) {
      console.error(`Failed to add ${type}:`, err);
      stateSetter(prev => prev.filter(item => item.id !== tempId));
      setSelectedItem(null);
    }
  };

  const addFactory = async () => {
    if (!user || user.role_id !== 1) return null;
    const newFactory = { name: "", coord_x: 0, coord_y: 0 };
    return await addItem({ type: "factory", newItem: newFactory, stateSetter: state.setFactories });
  };

  const addMachine = async () => {
    if (!selectedItem || selectedItem.type !== "factory") return;
    const newMachine = { name: "", coord_x: 0, coord_y: 0, is_enabled: true, factory_id: selectedItem.id };
    await addItem({ type: "machine", newItem: newMachine, stateSetter: state.setMachines });
  };

  const addChest = async () => {
    if (!selectedItem || selectedItem.type !== "machine") return;
    const newChest = { coord_x: 0, coord_y: 0, item_name: "", amount: 0, machine_id: selectedItem.id };
    await addItem({ type: "chest", newItem: newChest, stateSetter: state.setChests });
  };

  return { addFactory, addMachine, addChest };
}