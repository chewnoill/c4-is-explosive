<script lang="ts">
  import { YDoc, createObject, type DocumentObject } from "./lib/yjs";
  import { readableArray } from "svelt-yjs";
  import * as Y from "yjs";
  import Yjs from "./lib/yjs.svelte";
  import Object from "./Object.svelte";
  import ToolBar from "./lib/tool-bar.svelte";
  let ydoc = new YDoc("testing");

  ydoc.add_object(createObject({ x: 50, y: 50 }, "test"));
  const objects = readableArray(ydoc.object_list);
</script>

  <ToolBar/>
<main
  on:dragover={(e) => {
    e.preventDefault();
  }}
>
  <div class="grid">
    {#each { length: 100 } as _, i}
      <div class="row">
        {#each { length: 100 } as _, j}
          <div class="col" />
        {/each}
      </div>
    {/each}
  </div>
  {#each $objects as obj, i}
    <Object meta={obj} content={obj.get('content')} {i}/>
  {/each}
</main>

<style>
  main {
    width: 100%;
    height: 100%;
  }

  .grid {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .row {
    height: 20px;
    display: flex;
  }
  .col {
    font-size: 10px;
    width: 18px;
    overflow: hidden;
    border: 1px solid rgb(217, 217, 217);
  }
  .box {
    border: 1px solid gray;
    height: 58px;
    width: 58px;
    cursor: pointer;
    background: white;
    position: relative;
    left: 20px;
    top: 20px;
  }
  .box.selected {
    border: 2px solid tomato;
  }
  .attachment {
    background: tomato;
    height: 5px;
    width: 5px;
    cursor: pointer;
  }
  .attachment:hover {
    outline: 2px solid yellow;
  }
</style>
