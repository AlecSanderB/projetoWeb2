import { apiDelete } from "../api/api";

export function useDeleter({ state = {}, selectedItem, setSelectedItem }) {
  const deleteFactory = async (factory) => {
    if (factory.id.toString().startsWith("temp")) {
      state.setFactories(prev => prev.filter(f => f.id !== factory.id));
      setSelectedItem(null);
      return;
    }

    const factoryMachines = state.machines.filter(m => m.factory_id === factory.id);
    const factoryChests = state.chests.filter(c =>
      factoryMachines.some(m => m.id === c.machine_id)
    );

    await Promise.all(factoryChests.map(c => apiDelete(`/chests/${c.id}`)));
    await Promise.all(factoryMachines.map(m => apiDelete(`/machines/${m.id}`)));
    await apiDelete(`/factories/${factory.id}`);

    state.setChests(prev => prev.filter(c => !factoryChests.includes(c)));
    state.setMachines(prev => prev.filter(m => !factoryMachines.includes(m)));
    state.setFactories(prev => prev.filter(f => f.id !== factory.id));

    if (selectedItem?.id === factory.id) setSelectedItem(null);
  };

  const deleteMachine = async (machine) => {
    if (machine.id.toString().startsWith("temp")) {
      state.setMachines(prev => prev.filter(m => m.id !== machine.id));
      if (selectedItem?.id === machine.id) setSelectedItem(null);
      return;
    }

    const machineChests = state.chests.filter(c => c.machine_id === machine.id);
    await Promise.all(machineChests.map(c => apiDelete(`/chests/${c.id}`)));
    await apiDelete(`/machines/${machine.id}`);

    state.setChests(prev => prev.filter(c => !machineChests.includes(c)));
    state.setMachines(prev => prev.filter(m => m.id !== machine.id));

    if (selectedItem?.id === machine.id) setSelectedItem(null);
  };

  const deleteChest = async (chest) => {
    if (chest.id.toString().startsWith("temp")) {
      state.setChests(prev => prev.filter(c => c.id !== chest.id));
      if (selectedItem?.id === chest.id) setSelectedItem(null);
      return;
    }

    await apiDelete(`/chests/${chest.id}`);
    state.setChests(prev => prev.filter(c => c.id !== chest.id));
    if (selectedItem?.id === chest.id) setSelectedItem(null);
  };

  return { deleteFactory, deleteMachine, deleteChest };
}