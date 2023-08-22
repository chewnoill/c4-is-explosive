<script lang="ts">
  import { readableArray } from "svelt-yjs";
  import * as Y from "yjs";
  import { WebrtcProvider } from "y-webrtc";

  // All Yjs types must be embedded in a Y.Doc
  const ydoc: Y.Doc = new Y.Doc();
  const webrtcProvider = new WebrtcProvider("temp", ydoc, {
    signaling: ["ws://localhost:5173/ws/signal"],
  } as any);
  webrtcProvider.awareness.setLocalStateField("user", {});

  // Create a Y.Array in the Y.Doc
  const yobjects: Y.Array<string> = ydoc.getArray("objects");

  // Generate a Svelte readable store from the Y.Array
  const list = readableArray(yobjects);

</script>

{#each $list as item, i}
  <div>
    {item}
    <button on:click={() => list.y.delete(i)}>remove</button>
  </div>
{/each}
