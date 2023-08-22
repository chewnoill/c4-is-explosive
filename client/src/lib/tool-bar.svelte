<script lang="ts">
	import {tool_bar} from './tool-bar-store'

</script>

<div>
	<button on:click={()=>tool_bar.select_action('select')}>select</button>
	<button on:click={()=>tool_bar.select_action('rectangle')}>rectangle</button>
	<span>selected: {$tool_bar}</span>
</div>
