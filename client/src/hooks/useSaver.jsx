import { apiPut } from "../api/api";

export function useSaver({ state = {}, editingValues = {}, setEditingValues, setEditingId }) {

  const saveFactory = async (factory) => {
    const updated = { ...factory, ...editingValues };
    await apiPut(`/factories/${factory.id}`, updated);
    state.setFactories(prev => prev.map(f => f.id === factory.id ? updated : f));
    setEditingId?.({ type: null, id: null });
    setEditingValues?.({});
  };

  const saveMachine = async (machine) => {
    const updated = { ...machine, ...editingValues };
    await apiPut(`/machines/${machine.id}`, updated);
    state.setMachines(prev => prev.map(m => m.id === machine.id ? updated : m));
    setEditingId?.({ type: null, id: null });
    setEditingValues?.({});
  };

  const saveChest = async (chest) => {
    const updated = { ...chest, ...editingValues };
    await apiPut(`/chests/${chest.id}`, updated);
    state.setChests(prev => prev.map(c => c.id === chest.id ? updated : c));
    setEditingId?.({ type: null, id: null });
    setEditingValues?.({});
  };

  return { saveFactory, saveMachine, saveChest };
}