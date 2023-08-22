<script lang="ts">
	import {isSelecting, tool_bar} from './lib/tool-bar-store'
  import { readableMap } from "svelt-yjs";
  import * as Y from "yjs";

  export let i: number; //index
  export let content: Y.Text;
  export let meta: Y.Map<any>;

  function debugEvent(tag,evt,dragging){
    if([evt.x,evt.y,dragging?.x.dragging?.y].includes(NaN)){
      console.log()
      throw new Error(`${tag} invalid event ${[evt.x,evt.y,dragging.x.dragging.y]}`)
    }
  }

  let dragging: boolean | any = false;
  let selected: boolean | any = false;
  let metastore = readableMap(meta);
  let pos = [$metastore.get("x"), $metastore.get("y")];

  function onClick() {
    selected = !selected;
  }

  function dragStart(evt) {
    if(!$isSelecting) return false;
    console.log({selecting: true, $tool_bar})
    dragging = evt;
  }

  function dragOver(evt) {
    if(!isSelecting) return false;
    let x = evt.x - dragging.x;
    let y = evt.y - dragging.y;
    pos = [pos[0] + x, pos[1] + y];
    meta.set("x", pos[0]);
    meta.set("y", pos[1]);
    dragging = evt;
  }
  function dragEnd(evt) {
    if(!isSelecting) return false;
    let x = evt.x - dragging.x;
    let y = evt.y - dragging.y;
    pos = [pos[0] + x, pos[1] + y];
    meta.set("x", pos[0]);
    meta.set("y", pos[1]);
    dragging = false;
  }

  function debug(action) {
    return (evt) => {
      console.log("debug", action, evt);
    };
  }
  console.log({ pos });
</script>

<button
  style="left:{$metastore.get('x')}px;top:{$metastore.get('y')}px"
  class="box {$isSelecting && 'selecting'}"
  data-obj-index={i}
  draggable={$isSelecting}
  on:click={onClick}
  on:dragstart={dragStart}
  on:dragend={dragEnd}
  on:dragover={dragOver}
>
  {content.toString()}:{i}
</button>

<style>
  .selecting {
    cursor: pointer;
  }
  .box {
    border: 1px solid gray;
    height: 58px;
    width: 58px;
    background: white;
    position: absolute;
    left: 20px;
    top: 20px;
  }
</style>
