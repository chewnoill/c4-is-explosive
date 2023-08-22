import { derived, writable } from "svelte/store";

type SELECTION_OPTION = "select" | "rectangle";

function createSelection() {
  const { subscribe, set } = writable("select");

  return {
    subscribe,
    select_action: (selection: SELECTION_OPTION) => set(selection),
  };
}

export const tool_bar = createSelection();


export const isSelecting = derived(tool_bar, ($selection) => $selection == 'select');
